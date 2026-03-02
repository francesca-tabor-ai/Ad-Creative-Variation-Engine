"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface TemplateForm {
  name: string;
  description: string;
  platform: string;
  format: string;
  constraints: {
    maxHeadlineLength: number;
    maxPrimaryTextLength: number;
    fonts: string[];
  };
  components: {
    layers: Array<{
      type: "text" | "image" | "shape";
      name: string;
      field?: string;
      x: number;
      y: number;
      width: number;
      height: number;
    }>;
    backgroundColor: string;
    width: number;
    height: number;
  };
}

const formatDimensions: Record<string, { width: number; height: number }> = {
  "1:1": { width: 1080, height: 1080 },
  "4:5": { width: 1080, height: 1350 },
  "9:16": { width: 1080, height: 1920 },
  "16:9": { width: 1920, height: 1080 },
  "1.91:1": { width: 1200, height: 628 },
};

export default function NewTemplatePage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState<TemplateForm>({
    name: "",
    description: "",
    platform: "meta",
    format: "1:1",
    constraints: {
      maxHeadlineLength: 40,
      maxPrimaryTextLength: 125,
      fonts: ["Inter"],
    },
    components: {
      layers: [
        { type: "image", name: "Background Image", field: "imageUrl", x: 0, y: 0, width: 1080, height: 700 },
        { type: "text", name: "Headline", field: "headline", x: 40, y: 740, width: 1000, height: 80 },
        { type: "text", name: "Primary Text", field: "primaryText", x: 40, y: 840, width: 1000, height: 120 },
        { type: "text", name: "CTA Button", field: "callToAction", x: 40, y: 980, width: 300, height: 60 },
      ],
      backgroundColor: "#ffffff",
      width: 1080,
      height: 1080,
    },
  });

  function updateFormat(format: string) {
    const dims = formatDimensions[format] || { width: 1080, height: 1080 };
    setForm((prev) => ({
      ...prev,
      format,
      components: { ...prev.components, width: dims.width, height: dims.height },
    }));
  }

  function addLayer(type: "text" | "image" | "shape") {
    setForm((prev) => ({
      ...prev,
      components: {
        ...prev.components,
        layers: [
          ...prev.components.layers,
          {
            type,
            name: `${type.charAt(0).toUpperCase() + type.slice(1)} Layer`,
            x: 0,
            y: 0,
            width: 200,
            height: 60,
          },
        ],
      },
    }));
  }

  function removeLayer(index: number) {
    setForm((prev) => ({
      ...prev,
      components: {
        ...prev.components,
        layers: prev.components.layers.filter((_, i) => i !== index),
      },
    }));
  }

  function updateLayer(index: number, updates: Partial<TemplateForm["components"]["layers"][0]>) {
    setForm((prev) => ({
      ...prev,
      components: {
        ...prev.components,
        layers: prev.components.layers.map((layer, i) =>
          i === index ? { ...layer, ...updates } : layer,
        ),
      },
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const res = await fetch("/api/templates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          description: form.description || undefined,
          platform: form.platform,
          format: form.format,
          components: form.components,
          constraints: form.constraints,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create template");
      }

      router.push("/templates");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create template");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <Link href="/templates" className="text-sm text-muted hover:text-foreground transition-colors">
          &larr; Back to templates
        </Link>
        <h1 className="text-2xl font-bold tracking-tight mt-3 mb-1">Create Template</h1>
        <p className="text-sm text-muted">Define a reusable template for rendering ad creatives.</p>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 mb-6">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Info */}
        <section className="rounded-xl border border-border-light p-6">
          <h2 className="text-sm font-semibold mb-4">Basic Info</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-muted mb-1.5">Template Name</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border border-border-light text-sm focus:outline-none focus:ring-2 focus:ring-foreground/10 focus:border-foreground/30"
                placeholder="e.g. Meta Feed Standard"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-muted mb-1.5">Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                rows={2}
                className="w-full px-3 py-2 rounded-lg border border-border-light text-sm focus:outline-none focus:ring-2 focus:ring-foreground/10 focus:border-foreground/30"
                placeholder="Optional description..."
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted mb-1.5">Platform</label>
              <select
                value={form.platform}
                onChange={(e) => setForm((p) => ({ ...p, platform: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border border-border-light text-sm bg-white"
              >
                <option value="meta">Meta</option>
                <option value="tiktok">TikTok</option>
                <option value="google">Google</option>
                <option value="linkedin">LinkedIn</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-muted mb-1.5">Format</label>
              <select
                value={form.format}
                onChange={(e) => updateFormat(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-border-light text-sm bg-white"
              >
                <option value="1:1">1:1 (1080x1080)</option>
                <option value="4:5">4:5 (1080x1350)</option>
                <option value="9:16">9:16 (1080x1920)</option>
                <option value="16:9">16:9 (1920x1080)</option>
                <option value="1.91:1">1.91:1 (1200x628)</option>
              </select>
            </div>
          </div>
        </section>

        {/* Constraints */}
        <section className="rounded-xl border border-border-light p-6">
          <h2 className="text-sm font-semibold mb-4">Constraints</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-muted mb-1.5">Max Headline Length</label>
              <input
                type="number"
                value={form.constraints.maxHeadlineLength}
                onChange={(e) =>
                  setForm((p) => ({
                    ...p,
                    constraints: { ...p.constraints, maxHeadlineLength: parseInt(e.target.value) || 40 },
                  }))
                }
                className="w-full px-3 py-2 rounded-lg border border-border-light text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted mb-1.5">Max Primary Text Length</label>
              <input
                type="number"
                value={form.constraints.maxPrimaryTextLength}
                onChange={(e) =>
                  setForm((p) => ({
                    ...p,
                    constraints: { ...p.constraints, maxPrimaryTextLength: parseInt(e.target.value) || 125 },
                  }))
                }
                className="w-full px-3 py-2 rounded-lg border border-border-light text-sm"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-muted mb-1.5">Fonts (comma-separated)</label>
              <input
                type="text"
                value={form.constraints.fonts.join(", ")}
                onChange={(e) =>
                  setForm((p) => ({
                    ...p,
                    constraints: {
                      ...p.constraints,
                      fonts: e.target.value.split(",").map((f) => f.trim()).filter(Boolean),
                    },
                  }))
                }
                className="w-full px-3 py-2 rounded-lg border border-border-light text-sm"
                placeholder="Inter, Helvetica"
              />
            </div>
          </div>
        </section>

        {/* Component Layers */}
        <section className="rounded-xl border border-border-light p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold">Layers</h2>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => addLayer("text")}
                className="px-3 py-1.5 text-xs rounded-lg border border-border-light hover:bg-gray-50 transition-colors"
              >
                + Text
              </button>
              <button
                type="button"
                onClick={() => addLayer("image")}
                className="px-3 py-1.5 text-xs rounded-lg border border-border-light hover:bg-gray-50 transition-colors"
              >
                + Image
              </button>
              <button
                type="button"
                onClick={() => addLayer("shape")}
                className="px-3 py-1.5 text-xs rounded-lg border border-border-light hover:bg-gray-50 transition-colors"
              >
                + Shape
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {form.components.layers.map((layer, idx) => (
              <div key={idx} className="rounded-lg border border-border-light p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${
                      layer.type === "text" ? "bg-blue-500" :
                      layer.type === "image" ? "bg-green-500" : "bg-purple-500"
                    }`} />
                    <span className="text-xs font-medium text-muted uppercase">{layer.type}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeLayer(idx)}
                    className="text-xs text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="col-span-2">
                    <label className="block text-xs text-muted mb-1">Name</label>
                    <input
                      type="text"
                      value={layer.name}
                      onChange={(e) => updateLayer(idx, { name: e.target.value })}
                      className="w-full px-2.5 py-1.5 rounded border border-border-light text-xs"
                    />
                  </div>
                  {(layer.type === "text" || layer.type === "image") && (
                    <div className="col-span-2">
                      <label className="block text-xs text-muted mb-1">Bound Field</label>
                      <select
                        value={layer.field || ""}
                        onChange={(e) => updateLayer(idx, { field: e.target.value || undefined })}
                        className="w-full px-2.5 py-1.5 rounded border border-border-light text-xs bg-white"
                      >
                        <option value="">None</option>
                        <option value="headline">Headline</option>
                        <option value="primaryText">Primary Text</option>
                        <option value="description">Description</option>
                        <option value="callToAction">Call to Action</option>
                        <option value="imageUrl">Image URL</option>
                        <option value="imagePrompt">Image Prompt</option>
                      </select>
                    </div>
                  )}
                  <div>
                    <label className="block text-xs text-muted mb-1">X</label>
                    <input
                      type="number"
                      value={layer.x}
                      onChange={(e) => updateLayer(idx, { x: parseInt(e.target.value) || 0 })}
                      className="w-full px-2.5 py-1.5 rounded border border-border-light text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-muted mb-1">Y</label>
                    <input
                      type="number"
                      value={layer.y}
                      onChange={(e) => updateLayer(idx, { y: parseInt(e.target.value) || 0 })}
                      className="w-full px-2.5 py-1.5 rounded border border-border-light text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-muted mb-1">Width</label>
                    <input
                      type="number"
                      value={layer.width}
                      onChange={(e) => updateLayer(idx, { width: parseInt(e.target.value) || 0 })}
                      className="w-full px-2.5 py-1.5 rounded border border-border-light text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-muted mb-1">Height</label>
                    <input
                      type="number"
                      value={layer.height}
                      onChange={(e) => updateLayer(idx, { height: parseInt(e.target.value) || 0 })}
                      className="w-full px-2.5 py-1.5 rounded border border-border-light text-xs"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Canvas size display */}
          <div className="mt-4 pt-4 border-t border-border-light">
            <p className="text-xs text-muted">
              Canvas: {form.components.width} x {form.components.height}px
            </p>
          </div>
        </section>

        {/* Submit */}
        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={saving || !form.name}
            className="px-6 py-2.5 rounded-lg bg-foreground text-white text-sm font-medium hover:bg-foreground/90 transition-colors disabled:opacity-50"
          >
            {saving ? "Creating..." : "Create Template"}
          </button>
          <Link
            href="/templates"
            className="px-4 py-2.5 rounded-lg border border-border text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
