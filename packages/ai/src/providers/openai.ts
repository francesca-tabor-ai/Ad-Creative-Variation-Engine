import { createOpenAI } from "@ai-sdk/openai";

export function getOpenAIProvider() {
  return createOpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

export const OPENAI_MODELS = {
  text: "gpt-4o",
  textFast: "gpt-4o-mini",
} as const;
