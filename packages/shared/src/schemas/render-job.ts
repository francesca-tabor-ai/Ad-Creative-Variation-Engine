import { z } from "zod";

export const createRenderJobSchema = z.object({
  variantId: z.string().min(1),
  templateId: z.string().min(1),
  format: z.enum(["1:1", "4:5", "9:16", "16:9", "1.91:1"]),
  resolution: z
    .object({
      width: z.number().int().positive(),
      height: z.number().int().positive(),
    })
    .optional(),
  language: z.string().default("en"),
  priority: z.number().int().min(0).max(10).default(5),
});

export const batchRenderSchema = z.object({
  campaignId: z.string().min(1),
  variantIds: z.array(z.string().min(1)).min(1),
  formats: z.array(z.enum(["1:1", "4:5", "9:16", "16:9", "1.91:1"])).min(1),
  templateId: z.string().min(1).optional(),
});

export type CreateRenderJobInput = z.infer<typeof createRenderJobSchema>;
export type BatchRenderInput = z.infer<typeof batchRenderSchema>;
