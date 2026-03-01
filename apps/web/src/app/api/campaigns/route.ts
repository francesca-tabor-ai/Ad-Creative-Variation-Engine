import { NextRequest, NextResponse } from "next/server";

// GET /api/campaigns — list campaigns
export async function GET(_request: NextRequest) {
  // TODO: query db for campaigns
  return NextResponse.json({ campaigns: [], total: 0 });
}

// POST /api/campaigns — create campaign
export async function POST(request: NextRequest) {
  const body = await request.json();
  // TODO: validate with createCampaignSchema, insert into db
  return NextResponse.json({ campaign: body }, { status: 201 });
}
