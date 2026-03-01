import type { AIProvider } from "@acve/shared";

export interface GenerationRequest {
  provider?: AIProvider;
  model?: string;
  campaignContext: {
    brandName: string;
    targetAudience?: string;
    offerDetails?: string;
    funnelStage: string;
    platform: string;
  };
  angles?: string[];
  count: number;
  promptOverrides?: Record<string, string>;
}

export interface GeneratedVariant {
  headline?: string;
  primaryText?: string;
  description?: string;
  callToAction?: string;
  imagePrompt?: string;
  angle: string;
  platform: string;
}

export interface GenerationResponse {
  variants: GeneratedVariant[];
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  estimatedCostCents: number;
  provider: string;
  model: string;
}

export interface BriefParseRequest {
  rawText: string;
  provider?: AIProvider;
}

export interface BriefParseResponse {
  brandName: string | null;
  targetAudience: string | null;
  offerDetails: string | null;
  funnelStage: string | null;
  platforms: string[];
  additionalContext: Record<string, string>;
  confidence: Record<string, number>;
}

export interface CostEstimate {
  generationCostCents: number;
  breakdown: {
    textGenerationCents: number;
    imageGenerationCents: number;
  };
  variantCount: number;
  provider: string;
}
