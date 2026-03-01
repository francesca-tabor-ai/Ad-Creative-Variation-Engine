import { z } from "zod";

export const createUserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1).max(200),
  role: z.enum(["admin", "creative_director", "designer", "copywriter", "media_buyer", "viewer"]),
  teamId: z.string().min(1).optional(),
});

export const createTeamSchema = z.object({
  name: z.string().min(1).max(200),
  voteWeight: z.number().min(0).max(10).default(1),
  hasVetoAuthority: z.boolean().default(false),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type CreateTeamInput = z.infer<typeof createTeamSchema>;
