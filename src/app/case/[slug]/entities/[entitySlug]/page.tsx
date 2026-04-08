import Link from "next/link";
import { notFound } from "next/navigation";
import { CaseShell } from "@/components/case-shell";
import {
  getCaseBySlug,
  getEntityBySlug,
  getRelatedEvidence,
} from "@/lib/case-data";

type EntityDetailPageProps = {
  params: Promise<{ slug: string; entitySlug: string }>;
};

export default async function EntityDetailPage({
  params,
}: EntityDetailPageProps) {
  const { slug, entitySlug } = await params;
  const caseRecord = getCaseBySlug(slug);
  const entity = getEntityBySlug(slug, entitySlug);

  if (!caseRecord || !entity) {
    notFound();
  }

  const relatedEvidence = getRelatedEvidence(slug, entity.relatedEvidenceCodes);

  return (
    <CaseShell
      caseSlug={slug}
      title={caseRecord.title}
      tagline={entity.summary}
    >
      <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <article className="rounded-[2rem] border border-white/10 bg-slate-950/35 p-6">
          <p className="text-xs uppercase tracking-[0.3em] text-cyan-100/70">
            {entity.type}
          </p>
          <h2 className="mt-3 text-4xl text-white">{entity.name}</h2>
          <p className="mt-2 text-base text-slate-300">{entity.role}</p>
          <p className="mt-8 text-base leading-8 text-slate-200">
            {entity.description}
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
              <p className="text-xs uppercase tracking-[0.24em] text-cyan-100/70">
                Public Notes
              </p>
              <p className="mt-3 text-sm leading-7 text-slate-300">
                {entity.publicNotes}
              </p>
            </div>
            <div className="rounded-[1.5rem] border border-amber-100/15 bg-amber-50/5 p-5">
              <p className="text-xs uppercase tracking-[0.24em] text-amber-100/70">
                Hidden Notes
              </p>
              <p className="mt-3 text-sm leading-7 text-stone-200">
                {entity.hiddenNotes}
              </p>
            </div>
          </div>
        </article>

        <aside className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
          <p className="text-xs uppercase tracking-[0.3em] text-cyan-100/70">
            Related Evidence
          </p>
          <div className="mt-4 space-y-3">
            {relatedEvidence.map((item) => (
              <Link
                key={item.code}
                href={`/case/${slug}/evidence/${item.slug}`}
                className="block rounded-[1.25rem] border border-white/10 px-4 py-4 transition hover:border-white/25 hover:bg-white/5"
              >
                <p className="text-sm uppercase tracking-[0.18em] text-cyan-100/60">
                  {item.code}
                </p>
                <p className="mt-2 text-white">{item.title}</p>
                <p className="mt-2 text-sm leading-7 text-slate-300">
                  {item.summary}
                </p>
              </Link>
            ))}
          </div>
        </aside>
      </section>
    </CaseShell>
  );
}
