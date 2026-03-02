import { NextRequest, NextResponse } from "next/server";
import { batchRenderSchema } from "@acve/shared";
import { orchestrateProduction } from "@acve/ai";

// POST /api/campaigns/:campaignId/render — trigger batch render
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ campaignId: string }> },
) {
  try {
    const { campaignId } = await params;
    const body = await request.json();
    const parsed = batchRenderSchema.safeParse({ ...body, campaignId });

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const result = await orchestrateProduction({
      campaignId,
      variantIds: parsed.data.variantIds,
      formats: parsed.data.formats,
      templateId: parsed.data.templateId,
    });

    // TODO: enqueue render jobs to BullMQ when worker is connected
    // For now, jobs are created in DB with status "queued"

    return NextResponse.json(
      {
        campaignId,
        renderJobIds: result.renderJobIds,
        skipped: result.skipped,
        totalQueued: result.renderJobIds.length,
      },
      { status: 202 },
    );
  } catch (error) {
    console.error("Failed to trigger render:", error);
    return NextResponse.json({ error: "Failed to trigger render" }, { status: 500 });
  }
}
