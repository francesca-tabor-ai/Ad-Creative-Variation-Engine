import { generateObject } from "ai";
import { z } from "zod";
import { getProvider } from "../providers";
import type { BriefParseRequest, BriefParseResponse } from "../types";

const briefSchema = z.object({
  brandName: z.string().nullable(),
  targetAudience: z.string().nullable(),
  offerDetails: z.string().nullable(),
  funnelStage: z.enum(["tofu", "mofu", "bofu"]).nullable(),
  platforms: z.array(z.string()),
  additionalContext: z.record(z.string()),
  confidence: z.record(z.number()),
});

export async function parseBrief(request: BriefParseRequest): Promise<BriefParseResponse> {
  const { model } = getProvider(request.provider);

  const result = await generateObject({
    model,
    schema: briefSchema,
    prompt: [
      "Extract structured campaign information from the following creative brief.",
      "For each extracted field, provide a confidence score between 0 and 1.",
      "If a field cannot be determined, set it to null with confidence 0.",
      "",
      "Brief:",
      request.rawText,
    ].join("\n"),
  });

  return result.object;
}
