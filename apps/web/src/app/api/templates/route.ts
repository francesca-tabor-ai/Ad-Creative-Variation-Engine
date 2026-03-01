import { NextRequest, NextResponse } from "next/server";

// GET /api/templates — list templates (Phase 2)
export async function GET(_request: NextRequest) {
  // TODO: query db for templates
  return NextResponse.json({ templates: [], total: 0 });
}

// POST /api/templates — create template (Phase 2)
export async function POST(request: NextRequest) {
  const body = await request.json();
  // TODO: validate with createTemplateSchema, insert into db
  return NextResponse.json({ template: body }, { status: 201 });
}
