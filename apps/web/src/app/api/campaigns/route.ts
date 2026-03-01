import { NextRequest, NextResponse } from "next/server";
import { createCampaignSchema, generateCampaignId } from "@acve/shared";
import { db, campaigns } from "@acve/db";
import { desc } from "drizzle-orm";

// GET /api/campaigns — list campaigns
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get("limit") || "50");
    const offset = parseInt(url.searchParams.get("offset") || "0");

    const results = await db
      .select()
      .from(campaigns)
      .orderBy(desc(campaigns.createdAt))
      .limit(limit)
      .offset(offset);

    return NextResponse.json({ campaigns: results, total: results.length });
  } catch (error) {
    console.error("Failed to list campaigns:", error);
    return NextResponse.json({ error: "Failed to list campaigns" }, { status: 500 });
  }
}

// POST /api/campaigns — create campaign
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = createCampaignSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const id = generateCampaignId();
    const now = new Date();

    const [campaign] = await db
      .insert(campaigns)
      .values({
        id,
        name: parsed.data.name,
        description: parsed.data.description || null,
        brandName: parsed.data.brandName,
        targetPlatforms: parsed.data.targetPlatforms,
        funnelStage: parsed.data.funnelStage,
        targetAudience: parsed.data.targetAudience || null,
        offerDetails: parsed.data.offerDetails || null,
        budgetCents: parsed.data.budgetCents || null,
        metadata: parsed.data.metadata || null,
        status: "draft",
        createdAt: now,
        updatedAt: now,
      })
      .returning();

    return NextResponse.json({ campaign }, { status: 201 });
  } catch (error) {
    console.error("Failed to create campaign:", error);
    return NextResponse.json({ error: "Failed to create campaign" }, { status: 500 });
  }
}
