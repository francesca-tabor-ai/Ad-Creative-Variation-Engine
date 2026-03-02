import { NextRequest, NextResponse } from "next/server";
import { db, assets, renderJobs, creativeVariants } from "@acve/db";
import { eq, inArray } from "drizzle-orm";

// GET /api/campaigns/:campaignId/assets — list rendered assets for campaign
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
      return NextResponse.json({ assets: [], total: 0 });
    }

    const variantIds = variants.map((v) => v.id);

    // Get render jobs for these variants
    const jobs = await db
      .select({ id: renderJobs.id })
      .from(renderJobs)
      .where(inArray(renderJobs.variantId, variantIds));

    if (jobs.length === 0) {
      return NextResponse.json({ assets: [], total: 0 });
    }

    const jobIds = jobs.map((j) => j.id);

    // Get assets for these render jobs
    const result = await db
      .select()
      .from(assets)
      .where(inArray(assets.renderJobId, jobIds))
      .orderBy(assets.createdAt);

    return NextResponse.json({ assets: result, total: result.length });
  } catch (error) {
    console.error("Failed to list assets:", error);
    return NextResponse.json({ error: "Failed to list assets" }, { status: 500 });
  }
}
