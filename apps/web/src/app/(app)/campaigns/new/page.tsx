"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const PLATFORMS = [
  { value: "meta", label: "Meta" },
  { value: "tiktok", label: "TikTok" },
  { value: "google", label: "Google" },
  { value: "linkedin", label: "LinkedIn" },
];

const FUNNEL_STAGES = [
  { value: "tofu", label: "Top of Funnel", description: "Awareness & discovery" },
  { value: "mofu", label: "Mid Funnel", description: "Consideration & evaluation" },
  { value: "bofu", label: "Bottom of Funnel", description: "Decision & conversion" },
];

export default function NewCampaignPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [briefMode, setBriefMode] = useState(false);
  const [briefText, setBriefText] = useState("");
  const [briefParsing, setBriefParsing] = useState(false);

  const [form, setForm] = useState({
    name: "",
    brandName: "",
    description: "",
    targetPlatforms: [] as string[],
    funnelStage: "",
    targetAudience: "",
    offerDetails: "",
  });

  function updateField(field: string, value: string | string[]) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function togglePlatform(platform: string) {
    setForm((prev) => ({
      ...prev,
      targetPlatforms: prev.targetPlatforms.includes(platform)
        ? prev.targetPlatforms.filter((p) => p !== platform)
        : [...prev.targetPlatforms, platform],
    }));
  }

  async function parseBrief() {
    if (!briefText.trim()) return;
    setBriefParsing(true);
    try {
      const res = await fetch("/api/briefs/parse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rawText: briefText }),
      });
      const data = await res.json();
      if (data.parsed) {
        const p = data.parsed;
        setForm((prev) => ({
          ...prev,
          brandName: p.brandName || prev.brandName,
          targetAudience: p.targetAudience || prev.targetAudience,
          offerDetails: p.offerDetails || prev.offerDetails,
          funnelStage: p.funnelStage || prev.funnelStage,
          targetPlatforms: p.platforms?.length ? p.platforms : prev.targetPlatforms,
        }));
        setBriefMode(false);
      }
    } catch {
      // Brief parsing failed — user can fill manually
    } finally {
      setBriefParsing(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.brandName || !form.funnelStage || !form.targetPlatforms.length) return;
    setLoading(true);
    try {
      const res = await fetch("/api/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.campaign) {
        router.push(`/campaigns/${data.campaign.id || "new"}/variants`);
      }
    } catch {
      // Handle error
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight mb-1">New campaign</h1>
        <p className="text-sm text-muted">
          Set up your campaign details or paste a creative brief to auto-fill.
        </p>
      </div>

      {/* Brief intake toggle */}
      <div className="mb-6 flex gap-2">
        <button
          onClick={() => setBriefMode(false)}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            !briefMode ? "bg-gray-100 text-foreground" : "text-muted hover:text-foreground"
          }`}
        >
          Manual entry
        </button>
        <button
          onClick={() => setBriefMode(true)}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            briefMode ? "bg-gray-100 text-foreground" : "text-muted hover:text-foreground"
          }`}
        >
          Paste brief
        </button>
      </div>

      {/* Brief paste mode */}
      {briefMode && (
        <div className="mb-8 p-5 rounded-xl border border-border-light bg-gray-50/50">
          <label className="block text-sm font-medium mb-2">Creative brief</label>
          <textarea
            value={briefText}
            onChange={(e) => setBriefText(e.target.value)}
            placeholder="Paste your creative brief here. We'll extract campaign details automatically using NLP..."
            rows={8}
            className="w-full px-3 py-2.5 rounded-lg border border-border text-sm bg-white resize-none focus:outline-none focus:ring-2 focus:ring-foreground/10 focus:border-foreground/20"
          />
          <div className="mt-3 flex items-center justify-between">
            <p className="text-xs text-muted">
              We&apos;ll extract brand name, audience, offer, funnel stage, and platforms.
            </p>
            <button
              onClick={parseBrief}
              disabled={briefParsing || !briefText.trim()}
              className="px-4 py-2 rounded-lg bg-foreground text-white text-sm font-medium hover:bg-foreground/90 transition-colors disabled:opacity-50"
            >
              {briefParsing ? "Parsing..." : "Extract fields"}
            </button>
          </div>
        </div>
      )}

      {/* Campaign form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium mb-1.5">Campaign name</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => updateField("name", e.target.value)}
            placeholder="e.g., Q1 2026 Product Launch"
            className="w-full px-3 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-foreground/10 focus:border-foreground/20"
            required
          />
        </div>

        {/* Brand */}
        <div>
          <label className="block text-sm font-medium mb-1.5">Brand name</label>
          <input
            type="text"
            value={form.brandName}
            onChange={(e) => updateField("brandName", e.target.value)}
            placeholder="e.g., Acme Corp"
            className="w-full px-3 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-foreground/10 focus:border-foreground/20"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium mb-1.5">
            Description <span className="text-muted font-normal">(optional)</span>
          </label>
          <textarea
            value={form.description}
            onChange={(e) => updateField("description", e.target.value)}
            placeholder="Brief description of the campaign goals and context..."
            rows={3}
            className="w-full px-3 py-2.5 rounded-lg border border-border text-sm resize-none focus:outline-none focus:ring-2 focus:ring-foreground/10 focus:border-foreground/20"
          />
        </div>

        {/* Platforms */}
        <div>
          <label className="block text-sm font-medium mb-2">Target platforms</label>
          <div className="flex flex-wrap gap-2">
            {PLATFORMS.map((p) => (
              <button
                key={p.value}
                type="button"
                onClick={() => togglePlatform(p.value)}
                className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                  form.targetPlatforms.includes(p.value)
                    ? "border-foreground bg-foreground text-white"
                    : "border-border text-muted hover:border-foreground/30 hover:text-foreground"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Funnel Stage */}
        <div>
          <label className="block text-sm font-medium mb-2">Funnel stage</label>
          <div className="grid grid-cols-3 gap-3">
            {FUNNEL_STAGES.map((stage) => (
              <button
                key={stage.value}
                type="button"
                onClick={() => updateField("funnelStage", stage.value)}
                className={`p-3 rounded-xl border text-left transition-colors ${
                  form.funnelStage === stage.value
                    ? "border-foreground bg-gray-50"
                    : "border-border-light hover:border-border"
                }`}
              >
                <p className="text-sm font-medium">{stage.label}</p>
                <p className="text-xs text-muted mt-0.5">{stage.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Target Audience */}
        <div>
          <label className="block text-sm font-medium mb-1.5">
            Target audience <span className="text-muted font-normal">(optional)</span>
          </label>
          <textarea
            value={form.targetAudience}
            onChange={(e) => updateField("targetAudience", e.target.value)}
            placeholder="Describe your target audience demographics, interests, and pain points..."
            rows={3}
            className="w-full px-3 py-2.5 rounded-lg border border-border text-sm resize-none focus:outline-none focus:ring-2 focus:ring-foreground/10 focus:border-foreground/20"
          />
        </div>

        {/* Offer Details */}
        <div>
          <label className="block text-sm font-medium mb-1.5">
            Offer details <span className="text-muted font-normal">(optional)</span>
          </label>
          <textarea
            value={form.offerDetails}
            onChange={(e) => updateField("offerDetails", e.target.value)}
            placeholder="What's the offer? Discount, free trial, limited time deal, etc..."
            rows={2}
            className="w-full px-3 py-2.5 rounded-lg border border-border text-sm resize-none focus:outline-none focus:ring-2 focus:ring-foreground/10 focus:border-foreground/20"
          />
        </div>

        {/* Submit */}
        <div className="pt-2 flex items-center gap-3">
          <button
            type="submit"
            disabled={loading || !form.name || !form.brandName || !form.funnelStage || !form.targetPlatforms.length}
            className="px-6 py-2.5 rounded-lg bg-foreground text-white text-sm font-medium hover:bg-foreground/90 transition-colors disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create campaign"}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2.5 rounded-lg text-sm text-muted hover:text-foreground transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
