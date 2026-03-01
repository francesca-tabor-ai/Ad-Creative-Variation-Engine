import { NextRequest, NextResponse } from "next/server";

// POST /api/cost/estimate — estimate generation cost
export async function POST(request: NextRequest) {
  const body = await request.json();
  // TODO: validate input, call estimateGenerationCost from @acve/ai
  return NextResponse.json({ estimate: body });
}
