/**
 * Pure governance scoring engine.
 * No DB dependency — takes reviews + config, returns scoring result.
 */

export interface GovernanceConfig {
  approvalThreshold: number;
  requiredReviewerCount: number;
  vetoRoles: string[];
  voteWeights: Record<string, number>;
  autoApproveIfUnanimous: boolean;
}

export interface ReviewInput {
  decision: string;
  weight: number;
  userId: string;
  userRole?: string;
}

export interface GovernanceResult {
  score: number;
  approved: boolean;
  rejected: boolean;
  vetoed: boolean;
  reviewerCount: number;
  approveCount: number;
  rejectCount: number;
  vetoCount: number;
  meetsReviewerThreshold: boolean;
}

const DEFAULT_CONFIG: GovernanceConfig = {
  approvalThreshold: 0.6,
  requiredReviewerCount: 1,
  vetoRoles: [],
  voteWeights: {},
  autoApproveIfUnanimous: true,
};

export function computeGovernanceScore(
  reviews: ReviewInput[],
  config: Partial<GovernanceConfig> = {},
): GovernanceResult {
  const cfg = { ...DEFAULT_CONFIG, ...config };

  // Filter out abstentions for scoring
  const activeReviews = reviews.filter((r) => r.decision !== "abstain");

  const approveCount = activeReviews.filter((r) => r.decision === "approve").length;
  const rejectCount = activeReviews.filter((r) => r.decision === "reject").length;
  const vetoCount = activeReviews.filter((r) => r.decision === "veto").length;

  // Check for veto — immediate rejection
  const vetoed = vetoCount > 0;

  // Weighted score: sum of approve weights / sum of all active weights
  let totalWeight = 0;
  let approveWeight = 0;

  for (const review of activeReviews) {
    const roleWeight = review.userRole ? (cfg.voteWeights[review.userRole] ?? 1) : 1;
    const effectiveWeight = review.weight * roleWeight;
    totalWeight += effectiveWeight;
    if (review.decision === "approve") {
      approveWeight += effectiveWeight;
    }
  }

  const score = totalWeight > 0 ? approveWeight / totalWeight : 0;
  const meetsReviewerThreshold = activeReviews.length >= cfg.requiredReviewerCount;

  // Unanimous approval shortcut
  const unanimousApproval =
    cfg.autoApproveIfUnanimous &&
    activeReviews.length > 0 &&
    approveCount === activeReviews.length;

  const approved =
    !vetoed &&
    meetsReviewerThreshold &&
    (unanimousApproval || score >= cfg.approvalThreshold);

  const rejected = vetoed || (meetsReviewerThreshold && score < cfg.approvalThreshold && activeReviews.length > 0);

  return {
    score: Math.round(score * 1000) / 1000,
    approved,
    rejected,
    vetoed,
    reviewerCount: activeReviews.length,
    approveCount,
    rejectCount,
    vetoCount,
    meetsReviewerThreshold,
  };
}
