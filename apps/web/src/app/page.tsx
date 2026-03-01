export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-border-light">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-bg" />
            <span className="text-lg font-semibold tracking-tight">ACVE</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-muted">
            <a href="#capabilities" className="hover:text-foreground transition-colors">
              Capabilities
            </a>
            <a href="#how-it-works" className="hover:text-foreground transition-colors">
              How it works
            </a>
            <a href="#architecture" className="hover:text-foreground transition-colors">
              Architecture
            </a>
            <a href="#roadmap" className="hover:text-foreground transition-colors">
              Roadmap
            </a>
          </div>
          <a
            href="#get-started"
            className="text-sm font-medium px-4 py-2 rounded-full bg-foreground text-white hover:bg-foreground/90 transition-colors"
          >
            Get started
          </a>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-40 pb-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="animate-fade-in-up">
            <p className="text-sm font-medium text-muted tracking-wide uppercase mb-6">
              Creative infrastructure
            </p>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.08] mb-8">
              Infinite variations.
              <br />
              <span className="gradient-text">Governed delivery.</span>
            </h1>
          </div>
          <p className="animate-fade-in-up-delay-1 text-xl md:text-2xl text-muted leading-relaxed max-w-2xl mx-auto mb-12 font-light">
            Transform approved ad concepts into scalable, multi-channel,
            deployment-ready assets. Automatically.
          </p>
          <div className="animate-fade-in-up-delay-2 flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#get-started"
              className="inline-flex items-center justify-center px-8 py-3.5 rounded-full gradient-bg text-white font-medium text-base hover:opacity-90 transition-opacity"
            >
              Start building
            </a>
            <a
              href="#how-it-works"
              className="inline-flex items-center justify-center px-8 py-3.5 rounded-full border border-border text-foreground font-medium text-base hover:bg-gray-50 transition-colors"
            >
              See how it works
            </a>
          </div>
        </div>
      </section>

      {/* Product UI Mock */}
      <section className="px-6 pb-32">
        <div className="max-w-5xl mx-auto">
          <div className="animate-fade-in-up-delay-3 rounded-2xl border border-border bg-gray-50/50 p-1.5 shadow-xl shadow-gray-200/50">
            <div className="rounded-xl bg-white border border-border-light overflow-hidden">
              {/* Mock toolbar */}
              <div className="border-b border-border-light px-6 py-3 flex items-center gap-3">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-gray-200" />
                  <div className="w-3 h-3 rounded-full bg-gray-200" />
                  <div className="w-3 h-3 rounded-full bg-gray-200" />
                </div>
                <div className="flex-1 flex justify-center">
                  <div className="px-4 py-1 rounded-md bg-gray-50 text-xs text-muted font-mono">
                    acve.app/campaigns/q4-launch/variants
                  </div>
                </div>
              </div>
              {/* Mock dashboard */}
              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <div className="h-5 w-48 bg-gray-100 rounded mb-2" />
                    <div className="h-3 w-32 bg-gray-50 rounded" />
                  </div>
                  <div className="flex gap-2">
                    <div className="h-8 w-20 rounded-lg bg-gray-100" />
                    <div className="h-8 w-24 rounded-lg gradient-bg opacity-80" />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="rounded-xl border border-border-light p-4">
                      <div className="h-28 bg-gray-50 rounded-lg mb-3" />
                      <div className="h-3 w-3/4 bg-gray-100 rounded mb-2" />
                      <div className="h-3 w-1/2 bg-gray-50 rounded mb-3" />
                      <div className="flex gap-2">
                        <div className="h-5 w-12 rounded-full bg-green-50 border border-green-100" />
                        <div className="h-5 w-14 rounded-full bg-gray-50 border border-border-light" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Statement */}
      <section className="px-6 pb-32">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm font-medium text-muted tracking-wide uppercase mb-4">
            The problem
          </p>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">
            Creative output scales. Operations don&apos;t.
          </h2>
          <p className="text-lg text-muted leading-relaxed max-w-2xl mx-auto mb-16 font-light">
            AI enables hundreds of ad variants per campaign. But production, governance,
            and deployment systems weren&apos;t built for this volume.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Volume explosion",
                description:
                  "AI-generated variants outpace manual review, template scripting, and file management workflows.",
              },
              {
                title: "Production fragility",
                description:
                  "Desktop rendering, manual file organization, and inconsistent version control create delays and risk.",
              },
              {
                title: "Governance blind spots",
                description:
                  "No transparency into AI generation cost, render cost, version dependencies, or approval authority.",
              },
            ].map((item) => (
              <div key={item.title} className="text-left p-6 rounded-2xl border border-border-light">
                <h3 className="text-base font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-muted leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Capabilities */}
      <section id="capabilities" className="px-6 pb-32">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm font-medium text-muted tracking-wide uppercase mb-4">
              Capabilities
            </p>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">
              A creative supply chain
              <br />
              <span className="gradient-text">operating system</span>
            </h2>
            <p className="text-lg text-muted font-light max-w-2xl mx-auto">
              Not a creative tool. Infrastructure that powers AI-driven creative production
              at enterprise scale.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                label: "Metadata-first creative objects",
                description:
                  "Every variant is structured data — traceable to its creative brief, template, approval chain, and deployment lineage. Not a static file.",
                icon: "{ }",
              },
              {
                label: "Production orchestration",
                description:
                  "Automated compliance validation, dynamic template selection, render queue management, cost guardrails, and version control in a single pipeline.",
                icon: "-->",
              },
              {
                label: "Parallel cloud rendering",
                description:
                  "Scalable render workers for high-volume multi-format export. 1:1, 4:5, 9:16. Multi-language. Predictable cost per asset.",
                icon: "|||",
              },
              {
                label: "Weighted governance",
                description:
                  "Team-based vote weights, configurable approval thresholds, mandatory team sign-off, veto authority, and immutable audit logs.",
                icon: "%%%",
              },
              {
                label: "Direct platform deployment",
                description:
                  "API-based delivery to Meta, TikTok, Google Ads, and LinkedIn. No manual uploads. Performance feedback loops included.",
                icon: "=>",
              },
              {
                label: "Cost transparency",
                description:
                  "AI generation cost, render cost, and cost-per-approved-asset — tracked at every stage. Budget guardrails and forecasting built in.",
                icon: "$ $",
              },
            ].map((item) => (
              <div
                key={item.label}
                className="p-6 rounded-2xl border border-border-light hover:border-border transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-gray-50 border border-border-light flex items-center justify-center text-xs font-mono text-muted mb-4">
                  {item.icon}
                </div>
                <h3 className="text-base font-semibold mb-2">{item.label}</h3>
                <p className="text-sm text-muted leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="px-6 pb-32">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm font-medium text-muted tracking-wide uppercase mb-4">
              How it works
            </p>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              Brief to deployment in one pipeline
            </h2>
          </div>
          <div className="space-y-0">
            {[
              {
                step: "01",
                title: "Ingest creative brief",
                description:
                  "Paste or upload your brief. NLP extraction pulls out target audience, offer details, funnel stage, brand guidelines, and platform constraints. Review and override any field.",
              },
              {
                step: "02",
                title: "Generate variations",
                description:
                  "AI produces structured creative variants across angles, hooks, and emotional triggers. Every variant is a metadata object with full cost estimation and lineage tracking.",
              },
              {
                step: "03",
                title: "Govern and approve",
                description:
                  "Weighted team voting with configurable thresholds. Veto authority for compliance and brand. Full audit trail. No variation moves to production without governance.",
              },
              {
                step: "04",
                title: "Render at scale",
                description:
                  "Approved variants flow into cloud render queues. Parallel workers produce multi-format, multi-resolution assets. Cost tracked per render. Templates enforce brand consistency.",
              },
              {
                step: "05",
                title: "Deploy and measure",
                description:
                  "Assets deploy via API to Meta, TikTok, Google, LinkedIn. Performance data feeds back to creative intelligence. Fatigue detection triggers regeneration.",
              },
            ].map((item, i) => (
              <div key={item.step} className="flex gap-8 items-start">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full border-2 border-border flex items-center justify-center text-sm font-semibold text-muted">
                    {item.step}
                  </div>
                  {i < 4 && <div className="w-px h-16 bg-border-light" />}
                </div>
                <div className="pb-16 pt-2">
                  <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                  <p className="text-sm text-muted leading-relaxed max-w-lg">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Architecture */}
      <section id="architecture" className="px-6 pb-32">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm font-medium text-muted tracking-wide uppercase mb-4">
              Architecture
            </p>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">
              Built for the scale AI demands
            </h2>
            <p className="text-lg text-muted font-light max-w-2xl mx-auto">
              Cloud-native, metadata-driven, and designed to handle thousands of creative
              variants without desktop bottlenecks.
            </p>
          </div>
          <div className="rounded-2xl border border-border-light bg-gray-50/30 p-8 md:p-12">
            <div className="grid md:grid-cols-4 gap-6 text-center">
              {[
                { label: "Next.js", sublabel: "App Router" },
                { label: "PostgreSQL", sublabel: "Structured data" },
                { label: "BullMQ", sublabel: "Job queues" },
                { label: "Vercel AI SDK", sublabel: "Multi-provider" },
              ].map((item) => (
                <div key={item.label} className="p-4 rounded-xl bg-white border border-border-light">
                  <p className="text-sm font-semibold mb-0.5">{item.label}</p>
                  <p className="text-xs text-muted">{item.sublabel}</p>
                </div>
              ))}
            </div>
            <div className="mt-8 grid md:grid-cols-3 gap-4">
              {[
                {
                  title: "Drizzle ORM",
                  description: "Type-safe SQL with zero overhead. Schema-first migrations.",
                },
                {
                  title: "Cloud render workers",
                  description: "Parallel headless rendering. Multi-format, multi-resolution output.",
                },
                {
                  title: "Platform APIs",
                  description: "Direct deployment to Meta, TikTok, Google Ads, and LinkedIn.",
                },
              ].map((item) => (
                <div key={item.title} className="p-4 rounded-xl bg-white border border-border-light">
                  <p className="text-sm font-semibold mb-1">{item.title}</p>
                  <p className="text-xs text-muted leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Roadmap */}
      <section id="roadmap" className="px-6 pb-32">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm font-medium text-muted tracking-wide uppercase mb-4">
              Roadmap
            </p>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              Four phases to autonomous creative ops
            </h2>
          </div>
          <div className="space-y-6">
            {[
              {
                phase: "Phase 1",
                title: "Foundation",
                status: "In progress",
                statusColor: "bg-green-50 text-green-700 border-green-100",
                items: [
                  "Structured creative object model",
                  "AI variant generation with cost estimation",
                  "Adaptive brief intake with NLP extraction",
                  "Variation review interface",
                ],
              },
              {
                phase: "Phase 2",
                title: "Governance & production",
                status: "Planned",
                statusColor: "bg-gray-50 text-muted border-border-light",
                items: [
                  "Weighted voting and approval workflows",
                  "Production orchestrator",
                  "Modular template system",
                  "Cloud rendering infrastructure",
                ],
              },
              {
                phase: "Phase 3",
                title: "Deployment & intelligence",
                status: "Planned",
                statusColor: "bg-gray-50 text-muted border-border-light",
                items: [
                  "Direct ad platform API deployment",
                  "Performance data ingestion and tracking",
                  "Creative intelligence engine",
                  "Regeneration workflows",
                ],
              },
              {
                phase: "Phase 4",
                title: "Enterprise scale",
                status: "Planned",
                statusColor: "bg-gray-50 text-muted border-border-light",
                items: [
                  "Cost governance and guardrails",
                  "Multi-language and localization",
                  "Autonomous multi-agent system",
                  "Enterprise security (RBAC, SSO, SOC2)",
                ],
              },
            ].map((phase) => (
              <div key={phase.phase} className="rounded-2xl border border-border-light p-6 md:p-8">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono text-muted uppercase tracking-wider">
                      {phase.phase}
                    </span>
                    <h3 className="text-lg font-semibold">{phase.title}</h3>
                  </div>
                  <span
                    className={`text-xs font-medium px-3 py-1 rounded-full border ${phase.statusColor}`}
                  >
                    {phase.status}
                  </span>
                </div>
                <div className="grid sm:grid-cols-2 gap-2">
                  {phase.items.map((item) => (
                    <div key={item} className="flex items-start gap-2 text-sm text-muted">
                      <span className="text-border mt-1 shrink-0">&#x2022;</span>
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="get-started" className="px-6 pb-32">
        <div className="max-w-4xl mx-auto text-center">
          <div className="rounded-3xl gradient-bg p-px">
            <div className="rounded-[calc(1.5rem-1px)] bg-white p-12 md:p-20">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                Scale creative output.
                <br />
                Not operational risk.
              </h2>
              <p className="text-lg text-muted font-light max-w-lg mx-auto mb-8">
                ACVE is the infrastructure layer between AI-powered ideation and
                enterprise-grade production deployment.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="https://github.com/francesca-tabor-ai/Ad-Creative-Variation-Engine"
                  className="inline-flex items-center justify-center px-8 py-3.5 rounded-full bg-foreground text-white font-medium text-base hover:bg-foreground/90 transition-colors"
                >
                  View on GitHub
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border-light px-6 py-12">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md gradient-bg" />
            <span className="text-sm font-semibold tracking-tight">ACVE</span>
          </div>
          <p className="text-xs text-muted">
            Ad Creative Variation Engine. Built for the AI creative supply chain.
          </p>
        </div>
      </footer>
    </div>
  );
}
