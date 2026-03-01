import { NextRequest, NextResponse } from "next/server";

// GET /api/campaigns/:campaignId/variants — list variants
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ campaignId: string }> },
) {
  const { campaignId } = await params;
  // TODO: query db for variants by campaignId
  return NextResponse.json({ campaignId, variants: [], total: 0 });
}

// POST /api/campaigns/:campaignId/variants — generate variants
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ campaignId: string }> },
) {
  const { campaignId } = await params;
  const body = await request.json();
  // TODO: validate with generateVariantsSchema, call AI provider, store results
  return NextResponse.json({ campaignId, generated: body }, { status: 201 });
}
