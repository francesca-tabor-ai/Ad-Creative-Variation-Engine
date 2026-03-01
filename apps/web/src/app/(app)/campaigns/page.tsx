import Link from "next/link";

export default function CampaignsPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight mb-1">Campaigns</h1>
          <p className="text-sm text-muted">Manage your creative campaigns.</p>
        </div>
        <Link
          href="/campaigns/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-foreground text-white text-sm font-medium hover:bg-foreground/90 transition-colors"
        >
          <PlusIcon />
          New campaign
        </Link>
      </div>

      {/* Campaign list - will be populated from API */}
      <div className="rounded-xl border border-border-light p-12 text-center">
        <div className="w-12 h-12 rounded-xl bg-gray-50 border border-border-light mx-auto mb-4 flex items-center justify-center">
          <FolderIcon />
        </div>
        <p className="text-sm font-medium mb-1">No campaigns yet</p>
        <p className="text-xs text-muted mb-4">
          Create a campaign to start generating ad creative variations.
        </p>
        <Link
          href="/campaigns/new"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-sm font-medium hover:bg-gray-50 transition-colors"
        >
          Get started
        </Link>
      </div>
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

function FolderIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-muted">
      <path d="M1.5 3.5a1 1 0 011-1h3l1.5 1.5h6a1 1 0 011 1v7a1 1 0 01-1 1h-10.5a1 1 0 01-1-1z" />
    </svg>
  );
}
