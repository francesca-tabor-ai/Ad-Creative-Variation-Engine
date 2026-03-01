import { z } from "zod";

export const castVoteSchema = z.object({
  variantId: z.string().min(1),
  decision: z.enum(["approve", "reject", "abstain", "veto"]),
  comment: z.string().max(2000).optional(),
});

export const configureGovernanceSchema = z.object({
  campaignId: z.string().min(1),
  approvalThreshold: z.number().min(0).max(1).default(0.6),
  requiredTeams: z.array(z.string()).optional(),
  vetoRoles: z.array(z.string()).optional(),
  voteWeights: z
    .record(z.number().min(0).max(10))
    .optional(),
});

export type CastVoteInput = z.infer<typeof castVoteSchema>;
export type ConfigureGovernanceInput = z.infer<typeof configureGovernanceSchema>;
