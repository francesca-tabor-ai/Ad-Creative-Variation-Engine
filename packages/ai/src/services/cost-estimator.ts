import type { CostEstimate } from "../types";

// Average tokens per variant (rough estimates)
const AVG_PROMPT_TOKENS_PER_VARIANT = 200;
const AVG_COMPLETION_TOKENS_PER_VARIANT = 300;

// Cost per 1K tokens in cents
const PRICING: Record<string, { input: number; output: number }> = {
  openai: { input: 0.25, output: 1.0 },
  anthropic: { input: 0.3, output: 1.2 },
};

export function estimateGenerationCost(
  variantCount: number,
  provider: string = "anthropic",
): CostEstimate {
  const pricing = PRICING[provider] ?? PRICING["anthropic"]!;

  const totalPromptTokens = AVG_PROMPT_TOKENS_PER_VARIANT * variantCount;
  const totalCompletionTokens = AVG_COMPLETION_TOKENS_PER_VARIANT * variantCount;

  const textCents = Math.ceil(
    (totalPromptTokens / 1000) * pricing.input +
      (totalCompletionTokens / 1000) * pricing.output,
  );

  return {
    generationCostCents: textCents,
    breakdown: {
      textGenerationCents: textCents,
      imageGenerationCents: 0, // placeholder for image generation
    },
    variantCount,
    provider,
  };
}
