export default async function CampaignDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <h1 className="text-2xl font-bold mb-4">Campaign: {id}</h1>
      <p className="text-muted">Campaign detail view — coming in Phase 1.</p>
    </div>
  );
}
