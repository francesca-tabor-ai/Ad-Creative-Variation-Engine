"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface Template {
  id: string;
  name: string;
  description: string | null;
  platform: string;
  format: string;
  version: number;
  components: Record<string, unknown> | null;
  constraints: {
    maxHeadlineLength?: number;
    maxPrimaryTextLength?: number;
    fonts?: string[];
  } | null;
  createdAt: string;
}

const platformLabels: Record<string, string> = {
  meta: "Meta",
  tiktok: "TikTok",
  google: "Google",
  linkedin: "LinkedIn",
};

const platformColors: Record<string, string> = {
  meta: "bg-blue-50 text-blue-700",
  tiktok: "bg-pink-50 text-pink-700",
  google: "bg-green-50 text-green-700",
  linkedin: "bg-sky-50 text-sky-700",
};

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterPlatform, setFilterPlatform] = useState("");
  const [filterFormat, setFilterFormat] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const params = new URLSearchParams();
        if (filterPlatform) params.set("platform", filterPlatform);
        if (filterFormat) params.set("format", filterFormat);
        const res = await fetch(`/api/templates?${params.toString()}`);
        const data = await res.json();
        setTemplates(data.templates || []);
      } catch {
        console.error("Failed to load templates");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [filterPlatform, filterFormat]);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight mb-1">Templates</h1>
          <p className="text-sm text-muted">Manage ad creative templates for rendering.</p>
        </div>
        <Link
          href="/templates/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-foreground text-white text-sm font-medium hover:bg-foreground/90 transition-colors"
        >
          <PlusIcon />
          New template
        </Link>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-6">
        <select
          value={filterPlatform}
          onChange={(e) => setFilterPlatform(e.target.value)}
          className="px-3 py-2 rounded-lg border border-border-light text-sm bg-white"
        >
          <option value="">All platforms</option>
          <option value="meta">Meta</option>
          <option value="tiktok">TikTok</option>
          <option value="google">Google</option>
          <option value="linkedin">LinkedIn</option>
        </select>
        <select
          value={filterFormat}
          onChange={(e) => setFilterFormat(e.target.value)}
          className="px-3 py-2 rounded-lg border border-border-light text-sm bg-white"
        >
          <option value="">All formats</option>
          <option value="1:1">1:1 (Square)</option>
          <option value="4:5">4:5 (Portrait)</option>
          <option value="9:16">9:16 (Story)</option>
          <option value="16:9">16:9 (Landscape)</option>
          <option value="1.91:1">1.91:1 (Wide)</option>
        </select>
      </div>

      {loading ? (
        <div className="rounded-xl border border-border-light p-12 text-center">
          <p className="text-sm text-muted">Loading templates...</p>
        </div>
      ) : templates.length === 0 ? (
        <div className="rounded-xl border border-border-light p-12 text-center">
          <div className="w-12 h-12 rounded-xl bg-gray-50 border border-border-light mx-auto mb-4 flex items-center justify-center">
            <LayoutIcon />
          </div>
          <p className="text-sm font-medium mb-1">No templates yet</p>
          <p className="text-xs text-muted mb-4">
            Create a template to define how your ad creatives are rendered.
          </p>
          <Link
            href="/templates/new"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            Create your first template
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {templates.map((template) => (
            <div
              key={template.id}
              className="rounded-xl border border-border-light p-5 hover:border-border transition-colors"
            >
              {/* Template preview area */}
              <div className="aspect-video rounded-lg bg-gray-50 border border-border-light mb-4 flex items-center justify-center">
                <span className="text-xs text-muted font-mono">{template.format}</span>
              </div>

              <h3 className="text-sm font-semibold mb-1">{template.name}</h3>
              {template.description && (
                <p className="text-xs text-muted mb-3 line-clamp-2">{template.description}</p>
              )}

              <div className="flex items-center gap-2">
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                    platformColors[template.platform] || "bg-gray-50 text-gray-700"
                  }`}
                >
                  {platformLabels[template.platform] || template.platform}
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded bg-gray-50 text-gray-700 text-xs font-medium">
                  {template.format}
                </span>
                <span className="text-xs text-muted ml-auto">v{template.version}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function PlusIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="7" y1="2" x2="7" y2="12" />
      <line x1="2" y1="7" x2="12" y2="7" />
    </svg>
  );
}

function LayoutIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-muted">
      <rect x="1.5" y="1.5" width="13" height="13" rx="1.5" />
      <line x1="1.5" y1="5.5" x2="14.5" y2="5.5" />
      <line x1="5.5" y1="5.5" x2="5.5" y2="14.5" />
    </svg>
  );
}
