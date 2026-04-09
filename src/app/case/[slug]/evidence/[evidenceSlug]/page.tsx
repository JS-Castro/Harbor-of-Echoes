import Link from "next/link";
import { notFound } from "next/navigation";
import { CaseShell } from "@/components/case-shell";
import { EvidenceVisual } from "@/components/evidence-visual";
import { EvidenceViewTracker } from "@/components/evidence-view-tracker";
import {
  formatCaseDate,
  getCaseBySlug,
  getEvidenceBySlug,
  getRelatedEntities,
} from "@/lib/case-data";
import { getDictionary, getEvidenceTypeLabel } from "@/lib/i18n";
import { getCurrentLocale } from "@/lib/i18n-server";

type EvidenceDetailPageProps = {
  params: Promise<{ slug: string; evidenceSlug: string }>;
};

export default async function EvidenceDetailPage({
  params,
}: EvidenceDetailPageProps) {
  const { slug, evidenceSlug } = await params;
  const locale = await getCurrentLocale();
  const dictionary = getDictionary(locale);
  const caseRecord = getCaseBySlug(slug, locale);
  const evidence = getEvidenceBySlug(slug, evidenceSlug, locale);

  if (!caseRecord || !evidence) {
    notFound();
  }

  const relatedEntities = getRelatedEntities(slug, evidence.relatedEntitySlugs, locale);

  return (
    <CaseShell
      caseSlug={slug}
      title={caseRecord.title}
      tagline={evidence.summary}
      locale={locale}
    >
      <EvidenceViewTracker caseSlug={slug} evidenceCode={evidence.code} />
      <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_18rem]">
        <article className="rounded-[2rem] border border-white/10 bg-slate-950/35 p-6">
          <p className="text-xs uppercase tracking-[0.28em] text-cyan-100/70">
            {evidence.code}
          </p>
          <h2 className="mt-3 text-4xl text-white">{evidence.title}</h2>
          <div className="mt-4 flex flex-wrap gap-3 text-sm text-slate-300">
            <span>{getEvidenceTypeLabel(locale, evidence.type)}</span>
            <span>{dictionary.shared.confidence}: {evidence.confidence}</span>
            <span>{formatCaseDate(evidence.sortDate, locale)}</span>
          </div>
          <div className="mt-8">
            <EvidenceVisual evidence={evidence} />
          </div>
          <p className="mt-8 rounded-[1.5rem] border border-white/10 bg-white/5 p-5 text-base leading-8 text-slate-200">
            {evidence.content}
          </p>
        </article>

        <aside className="space-y-6">
          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
            <p className="text-xs uppercase tracking-[0.28em] text-cyan-100/70">
              {dictionary.evidenceDetail.source}
            </p>
            <p className="mt-3 text-lg text-white">{evidence.sourceLabel}</p>
            <p className="mt-2 text-sm leading-7 text-slate-300">
              {dictionary.evidenceDetail.discoveryPhase(evidence.discoveryPhase)}
            </p>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
            <p className="text-xs uppercase tracking-[0.28em] text-cyan-100/70">
              {dictionary.shared.relatedEntities}
            </p>
            <div className="mt-4 space-y-3">
              {relatedEntities.map((entity) => (
                <Link
                  key={entity.slug}
                  href={`/case/${slug}/entities/${entity.slug}`}
                  className="block rounded-[1.25rem] border border-white/10 px-4 py-3 transition hover:border-white/25 hover:bg-white/5"
                >
                  <p className="text-white">{entity.name}</p>
                  <p className="mt-1 text-sm text-slate-300">{entity.role}</p>
                </Link>
              ))}
            </div>
          </div>
        </aside>
      </section>
    </CaseShell>
  );
}
