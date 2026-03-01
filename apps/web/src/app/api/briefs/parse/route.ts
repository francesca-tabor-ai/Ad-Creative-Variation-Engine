import { NextRequest, NextResponse } from "next/server";

// POST /api/briefs/parse — parse a creative brief via NLP
export async function POST(request: NextRequest) {
  const body = await request.json();
  // TODO: validate input, call parseBrief from @acve/ai
  return NextResponse.json({ parsed: body });
}
