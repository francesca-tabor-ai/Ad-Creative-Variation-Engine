import Link from "next/link";

export default function DashboardPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight mb-1">Dashboard</h1>
        <p className="text-sm text-muted">Overview of your creative operations.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {[
          { label: "Active campaigns", value: "0" },
          { label: "Variants generated", value: "0" },
          { label: "Pending review", value: "0" },
          { label: "Total spend", value: "$0.00" },
        ].map((stat) => (
          <div key={stat.label} className="p-5 rounded-xl border border-border-light">
            <p className="text-xs text-muted mb-1">{stat.label}</p>
            <p className="text-2xl font-semibold">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="mb-8">
        <h2 className="text-sm font-medium mb-3">Quick actions</h2>
        <div className="flex gap-3">
          <Link
            href="/campaigns/new"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-foreground text-white text-sm font-medium hover:bg-foreground/90 transition-colors"
          >
            <PlusIcon />
            New campaign
          </Link>
        </div>
      </div>

      {/* Recent campaigns */}
      <div>
        <h2 className="text-sm font-medium mb-3">Recent campaigns</h2>
        <div className="rounded-xl border border-border-light p-8 text-center">
          <p className="text-sm text-muted mb-3">No campaigns yet.</p>
          <Link
            href="/campaigns/new"
            className="text-sm font-medium text-foreground underline underline-offset-4 hover:no-underline"
          >
            Create your first campaign
          </Link>
        </div>
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
