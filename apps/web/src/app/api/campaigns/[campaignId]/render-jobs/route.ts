import { NextRequest, NextResponse } from "next/server";
import { db, renderJobs, creativeVariants } from "@acve/db";
import { eq, inArray } from "drizzle-orm";

// GET /api/campaigns/:campaignId/render-jobs — list render jobs for campaign
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ campaignId: string }> },
) {
  try {
    const { campaignId } = await params;

    // Get all variant IDs for this campaign
    const variants = await db
      .select({ id: creativeVariants.id })
      .from(creativeVariants)
      .where(eq(creativeVariants.campaignId, campaignId));

    if (variants.length === 0) {
      return NextResponse.json({ renderJobs: [], total: 0 });
    }

    const variantIds = variants.map((v) => v.id);

    // Get all render jobs for these variants
    const filteredJobs = await db
      .select({
        id: renderJobs.id,
        variantId: renderJobs.variantId,
        templateId: renderJobs.templateId,
        status: renderJobs.status,
        format: renderJobs.format,
        resolution: renderJobs.resolution,
        priority: renderJobs.priority,
        errorMessage: renderJobs.errorMessage,
        startedAt: renderJobs.startedAt,
        completedAt: renderJobs.completedAt,
        createdAt: renderJobs.createdAt,
      })
      .from(renderJobs)
      .where(inArray(renderJobs.variantId, variantIds))
      .orderBy(renderJobs.createdAt);

    return NextResponse.json({ renderJobs: filteredJobs, total: filteredJobs.length });
  } catch (error) {
    console.error("Failed to list render jobs:", error);
    return NextResponse.json({ error: "Failed to list render jobs" }, { status: 500 });
  }
}
