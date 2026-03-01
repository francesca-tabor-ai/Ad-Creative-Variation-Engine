import { NextRequest, NextResponse } from "next/server";
import { generateVariantsSchema, generateVariantId } from "@acve/shared";
import { db, creativeVariants, campaigns } from "@acve/db";
import { eq, desc } from "drizzle-orm";
import { generateVariants } from "@acve/ai";

// GET /api/campaigns/:campaignId/variants — list variants
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ campaignId: string }> },
) {
  try {
    const { campaignId } = await params;

    const results = await db
      .select()
      .from(creativeVariants)
      .where(eq(creativeVariants.campaignId, campaignId))
      .orderBy(desc(creativeVariants.createdAt));

    return NextResponse.json({ campaignId, variants: results, total: results.length });
  } catch (error) {
    console.error("Failed to list variants:", error);
    return NextResponse.json({ error: "Failed to list variants" }, { status: 500 });
  }
}

// POST /api/campaigns/:campaignId/variants — generate variants
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ campaignId: string }> },
) {
  try {
    const { campaignId } = await params;
    const body = await request.json();
    const parsed = generateVariantsSchema.safeParse({ ...body, campaignId });

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    // Load campaign context
    const [campaign] = await db
      .select()
      .from(campaigns)
      .where(eq(campaigns.id, campaignId))
      .limit(1);

    if (!campaign) {
      return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
    }

    // Generate variants via AI
    const platforms = (campaign.targetPlatforms as string[]) || ["meta"];
    const platform = platforms[0] || "meta";

    const result = await generateVariants({
      provider: parsed.data.provider,
      campaignContext: {
        brandName: campaign.brandName,
        targetAudience: campaign.targetAudience || undefined,
        offerDetails: campaign.offerDetails || undefined,
        funnelStage: campaign.funnelStage,
        platform,
      },
      angles: parsed.data.angles,
      count: parsed.data.count,
      promptOverrides: parsed.data.promptOverrides,
    });

    // Store generated variants
    const now = new Date();
    const variantRecords = result.variants.map((v) => ({
      id: generateVariantId(),
      campaignId,
      status: "in_review" as const,
      version: 1,
      platform: v.platform || platform,
      funnelStage: campaign.funnelStage,
      angle: v.angle || "benefit",
      content: {
        headline: v.headline,
        primaryText: v.primaryText,
        description: v.description,
        callToAction: v.callToAction,
        imagePrompt: v.imagePrompt,
      },
      aiProvider: result.provider,
      generationCostCents: Math.ceil(result.estimatedCostCents / result.variants.length),
      createdAt: now,
      updatedAt: now,
    }));

    if (variantRecords.length > 0) {
      await db.insert(creativeVariants).values(variantRecords);
    }

    return NextResponse.json(
      {
        campaignId,
        variants: variantRecords.map((r) => ({
          id: r.id,
          headline: r.content.headline,
          primaryText: r.content.primaryText,
          callToAction: r.content.callToAction,
          angle: r.angle,
          platform: r.platform,
          status: r.status,
        })),
        usage: result.usage,
        estimatedCostCents: result.estimatedCostCents,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Failed to generate variants:", error);
    return NextResponse.json({ error: "Failed to generate variants" }, { status: 500 });
  }
}
