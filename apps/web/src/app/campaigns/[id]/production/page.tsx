export default async function ProductionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <h1 className="text-2xl font-bold mb-4">Production — Campaign {id}</h1>
      <p className="text-muted">Render queue and production orchestrator — coming in Phase 2.</p>
    </div>
  );
}
