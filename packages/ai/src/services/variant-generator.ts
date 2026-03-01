import { generateObject } from "ai";
import { z } from "zod";
import { getProvider } from "../providers";
import type { GenerationRequest, GenerationResponse } from "../types";

const variantSchema = z.object({
  variants: z.array(
    z.object({
      headline: z.string().optional(),
      primaryText: z.string().optional(),
      description: z.string().optional(),
      callToAction: z.string().optional(),
      imagePrompt: z.string().optional(),
      angle: z.string(),
      platform: z.string(),
    }),
  ),
});

export async function generateVariants(request: GenerationRequest): Promise<GenerationResponse> {
  const { model, name } = getProvider(request.provider);

  const result = await generateObject({
    model,
    schema: variantSchema,
    prompt: buildVariantPrompt(request),
  });

  return {
    variants: result.object.variants,
    usage: {
      promptTokens: result.usage.promptTokens,
      completionTokens: result.usage.completionTokens,
      totalTokens: result.usage.promptTokens + result.usage.completionTokens,
    },
    estimatedCostCents: estimateTokenCost(
      result.usage.promptTokens,
      result.usage.completionTokens,
      name,
    ),
    provider: name,
    model: name,
  };
}

function buildVariantPrompt(request: GenerationRequest): string {
  const { campaignContext, angles, count } = request;

  return [
    `Generate ${count} ad creative variants for the following campaign:`,
    `Brand: ${campaignContext.brandName}`,
    `Platform: ${campaignContext.platform}`,
    `Funnel Stage: ${campaignContext.funnelStage}`,
    campaignContext.targetAudience && `Target Audience: ${campaignContext.targetAudience}`,
    campaignContext.offerDetails && `Offer: ${campaignContext.offerDetails}`,
    angles?.length && `Creative Angles: ${angles.join(", ")}`,
    "",
    "Each variant should include a headline, primary text, description, call to action, and an image prompt.",
    "Vary the creative angles, emotional triggers, and hooks across variants.",
  ]
    .filter(Boolean)
    .join("\n");
}

function estimateTokenCost(
  promptTokens: number,
  completionTokens: number,
  _provider: string,
): number {
  // Rough cost estimation in cents — will be refined with actual pricing
  const inputCostPer1k = 0.3;
  const outputCostPer1k = 1.2;
  return Math.ceil(
    (promptTokens / 1000) * inputCostPer1k + (completionTokens / 1000) * outputCostPer1k,
  );
}
