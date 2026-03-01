import { NextRequest, NextResponse } from "next/server";
import { estimateGenerationCost } from "@acve/ai";
import { z } from "zod";

const estimateSchema = z.object({
  variantCount: z.number().int().min(1).max(100),
  provider: z.enum(["openai", "anthropic"]).optional(),
});

// POST /api/cost/estimate — estimate generation cost
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = estimateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const estimate = estimateGenerationCost(parsed.data.variantCount, parsed.data.provider);
    return NextResponse.json({ estimate });
  } catch (error) {
    console.error("Failed to estimate cost:", error);
    return NextResponse.json({ error: "Failed to estimate cost" }, { status: 500 });
  }
}
