export default async function DeployPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <h1 className="text-2xl font-bold mb-4">Deploy — Campaign {id}</h1>
      <p className="text-muted">Platform deployment dashboard — coming in Phase 3.</p>
    </div>
  );
}
