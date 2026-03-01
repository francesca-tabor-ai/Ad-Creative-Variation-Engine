import { NextRequest, NextResponse } from "next/server";

// POST /api/campaigns/:campaignId/variants/:variantId/review — cast vote
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ campaignId: string; variantId: string }> },
) {
  const { campaignId, variantId } = await params;
  const body = await request.json();
  // TODO: validate with castVoteSchema, store vote, recalculate approval score
  return NextResponse.json({ campaignId, variantId, vote: body }, { status: 201 });
}
