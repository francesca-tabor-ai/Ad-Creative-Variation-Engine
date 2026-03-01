import { createAnthropic } from "@ai-sdk/anthropic";

export function getAnthropicProvider() {
  return createAnthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  });
}

export const ANTHROPIC_MODELS = {
  text: "claude-sonnet-4-6",
  textFast: "claude-haiku-4-5-20251001",
} as const;
