import Link from "next/link";
import { notFound } from "next/navigation";
import { CaseShell } from "@/components/case-shell";
import {
  formatCaseDate,
  getCaseBySlug,
  getCaseEntities,
  getCaseEvidence,
  getCaseEvents,
  getCaseUnlocks,
} from "@/lib/case-data";

type CasePageProps = {
  params: Promise<{ slug: string }>;
};

export default async function CaseDashboardPage({ params }: CasePageProps) {
  const { slug } = await params;
  const caseRecord = getCaseBySlug(slug);

  if (!caseRecord) {
    notFound();
  }

  const evidence = getCaseEvidence(slug);
  const entities = getCaseEntities(slug);
  const events = getCaseEvents(slug);
  const unlocks = getCaseUnlocks(slug);
  const recentEvidence = [...evidence]
    .sort((left, right) => right.discoveryPhase - left.discoveryPhase)
    .slice(0, 4);

  return (
    <CaseShell
      caseSlug={slug}
      title={caseRecord.title}
      tagline={caseRecord.summary}
    >
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <section className="rounded-[2rem] border border-white/10 bg-slate-950/35 p-6">
          <p className="text-xs uppercase tracking-[0.32em] text-cyan-100/70">
            Investigation Brief
          </p>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-200">
            {caseRecord.tagline}
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <article className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
              <p className="text-3xl text-white">{evidence.length}</p>
              <p className="mt-1 text-sm text-slate-300">Evidence items</p>
            </article>
            <article className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
              <p className="text-3xl text-white">{entities.length}</p>
              <p className="mt-1 text-sm text-slate-300">Entities in play</p>
            </article>
            <article className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
              <p className="text-3xl text-white">{events.length}</p>
              <p className="mt-1 text-sm text-slate-300">Timeline events</p>
            </article>
          </div>
        </section>

        <aside className="rounded-[2rem] border border-amber-100/10 bg-amber-50/5 p-6">
          <p className="text-xs uppercase tracking-[0.32em] text-amber-100/70">
            Primary Question
          </p>
          <p className="mt-4 text-lg leading-8 text-stone-200">
            {caseRecord.canonicalQuestion}
          </p>
          <p className="mt-6 text-sm leading-7 text-slate-300">
            Unlock structure is already authored across {unlocks.length} rules.
            The app can now render the case from seeded content instead of
            hard-coded strings.
          </p>
        </aside>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,22rem)]">
        <section className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.32em] text-cyan-100/70">
                Recent Leads
              </p>
              <h2 className="mt-3 text-3xl text-white">Evidence by escalation</h2>
            </div>
            <Link
              href={`/case/${slug}/evidence`}
              className="rounded-full border border-white/10 px-4 py-2 text-sm text-slate-200 transition hover:border-white/30 hover:bg-white/5"
            >
              Open vault
            </Link>
          </div>

          <div className="mt-6 grid gap-4">
            {recentEvidence.map((item) => (
              <Link
                key={item.code}
                href={`/case/${slug}/evidence/${item.slug}`}
                className="rounded-[1.5rem] border border-white/10 bg-slate-950/40 p-5 transition hover:border-cyan-100/30 hover:bg-slate-950/60"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-cyan-100/60">
                      {item.code}
                    </p>
                    <h3 className="mt-2 text-2xl text-white">{item.title}</h3>
                  </div>
                  <span className="rounded-full border border-white/10 px-3 py-1 text-xs uppercase tracking-[0.18em] text-slate-300">
                    Phase {item.discoveryPhase}
                  </span>
                </div>
                <p className="mt-3 text-sm leading-7 text-slate-300">
                  {item.summary}
                </p>
                <p className="mt-4 text-xs uppercase tracking-[0.18em] text-slate-400">
                  {formatCaseDate(item.sortDate)}
                </p>
              </Link>
            ))}
          </div>
        </section>

        <section className="rounded-[2rem] border border-white/10 bg-slate-950/35 p-6">
          <p className="text-xs uppercase tracking-[0.32em] text-cyan-100/70">
            Core Cast
          </p>
          <div className="mt-5 space-y-3">
            {entities.slice(0, 6).map((entity) => (
              <Link
                key={entity.slug}
                href={`/case/${slug}/entities/${entity.slug}`}
                className="block rounded-[1.25rem] border border-white/10 px-4 py-4 transition hover:border-white/25 hover:bg-white/5"
              >
                <p className="text-lg text-white">{entity.name}</p>
                <p className="mt-1 text-sm text-slate-300">{entity.role}</p>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </CaseShell>
  );
}
