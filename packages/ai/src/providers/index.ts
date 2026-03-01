import type { AIProvider } from "@acve/shared";
import { getOpenAIProvider, OPENAI_MODELS } from "./openai";
import { getAnthropicProvider, ANTHROPIC_MODELS } from "./anthropic";
import type { LanguageModelV1 } from "ai";

export interface ProviderConfig {
  model: LanguageModelV1;
  name: string;
}

export function getProvider(provider?: AIProvider): ProviderConfig {
  const selected = provider ?? (process.env.DEFAULT_AI_PROVIDER as AIProvider) ?? "anthropic";

  switch (selected) {
    case "openai": {
      const openai = getOpenAIProvider();
      return {
        model: openai(OPENAI_MODELS.text),
        name: "openai",
      };
    }
    case "anthropic": {
      const anthropic = getAnthropicProvider();
      return {
        model: anthropic(ANTHROPIC_MODELS.text),
        name: "anthropic",
      };
    }
    default:
      throw new Error(`Unsupported AI provider: ${selected}`);
  }
}

export { getOpenAIProvider, OPENAI_MODELS } from "./openai";
export { getAnthropicProvider, ANTHROPIC_MODELS } from "./anthropic";
