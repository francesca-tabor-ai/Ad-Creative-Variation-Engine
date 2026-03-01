import { NextRequest, NextResponse } from "next/server";

// POST /api/campaigns/:campaignId/deploy — trigger deployment (Phase 3)
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ campaignId: string }> },
) {
  const { campaignId } = await params;
  const body = await request.json();
  // TODO: validate deployment request, enqueue deploy jobs
  return NextResponse.json({ campaignId, deployment: body }, { status: 202 });
}
