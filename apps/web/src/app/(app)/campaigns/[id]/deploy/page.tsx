import Link from "next/link";

export default async function DeployPage({
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
        <span className="text-foreground">Deploy</span>
      </div>
      <h1 className="text-2xl font-bold tracking-tight mb-2">Deploy</h1>
      <p className="text-sm text-muted">Platform deployment dashboard — coming in Phase 3.</p>
    </div>
  );
}
