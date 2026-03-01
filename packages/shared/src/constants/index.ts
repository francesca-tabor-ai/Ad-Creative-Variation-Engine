// Ad Platforms
export const AdPlatform = {
  META: "meta",
  TIKTOK: "tiktok",
  GOOGLE: "google",
  LINKEDIN: "linkedin",
} as const;
export type AdPlatform = (typeof AdPlatform)[keyof typeof AdPlatform];

// Funnel Stages
export const FunnelStage = {
  TOFU: "tofu",
  MOFU: "mofu",
  BOFU: "bofu",
} as const;
export type FunnelStage = (typeof FunnelStage)[keyof typeof FunnelStage];

// Creative Angles
export const CreativeAngle = {
  PAIN_POINT: "pain_point",
  BENEFIT: "benefit",
  SOCIAL_PROOF: "social_proof",
  URGENCY: "urgency",
  CURIOSITY: "curiosity",
  AUTHORITY: "authority",
  COMPARISON: "comparison",
  STORYTELLING: "storytelling",
} as const;
export type CreativeAngle = (typeof CreativeAngle)[keyof typeof CreativeAngle];

// Variant Status
export const VariantStatus = {
  DRAFT: "draft",
  IN_REVIEW: "in_review",
  APPROVED: "approved",
  REJECTED: "rejected",
  IN_PRODUCTION: "in_production",
  RENDERED: "rendered",
  DEPLOYED: "deployed",
} as const;
export type VariantStatus = (typeof VariantStatus)[keyof typeof VariantStatus];

// Render Status
export const RenderStatus = {
  QUEUED: "queued",
  PROCESSING: "processing",
  COMPLETED: "completed",
  FAILED: "failed",
} as const;
export type RenderStatus = (typeof RenderStatus)[keyof typeof RenderStatus];

// Vote Decision
export const VoteDecision = {
  APPROVE: "approve",
  REJECT: "reject",
  ABSTAIN: "abstain",
  VETO: "veto",
} as const;
export type VoteDecision = (typeof VoteDecision)[keyof typeof VoteDecision];

// Export Formats
export const ExportFormat = {
  "1:1": "1:1",
  "4:5": "4:5",
  "9:16": "9:16",
  "16:9": "16:9",
  "1.91:1": "1.91:1",
} as const;
export type ExportFormat = (typeof ExportFormat)[keyof typeof ExportFormat];

// AI Providers
export const AIProvider = {
  OPENAI: "openai",
  ANTHROPIC: "anthropic",
} as const;
export type AIProvider = (typeof AIProvider)[keyof typeof AIProvider];

// User Roles
export const UserRole = {
  ADMIN: "admin",
  CREATIVE_DIRECTOR: "creative_director",
  DESIGNER: "designer",
  COPYWRITER: "copywriter",
  MEDIA_BUYER: "media_buyer",
  VIEWER: "viewer",
} as const;
export type UserRole = (typeof UserRole)[keyof typeof UserRole];

// Campaign Status
export const CampaignStatus = {
  DRAFT: "draft",
  GENERATING: "generating",
  IN_REVIEW: "in_review",
  APPROVED: "approved",
  IN_PRODUCTION: "in_production",
  DEPLOYED: "deployed",
  ARCHIVED: "archived",
} as const;
export type CampaignStatus = (typeof CampaignStatus)[keyof typeof CampaignStatus];

// Deployment Status
export const DeploymentStatus = {
  PENDING: "pending",
  UPLOADING: "uploading",
  LIVE: "live",
  PAUSED: "paused",
  FAILED: "failed",
} as const;
export type DeploymentStatus = (typeof DeploymentStatus)[keyof typeof DeploymentStatus];
