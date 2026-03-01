import { NextRequest, NextResponse } from "next/server";

// POST /api/campaigns/:campaignId/render — trigger batch render (Phase 2)
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ campaignId: string }> },
) {
  const { campaignId } = await params;
  const body = await request.json();
  // TODO: validate with batchRenderSchema, enqueue render jobs via BullMQ
  return NextResponse.json({ campaignId, queued: body }, { status: 202 });
}
