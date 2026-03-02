import { NextRequest, NextResponse } from "next/server";
import { configureGovernanceSchema } from "@acve/shared";
import { db, governanceConfigs, campaigns } from "@acve/db";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";

// GET /api/campaigns/:campaignId/governance — fetch governance config
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ campaignId: string }> },
) {
  try {
    const { campaignId } = await params;

    const [config] = await db
      .select()
      .from(governanceConfigs)
      .where(eq(governanceConfigs.campaignId, campaignId))
      .limit(1);

    if (!config) {
      // Return defaults if no config exists
      return NextResponse.json({
        config: {
          campaignId,
          approvalThreshold: 0.6,
          requiredReviewerCount: 1,
          vetoRoles: [],
          voteWeights: {},
          autoApproveIfUnanimous: true,
        },
        isDefault: true,
      });
    }

    return NextResponse.json({ config, isDefault: false });
  } catch (error) {
    console.error("Failed to fetch governance config:", error);
    return NextResponse.json({ error: "Failed to fetch governance config" }, { status: 500 });
  }
}

// PUT /api/campaigns/:campaignId/governance — upsert governance config
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ campaignId: string }> },
) {
  try {
    const { campaignId } = await params;
    const body = await request.json();
    const parsed = configureGovernanceSchema.safeParse({ ...body, campaignId });

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    // Verify campaign exists
    const [campaign] = await db
      .select()
      .from(campaigns)
      .where(eq(campaigns.id, campaignId))
      .limit(1);

    if (!campaign) {
      return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
    }

    // Upsert: check if config exists
    const [existing] = await db
      .select()
      .from(governanceConfigs)
      .where(eq(governanceConfigs.campaignId, campaignId))
      .limit(1);

    let config;
    if (existing) {
      [config] = await db
        .update(governanceConfigs)
        .set({
          approvalThreshold: parsed.data.approvalThreshold,
          vetoRoles: parsed.data.vetoRoles || [],
          voteWeights: parsed.data.voteWeights || {},
          updatedAt: new Date(),
        })
        .where(eq(governanceConfigs.campaignId, campaignId))
        .returning();
    } else {
      [config] = await db
        .insert(governanceConfigs)
        .values({
          id: `gov_${nanoid(21)}`,
          campaignId,
          approvalThreshold: parsed.data.approvalThreshold ?? 0.6,
          requiredReviewerCount: 1,
          vetoRoles: parsed.data.vetoRoles || [],
          voteWeights: parsed.data.voteWeights || {},
          autoApproveIfUnanimous: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .returning();
    }

    return NextResponse.json({ config });
  } catch (error) {
    console.error("Failed to update governance config:", error);
    return NextResponse.json({ error: "Failed to update governance config" }, { status: 500 });
  }
}
