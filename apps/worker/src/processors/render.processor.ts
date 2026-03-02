import { Job } from "bullmq";
import type { RenderJobData } from "../queues/render.queue";
import { db, renderJobs, creativeVariants, templates, assets } from "@acve/db";
import { eq } from "drizzle-orm";
import { renderVariant } from "@acve/renderer";
import { uploadAsset } from "@acve/storage";
import { nanoid } from "nanoid";

export async function processRenderJob(job: Job<RenderJobData>): Promise<void> {
  const { variantId, templateId, format, campaignId } = job.data;
  const renderJobId = job.name || job.id || "";

  console.log(`[render] Processing job ${job.id}: variant=${variantId} template=${templateId} format=${format}`);

  try {
    // Update render job status to processing
    await db
      .update(renderJobs)
      .set({ status: "processing", startedAt: new Date() })
      .where(eq(renderJobs.id, renderJobId));

    await job.updateProgress(10);

    // 1. Load template
    const [template] = await db
      .select()
      .from(templates)
      .where(eq(templates.id, templateId))
      .limit(1);

    if (!template) {
      throw new Error(`Template ${templateId} not found`);
    }

    await job.updateProgress(20);

    // 2. Load variant content
    const [variant] = await db
      .select()
      .from(creativeVariants)
      .where(eq(creativeVariants.id, variantId))
      .limit(1);

    if (!variant) {
      throw new Error(`Variant ${variantId} not found`);
    }

    await job.updateProgress(30);

    // 3. Render to image
    const result = await renderVariant({
      template: {
        components: template.components as Record<string, unknown> | undefined,
        constraints: template.constraints as Record<string, unknown> | undefined,
        platform: template.platform,
        format: template.format,
      },
      content: variant.content as Record<string, string>,
      format,
    });

    await job.updateProgress(70);

    // 4. Upload to storage
    const storageKey = `campaigns/${campaignId}/renders/${variantId}/${nanoid(8)}.png`;
    const { url } = await uploadAsset(result.buffer, storageKey, result.mimeType);

    await job.updateProgress(85);

    // 5. Create asset record
    const assetId = `ast_${nanoid(21)}`;
    await db.insert(assets).values({
      id: assetId,
      renderJobId,
      url,
      format,
      mimeType: result.mimeType,
      fileSizeBytes: result.fileSizeBytes,
      language: "en",
      tags: [template.platform, format],
      metadata: {
        width: result.width,
        height: result.height,
        campaignId,
        variantId,
        templateId,
      },
      createdAt: new Date(),
    });

    // 6. Update render job to completed
    await db
      .update(renderJobs)
      .set({ status: "completed", completedAt: new Date() })
      .where(eq(renderJobs.id, renderJobId));

    // 7. Update variant status to rendered
    await db
      .update(creativeVariants)
      .set({ status: "rendered", updatedAt: new Date() })
      .where(eq(creativeVariants.id, variantId));

    await job.updateProgress(100);
    console.log(`[render] Job ${job.id} completed: asset=${assetId}`);
  } catch (error) {
    console.error(`[render] Job ${job.id} failed:`, error);

    // Update render job to failed
    await db
      .update(renderJobs)
      .set({
        status: "failed",
        errorMessage: error instanceof Error ? error.message : "Unknown error",
        completedAt: new Date(),
      })
      .where(eq(renderJobs.id, renderJobId));

    throw error;
  }
}
