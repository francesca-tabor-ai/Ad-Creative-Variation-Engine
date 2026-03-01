import { z } from "zod";

export const createTemplateSchema = z.object({
  name: z.string().min(1).max(200),
  description: z.string().max(2000).optional(),
  platform: z.enum(["meta", "tiktok", "google", "linkedin"]),
  format: z.enum(["1:1", "4:5", "9:16", "16:9", "1.91:1"]),
  version: z.number().int().positive().default(1),
  components: z.record(z.unknown()).optional(),
  constraints: z
    .object({
      maxHeadlineLength: z.number().int().positive().optional(),
      maxPrimaryTextLength: z.number().int().positive().optional(),
      safeZone: z
        .object({
          top: z.number(),
          right: z.number(),
          bottom: z.number(),
          left: z.number(),
        })
        .optional(),
      fonts: z.array(z.string()).optional(),
    })
    .optional(),
});

export const updateTemplateSchema = createTemplateSchema.partial();

export type CreateTemplateInput = z.infer<typeof createTemplateSchema>;
export type UpdateTemplateInput = z.infer<typeof updateTemplateSchema>;
