import { NextRequest, NextResponse } from "next/server";
import { createTemplateSchema } from "@acve/shared";
import { db, templates } from "@acve/db";
import { eq, and } from "drizzle-orm";
import { nanoid } from "nanoid";

// GET /api/templates — list templates with optional filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const platform = searchParams.get("platform");
    const format = searchParams.get("format");

    const conditions = [];
    if (platform) conditions.push(eq(templates.platform, platform));
    if (format) conditions.push(eq(templates.format, format));

    const result = await db
      .select()
      .from(templates)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(templates.createdAt);

    return NextResponse.json({ templates: result, total: result.length });
  } catch (error) {
    console.error("Failed to list templates:", error);
    return NextResponse.json({ error: "Failed to list templates" }, { status: 500 });
  }
}

// POST /api/templates — create a new template
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = createTemplateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const [template] = await db
      .insert(templates)
      .values({
        id: `tpl_${nanoid(21)}`,
        name: parsed.data.name,
        description: parsed.data.description || null,
        platform: parsed.data.platform,
        format: parsed.data.format,
        version: parsed.data.version ?? 1,
        components: parsed.data.components || {},
        constraints: parsed.data.constraints || {},
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    return NextResponse.json({ template }, { status: 201 });
  } catch (error) {
    console.error("Failed to create template:", error);
    return NextResponse.json({ error: "Failed to create template" }, { status: 500 });
  }
}
