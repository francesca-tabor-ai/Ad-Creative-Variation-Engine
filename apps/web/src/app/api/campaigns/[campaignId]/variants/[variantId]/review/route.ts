import { NextRequest, NextResponse } from "next/server";
import { castVoteSchema, computeGovernanceScore } from "@acve/shared";
import { db, reviews, creativeVariants, governanceConfigs, governanceAuditLog } from "@acve/db";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";

// POST /api/campaigns/:campaignId/variants/:variantId/review — cast vote
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ campaignId: string; variantId: string }> },
) {
  try {
    const { campaignId, variantId } = await params;
    const body = await request.json();
    const parsed = castVoteSchema.safeParse({ ...body, variantId });

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    // Verify variant exists
    const [variant] = await db
      .select()
      .from(creativeVariants)
      .where(eq(creativeVariants.id, variantId))
      .limit(1);

    if (!variant || variant.campaignId !== campaignId) {
      return NextResponse.json({ error: "Variant not found" }, { status: 404 });
    }

    // Store vote
    const reviewId = `rev_${nanoid(21)}`;
    const [review] = await db
      .insert(reviews)
      .values({
        id: reviewId,
        variantId,
        userId: "system", // TODO: replace with authenticated user ID
        decision: parsed.data.decision,
        weight: 1,
        comment: parsed.data.comment || null,
        createdAt: new Date(),
      })
      .returning();

    // Load all reviews for this variant
    const allReviews = await db
      .select()
      .from(reviews)
      .where(eq(reviews.variantId, variantId));

    // Load governance config (or use defaults)
    const [govConfig] = await db
      .select()
      .from(governanceConfigs)
      .where(eq(governanceConfigs.campaignId, campaignId))
      .limit(1);

    // Compute governance score
    const reviewInputs = allReviews.map((r) => ({
      decision: r.decision,
      weight: r.weight,
      userId: r.userId,
    }));

    const govResult = computeGovernanceScore(reviewInputs, {
      approvalThreshold: govConfig?.approvalThreshold ?? 0.6,
      requiredReviewerCount: govConfig?.requiredReviewerCount ?? 1,
      vetoRoles: (govConfig?.vetoRoles as string[]) ?? [],
      voteWeights: (govConfig?.voteWeights as Record<string, number>) ?? {},
      autoApproveIfUnanimous: govConfig?.autoApproveIfUnanimous ?? true,
    });

    // Update variant status based on governance result
    const previousStatus = variant.status;
    let newStatus = previousStatus;

    if (govResult.vetoed) {
      newStatus = "rejected";
    } else if (govResult.approved) {
      newStatus = "approved";
    } else if (govResult.rejected) {
      newStatus = "rejected";
    }

    if (newStatus !== previousStatus) {
      await db
        .update(creativeVariants)
        .set({ status: newStatus, updatedAt: new Date() })
        .where(eq(creativeVariants.id, variantId));

      // Audit log for status change
      await db.insert(governanceAuditLog).values({
        id: `aud_${nanoid(21)}`,
        campaignId,
        variantId,
        action: "status_change",
        actorId: "system",
        previousStatus,
        newStatus,
        details: {
          reviewId,
          decision: parsed.data.decision,
          governanceScore: govResult.score,
          reviewerCount: govResult.reviewerCount,
        },
        createdAt: new Date(),
      });
    }

    return NextResponse.json(
      {
        campaignId,
        variantId,
        review,
        governance: govResult,
        statusChanged: newStatus !== previousStatus,
        newStatus,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Failed to cast vote:", error);
    return NextResponse.json({ error: "Failed to cast vote" }, { status: 500 });
  }
}
