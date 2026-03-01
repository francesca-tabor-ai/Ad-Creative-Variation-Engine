export default async function AnalyticsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <h1 className="text-2xl font-bold mb-4">Analytics — Campaign {id}</h1>
      <p className="text-muted">Performance analytics and creative intelligence — coming in Phase 3.</p>
    </div>
  );
}
