"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

interface RenderJob {
  id: string;
  variantId: string;
  templateId: string | null;
  status: string;
  format: string;
  priority: number;
  errorMessage: string | null;
  startedAt: string | null;
  completedAt: string | null;
  createdAt: string;
}

interface Asset {
  id: string;
  renderJobId: string;
  url: string;
  format: string;
  mimeType: string;
  fileSizeBytes: number | null;
  createdAt: string;
}

const statusColors: Record<string, string> = {
  queued: "bg-yellow-50 text-yellow-700",
  processing: "bg-blue-50 text-blue-700",
  completed: "bg-green-50 text-green-700",
  failed: "bg-red-50 text-red-700",
};

export default function ProductionPage() {
  const params = useParams();
  const campaignId = params.id as string;

  const [renderJobs, setRenderJobs] = useState<RenderJob[]>([]);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [rendering, setRendering] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadData();
  }, [campaignId]);

  async function loadData() {
    try {
      const [jobsRes, assetsRes] = await Promise.all([
        fetch(`/api/campaigns/${campaignId}/render-jobs`),
        fetch(`/api/campaigns/${campaignId}/assets`),
      ]);
      const jobsData = await jobsRes.json();
      const assetsData = await assetsRes.json();
      setRenderJobs(jobsData.renderJobs || []);
      setAssets(assetsData.assets || []);
    } catch {
      console.error("Failed to load production data");
    } finally {
      setLoading(false);
    }
  }

  async function triggerRender() {
    setRendering(true);
    setError("");

    try {
      const variantsRes = await fetch(`/api/campaigns/${campaignId}/variants`);
      const variantsData = await variantsRes.json();
      const approvedVariants = (variantsData.variants || []).filter(
        (v: { status: string }) => v.status === "approved",
      );

      if (approvedVariants.length === 0) {
        setError("No approved variants to render. Approve variants first.");
        return;
      }

      const res = await fetch(`/api/campaigns/${campaignId}/render`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          variantIds: approvedVariants.map((v: { id: string }) => v.id),
          formats: ["1:1"],
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to trigger render");

      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to trigger render");
    } finally {
      setRendering(false);
    }
  }

  return (
    <div>
      <div className="flex items-center gap-2 text-sm text-muted mb-6">
        <Link href="/campaigns" className="hover:text-foreground transition-colors">Campaigns</Link>
        <span>/</span>
        <Link href={`/campaigns/${campaignId}`} className="hover:text-foreground transition-colors">{campaignId}</Link>
        <span>/</span>
        <span className="text-foreground">Production</span>
      </div>

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight mb-1">Production</h1>
          <p className="text-sm text-muted">Render approved variants into ad creative assets.</p>
        </div>
        <button
          onClick={triggerRender}
          disabled={rendering}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-foreground text-white text-sm font-medium hover:bg-foreground/90 transition-colors disabled:opacity-50"
        >
          {rendering ? "Rendering..." : "Render Approved Variants"}
        </button>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 mb-6">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {loading ? (
        <div className="rounded-xl border border-border-light p-12 text-center">
          <p className="text-sm text-muted">Loading production data...</p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Render Queue */}
          <section>
            <h2 className="text-sm font-semibold mb-4">
              Render Queue <span className="text-muted font-normal">({renderJobs.length})</span>
            </h2>
            {renderJobs.length === 0 ? (
              <div className="rounded-xl border border-border-light p-8 text-center">
                <p className="text-sm text-muted">
                  No render jobs yet. Approve variants and click &ldquo;Render Approved Variants&rdquo; to start.
                </p>
              </div>
            ) : (
              <div className="rounded-xl border border-border-light overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border-light bg-gray-50/50">
                      <th className="text-left px-4 py-3 text-xs font-medium text-muted">Job ID</th>
                      <th className="text-left px-4 py-3 text-xs font-medium text-muted">Variant</th>
                      <th className="text-left px-4 py-3 text-xs font-medium text-muted">Format</th>
                      <th className="text-left px-4 py-3 text-xs font-medium text-muted">Status</th>
                      <th className="text-left px-4 py-3 text-xs font-medium text-muted">Created</th>
                    </tr>
                  </thead>
                  <tbody>
                    {renderJobs.map((job) => (
                      <tr key={job.id} className="border-b border-border-light last:border-0">
                        <td className="px-4 py-3 text-xs font-mono text-muted">{job.id.slice(0, 16)}...</td>
                        <td className="px-4 py-3 text-xs font-mono text-muted">{job.variantId.slice(0, 16)}...</td>
                        <td className="px-4 py-3">
                          <span className="text-xs font-medium bg-gray-50 px-2 py-0.5 rounded">{job.format}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${statusColors[job.status] || "bg-gray-50 text-gray-700"}`}>
                            {job.status}
                          </span>
                          {job.errorMessage && <p className="text-xs text-red-500 mt-1">{job.errorMessage}</p>}
                        </td>
                        <td className="px-4 py-3 text-xs text-muted">{new Date(job.createdAt).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          {/* Asset Gallery */}
          <section>
            <h2 className="text-sm font-semibold mb-4">
              Rendered Assets <span className="text-muted font-normal">({assets.length})</span>
            </h2>
            {assets.length === 0 ? (
              <div className="rounded-xl border border-border-light p-8 text-center">
                <p className="text-sm text-muted">No rendered assets yet. Completed render jobs will appear here.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {assets.map((asset) => (
                  <div key={asset.id} className="rounded-xl border border-border-light overflow-hidden hover:border-border transition-colors">
                    <div
                      className="aspect-square bg-gray-50 flex items-center justify-center bg-cover bg-center"
                      style={{ backgroundImage: `url(${asset.url})` }}
                    />
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium bg-gray-50 px-2 py-0.5 rounded">{asset.format}</span>
                        <span className="text-xs text-muted">{asset.fileSizeBytes ? `${(asset.fileSizeBytes / 1024).toFixed(1)} KB` : "—"}</span>
                      </div>
                      <p className="text-xs font-mono text-muted mb-2">{asset.id}</p>
                      <a href={asset.url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:text-blue-800 font-medium">
                        Download
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  );
}
