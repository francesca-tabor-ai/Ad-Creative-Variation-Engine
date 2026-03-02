import { db, creativeVariants, templates, renderJobs } from "@acve/db";
import { eq, and, inArray } from "drizzle-orm";
import { nanoid } from "nanoid";

export interface OrchestrationRequest {
  campaignId: string;
  variantIds: string[];
  formats?: string[];
  templateId?: string;
}

export interface OrchestrationResult {
  renderJobIds: string[];
  skipped: Array<{ variantId: string; reason: string }>;
}

/**
 * Orchestrate production: validate approved variants, match templates, create render jobs.
 * Does NOT enqueue to BullMQ — returns render job records for the caller to enqueue.
 */
export async function orchestrateProduction(
  request: OrchestrationRequest,
): Promise<OrchestrationResult> {
  const { campaignId, variantIds, formats, templateId } = request;

  // Load all requested variants
  const variants = await db
    .select()
    .from(creativeVariants)
    .where(
      and(
        eq(creativeVariants.campaignId, campaignId),
        inArray(creativeVariants.id, variantIds),
      ),
    );

  const renderJobIds: string[] = [];
  const skipped: Array<{ variantId: string; reason: string }> = [];

  for (const variant of variants) {
    // Only approved variants can be rendered
    if (variant.status !== "approved") {
      skipped.push({ variantId: variant.id, reason: `Status is "${variant.status}", must be "approved"` });
      continue;
    }

    // Find matching template
    let matchedTemplate;
    if (templateId) {
      const [t] = await db
        .select()
        .from(templates)
        .where(eq(templates.id, templateId))
        .limit(1);
      matchedTemplate = t;
    } else {
      // Auto-match by platform — pick first matching template
      const [t] = await db
        .select()
        .from(templates)
        .where(eq(templates.platform, variant.platform))
        .limit(1);
      matchedTemplate = t;
    }

    if (!matchedTemplate) {
      skipped.push({ variantId: variant.id, reason: `No template found for platform "${variant.platform}"` });
      continue;
    }

    // Determine formats to render
    const renderFormats = formats && formats.length > 0 ? formats : [matchedTemplate.format];

    for (const format of renderFormats) {
      const jobId = `rnd_${nanoid(21)}`;

      await db.insert(renderJobs).values({
        id: jobId,
        variantId: variant.id,
        templateId: matchedTemplate.id,
        status: "queued",
        format,
        language: "en",
        priority: 5,
        createdAt: new Date(),
      });

      renderJobIds.push(jobId);
    }

    // Update variant status to in_production
    await db
      .update(creativeVariants)
      .set({ status: "in_production", updatedAt: new Date() })
      .where(eq(creativeVariants.id, variant.id));
  }

  // Flag variants that were requested but not found
  const foundIds = new Set(variants.map((v) => v.id));
  for (const id of variantIds) {
    if (!foundIds.has(id)) {
      skipped.push({ variantId: id, reason: "Variant not found" });
    }
  }

  return { renderJobIds, skipped };
}
