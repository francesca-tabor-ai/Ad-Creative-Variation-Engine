import Link from "next/link";

export default async function CampaignDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div>
      <div className="flex items-center gap-2 text-sm text-muted mb-6">
        <Link href="/campaigns" className="hover:text-foreground transition-colors">
          Campaigns
        </Link>
        <span>/</span>
        <span className="text-foreground">{id}</span>
      </div>

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight mb-1">Campaign</h1>
          <p className="text-sm text-muted">Campaign overview and variant management.</p>
        </div>
      </div>

      {/* Tab navigation */}
      <div className="flex gap-1 mb-8 border-b border-border-light">
        {[
          { href: `/campaigns/${id}`, label: "Overview" },
          { href: `/campaigns/${id}/variants`, label: "Variants" },
          { href: `/campaigns/${id}/production`, label: "Production" },
          { href: `/campaigns/${id}/deploy`, label: "Deploy" },
          { href: `/campaigns/${id}/analytics`, label: "Analytics" },
        ].map((tab) => (
          <Link
            key={tab.href}
            href={tab.href}
            className="px-4 py-2.5 text-sm font-medium text-muted hover:text-foreground border-b-2 border-transparent hover:border-foreground/20 transition-colors -mb-px"
          >
            {tab.label}
          </Link>
        ))}
      </div>

      {/* Campaign details placeholder */}
      <div className="grid grid-cols-2 gap-6">
        <div className="p-5 rounded-xl border border-border-light">
          <p className="text-xs text-muted mb-1">Status</p>
          <p className="text-sm font-medium">Draft</p>
        </div>
        <div className="p-5 rounded-xl border border-border-light">
          <p className="text-xs text-muted mb-1">Variants</p>
          <p className="text-sm font-medium">0 generated</p>
        </div>
        <div className="p-5 rounded-xl border border-border-light">
          <p className="text-xs text-muted mb-1">Generation cost</p>
          <p className="text-sm font-medium">$0.00</p>
        </div>
        <div className="p-5 rounded-xl border border-border-light">
          <p className="text-xs text-muted mb-1">Approved</p>
          <p className="text-sm font-medium">0 / 0</p>
        </div>
      </div>
    </div>
  );
}
