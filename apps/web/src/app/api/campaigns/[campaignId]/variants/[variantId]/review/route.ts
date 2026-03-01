import { NextRequest, NextResponse } from "next/server";
import { castVoteSchema } from "@acve/shared";
import { db, reviews, creativeVariants } from "@acve/db";
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

    // Update variant status based on vote
    if (parsed.data.decision === "approve" || parsed.data.decision === "veto") {
      const newStatus = parsed.data.decision === "veto" ? "rejected" : "approved";
      await db
        .update(creativeVariants)
        .set({ status: newStatus, updatedAt: new Date() })
        .where(eq(creativeVariants.id, variantId));
    }

    return NextResponse.json({ campaignId, variantId, review }, { status: 201 });
  } catch (error) {
    console.error("Failed to cast vote:", error);
    return NextResponse.json({ error: "Failed to cast vote" }, { status: 500 });
  }
}
