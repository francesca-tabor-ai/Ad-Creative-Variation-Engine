import { z } from "zod";

export const createCampaignSchema = z.object({
  name: z.string().min(1).max(200),
  description: z.string().max(2000).optional(),
  brandName: z.string().min(1).max(100),
  targetPlatforms: z.array(z.enum(["meta", "tiktok", "google", "linkedin"])).min(1),
  funnelStage: z.enum(["tofu", "mofu", "bofu"]),
  targetAudience: z.string().max(2000).optional(),
  offerDetails: z.string().max(2000).optional(),
  budgetCents: z.number().int().nonnegative().optional(),
  metadata: z.record(z.unknown()).optional(),
});

export const updateCampaignSchema = createCampaignSchema.partial();

export type CreateCampaignInput = z.infer<typeof createCampaignSchema>;
export type UpdateCampaignInput = z.infer<typeof updateCampaignSchema>;
