import { NextRequest, NextResponse } from "next/server";
import { parseBrief } from "@acve/ai";
import { z } from "zod";

const briefInputSchema = z.object({
  rawText: z.string().min(1).max(10000),
  provider: z.enum(["openai", "anthropic"]).optional(),
});

// POST /api/briefs/parse — parse a creative brief via NLP
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = briefInputSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const result = await parseBrief({
      rawText: parsed.data.rawText,
      provider: parsed.data.provider,
    });

    return NextResponse.json({ parsed: result });
  } catch (error) {
    console.error("Failed to parse brief:", error);
    return NextResponse.json({ error: "Failed to parse brief" }, { status: 500 });
  }
}
