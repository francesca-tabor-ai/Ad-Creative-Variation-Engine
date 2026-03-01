"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

type Variant = {
  id: string;
  headline?: string;
  primaryText?: string;
  callToAction?: string;
  angle: string;
  platform: string;
  status: string;
};

const ANGLES = [
  "pain_point",
  "benefit",
  "social_proof",
  "urgency",
  "curiosity",
  "authority",
  "comparison",
  "storytelling",
];

export default function VariantsPage() {
  const params = useParams();
  const campaignId = params.id as string;

  const [variants, setVariants] = useState<Variant[]>([]);
  const [generating, setGenerating] = useState(false);
  const [viewMode, setViewMode] = useState<"card" | "table">("card");
  const [selectedAngles, setSelectedAngles] = useState<string[]>([]);
  const [variantCount, setVariantCount] = useState(10);
  const [showGenerator, setShowGenerator] = useState(false);

  function toggleAngle(angle: string) {
    setSelectedAngles((prev) =>
      prev.includes(angle) ? prev.filter((a) => a !== angle) : [...prev, angle],
    );
  }

  async function generateVariants() {
    setGenerating(true);
    try {
      const res = await fetch(`/api/campaigns/${campaignId}/variants`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          campaignId,
          count: variantCount,
          angles: selectedAngles.length > 0 ? selectedAngles : undefined,
        }),
      });
      const data = await res.json();
      if (data.variants) {
        setVariants(data.variants);
      }
      setShowGenerator(false);
    } catch {
      // Handle error
    } finally {
      setGenerating(false);
    }
  }

  function updateVariantStatus(variantId: string, status: string) {
    setVariants((prev) =>
      prev.map((v) => (v.id === variantId ? { ...v, status } : v)),
    );
  }

  return (
    <div>
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted mb-6">
        <Link href="/campaigns" className="hover:text-foreground transition-colors">
          Campaigns
        </Link>
        <span>/</span>
        <Link href={`/campaigns/${campaignId}`} className="hover:text-foreground transition-colors">
          {campaignId}
        </Link>
        <span>/</span>
        <span className="text-foreground">Variants</span>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight mb-1">Creative variants</h1>
          <p className="text-sm text-muted">
            {variants.length > 0
              ? `${variants.length} variants generated`
              : "Generate and review ad creative variations."}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {variants.length > 0 && (
            <div className="flex gap-1 bg-gray-50 rounded-lg p-0.5">
              <button
                onClick={() => setViewMode("card")}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  viewMode === "card" ? "bg-white shadow-sm text-foreground" : "text-muted"
                }`}
              >
                Cards
              </button>
              <button
                onClick={() => setViewMode("table")}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  viewMode === "table" ? "bg-white shadow-sm text-foreground" : "text-muted"
                }`}
              >
                Table
              </button>
            </div>
          )}
          <button
            onClick={() => setShowGenerator(!showGenerator)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-foreground text-white text-sm font-medium hover:bg-foreground/90 transition-colors"
          >
            Generate variants
          </button>
        </div>
      </div>

      {/* Generation panel */}
      {showGenerator && (
        <div className="mb-8 p-6 rounded-xl border border-border-light bg-gray-50/50">
          <h3 className="text-sm font-semibold mb-4">Generation settings</h3>

          {/* Count */}
          <div className="mb-4">
            <label className="block text-xs font-medium text-muted mb-1.5">
              Number of variants
            </label>
            <input
              type="number"
              value={variantCount}
              onChange={(e) => setVariantCount(parseInt(e.target.value) || 10)}
              min={1}
              max={100}
              className="w-24 px-3 py-2 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-foreground/10"
            />
          </div>

          {/* Angles */}
          <div className="mb-5">
            <label className="block text-xs font-medium text-muted mb-2">
              Creative angles <span className="font-normal">(optional — leave empty for auto)</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {ANGLES.map((angle) => (
                <button
                  key={angle}
                  type="button"
                  onClick={() => toggleAngle(angle)}
                  className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
                    selectedAngles.includes(angle)
                      ? "border-foreground bg-foreground text-white"
                      : "border-border-light text-muted hover:border-border hover:text-foreground"
                  }`}
                >
                  {angle.replace("_", " ")}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={generateVariants}
              disabled={generating}
              className="px-5 py-2.5 rounded-lg gradient-bg text-white text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {generating ? "Generating..." : `Generate ${variantCount} variants`}
            </button>
            <button
              onClick={() => setShowGenerator(false)}
              className="px-4 py-2.5 rounded-lg text-sm text-muted hover:text-foreground transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Empty state */}
      {variants.length === 0 && !showGenerator && (
        <div className="rounded-xl border border-border-light p-12 text-center">
          <div className="w-12 h-12 rounded-xl bg-gray-50 border border-border-light mx-auto mb-4 flex items-center justify-center text-muted">
            <svg width="20" height="20" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M2 8h4l2-5 2 10 2-5h4" />
            </svg>
          </div>
          <p className="text-sm font-medium mb-1">No variants yet</p>
          <p className="text-xs text-muted mb-4">
            Generate AI-powered creative variations for this campaign.
          </p>
          <button
            onClick={() => setShowGenerator(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-foreground text-white text-sm font-medium hover:bg-foreground/90 transition-colors"
          >
            Generate variants
          </button>
        </div>
      )}

      {/* Card view */}
      {variants.length > 0 && viewMode === "card" && (
        <div className="grid grid-cols-2 gap-4">
          {variants.map((variant) => (
            <div key={variant.id} className="rounded-xl border border-border-light p-5 hover:border-border transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div className="flex gap-2">
                  <span className="px-2 py-0.5 rounded-full bg-gray-50 border border-border-light text-xs text-muted">
                    {variant.platform}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-gray-50 border border-border-light text-xs text-muted">
                    {variant.angle.replace("_", " ")}
                  </span>
                </div>
                <StatusBadge status={variant.status} />
              </div>

              {variant.headline && (
                <p className="text-sm font-semibold mb-2 line-clamp-2">{variant.headline}</p>
              )}
              {variant.primaryText && (
                <p className="text-xs text-muted mb-3 line-clamp-3">{variant.primaryText}</p>
              )}
              {variant.callToAction && (
                <p className="text-xs font-medium text-muted">CTA: {variant.callToAction}</p>
              )}

              {/* Vote buttons */}
              <div className="mt-4 pt-3 border-t border-border-light flex gap-2">
                <button
                  onClick={() => updateVariantStatus(variant.id, "approved")}
                  className={`flex-1 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
                    variant.status === "approved"
                      ? "bg-green-50 border-green-200 text-green-700"
                      : "border-border-light text-muted hover:border-green-200 hover:text-green-700"
                  }`}
                >
                  Approve
                </button>
                <button
                  onClick={() => updateVariantStatus(variant.id, "rejected")}
                  className={`flex-1 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
                    variant.status === "rejected"
                      ? "bg-red-50 border-red-200 text-red-700"
                      : "border-border-light text-muted hover:border-red-200 hover:text-red-700"
                  }`}
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Table view */}
      {variants.length > 0 && viewMode === "table" && (
        <div className="rounded-xl border border-border-light overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border-light bg-gray-50/50">
                <th className="text-left px-4 py-3 text-xs font-medium text-muted">Headline</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted">Platform</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted">Angle</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted">Status</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted">Actions</th>
              </tr>
            </thead>
            <tbody>
              {variants.map((variant) => (
                <tr key={variant.id} className="border-b border-border-light last:border-0">
                  <td className="px-4 py-3 text-sm max-w-xs truncate">
                    {variant.headline || "—"}
                  </td>
                  <td className="px-4 py-3 text-xs text-muted">{variant.platform}</td>
                  <td className="px-4 py-3 text-xs text-muted">{variant.angle.replace("_", " ")}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={variant.status} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <button
                        onClick={() => updateVariantStatus(variant.id, "approved")}
                        className="px-2 py-1 rounded text-xs text-green-700 hover:bg-green-50 transition-colors"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => updateVariantStatus(variant.id, "rejected")}
                        className="px-2 py-1 rounded text-xs text-red-700 hover:bg-red-50 transition-colors"
                      >
                        Reject
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    draft: "bg-gray-50 text-gray-600 border-gray-200",
    in_review: "bg-blue-50 text-blue-700 border-blue-200",
    approved: "bg-green-50 text-green-700 border-green-200",
    rejected: "bg-red-50 text-red-700 border-red-200",
  };
  return (
    <span
      className={`px-2 py-0.5 rounded-full border text-xs font-medium ${styles[status] || styles.draft}`}
    >
      {status.replace("_", " ")}
    </span>
  );
}
