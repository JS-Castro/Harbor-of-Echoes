import { notFound } from "next/navigation";
import { CaseShell } from "@/components/case-shell";
import { getCaseBySlug, getCaseEntities, getCaseEvidence } from "@/lib/case-data";

type BoardPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function BoardPage({ params }: BoardPageProps) {
  const { slug } = await params;
  const caseRecord = getCaseBySlug(slug);

  if (!caseRecord) {
    notFound();
  }

  const evidence = getCaseEvidence(slug).slice(0, 6);
  const entities = getCaseEntities(slug).slice(0, 6);

  return (
    <CaseShell
      caseSlug={slug}
      title={caseRecord.title}
      tagline="Board preview for clustering leads before the interactive graph lands."
    >
      <section className="grid gap-6 lg:grid-cols-2">
        <article className="rounded-[2rem] border border-white/10 bg-slate-950/35 p-6">
          <p className="text-xs uppercase tracking-[0.32em] text-cyan-100/70">
            Suggested Evidence Nodes
          </p>
          <div className="mt-5 grid gap-4">
            {evidence.map((item) => (
              <div
                key={item.code}
                className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4"
              >
                <p className="text-xs uppercase tracking-[0.18em] text-cyan-100/60">
                  {item.code}
                </p>
                <p className="mt-2 text-lg text-white">{item.title}</p>
                <p className="mt-2 text-sm leading-7 text-slate-300">
                  {item.summary}
                </p>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
          <p className="text-xs uppercase tracking-[0.32em] text-cyan-100/70">
            Suggested Entity Nodes
          </p>
          <div className="mt-5 grid gap-4">
            {entities.map((entity) => (
              <div
                key={entity.slug}
                className="rounded-[1.5rem] border border-white/10 bg-slate-950/35 p-4"
              >
                <p className="text-lg text-white">{entity.name}</p>
                <p className="mt-2 text-sm text-slate-300">{entity.role}</p>
              </div>
            ))}
          </div>
        </article>
      </section>
    </CaseShell>
  );
}
