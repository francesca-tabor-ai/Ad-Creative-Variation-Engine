import { z } from "zod";

export const creativeVariantContentSchema = z.object({
  headline: z.string().max(500).optional(),
  primaryText: z.string().max(5000).optional(),
  description: z.string().max(2000).optional(),
  callToAction: z.string().max(100).optional(),
  imagePrompt: z.string().max(5000).optional(),
  imageUrl: z.string().url().optional(),
});

export const generateVariantsSchema = z.object({
  campaignId: z.string().min(1),
  count: z.number().int().min(1).max(100).default(10),
  angles: z
    .array(
      z.enum([
        "pain_point",
        "benefit",
        "social_proof",
        "urgency",
        "curiosity",
        "authority",
        "comparison",
        "storytelling",
      ]),
    )
    .optional(),
  platforms: z.array(z.enum(["meta", "tiktok", "google", "linkedin"])).optional(),
  funnelStage: z.enum(["tofu", "mofu", "bofu"]).optional(),
  provider: z.enum(["openai", "anthropic"]).optional(),
  promptOverrides: z.record(z.string()).optional(),
});

export const updateVariantSchema = z.object({
  status: z
    .enum(["draft", "in_review", "approved", "rejected", "in_production", "rendered", "deployed"])
    .optional(),
  content: creativeVariantContentSchema.partial().optional(),
  metadata: z.record(z.unknown()).optional(),
});

export type CreativeVariantContent = z.infer<typeof creativeVariantContentSchema>;
export type GenerateVariantsInput = z.infer<typeof generateVariantsSchema>;
export type UpdateVariantInput = z.infer<typeof updateVariantSchema>;
