import Link from "next/link";

export default async function ProductionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <div>
      <div className="flex items-center gap-2 text-sm text-muted mb-6">
        <Link href="/campaigns" className="hover:text-foreground transition-colors">Campaigns</Link>
        <span>/</span>
        <Link href={`/campaigns/${id}`} className="hover:text-foreground transition-colors">{id}</Link>
        <span>/</span>
        <span className="text-foreground">Production</span>
      </div>
      <h1 className="text-2xl font-bold tracking-tight mb-2">Production</h1>
      <p className="text-sm text-muted">Render queue and production orchestrator — coming in Phase 2.</p>
    </div>
  );
}
