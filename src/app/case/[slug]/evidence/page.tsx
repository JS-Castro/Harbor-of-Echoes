import Link from "next/link";
import { notFound } from "next/navigation";
import { CaseShell } from "@/components/case-shell";
import {
  formatCaseDate,
  getCaseBySlugRuntime,
  getCaseEvidenceRuntime,
} from "@/lib/case-data";
import { getDictionary, getEvidenceTypeLabel } from "@/lib/i18n";
import { getCurrentLocale } from "@/lib/i18n-server";

type EvidencePageProps = {
  params: Promise<{ slug: string }>;
};

export default async function EvidencePage({ params }: EvidencePageProps) {
  const { slug } = await params;
  const locale = await getCurrentLocale();
  const dictionary = getDictionary(locale);
  const caseRecord = await getCaseBySlugRuntime(slug, locale);

  if (!caseRecord) {
    notFound();
  }

  const evidence = (await getCaseEvidenceRuntime(slug, locale)).sort((left, right) =>
    left.code.localeCompare(right.code),
  );

  return (
    <CaseShell
      caseSlug={slug}
      title={caseRecord.title}
      tagline={dictionary.evidenceList.tagline}
      locale={locale}
    >
      <section className="rounded-[2rem] border border-white/10 bg-slate-950/35 p-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.32em] text-cyan-100/70">
              {dictionary.nav.evidence}
            </p>
            <h2 className="mt-3 text-3xl text-white">{dictionary.evidenceList.heading}</h2>
          </div>
          <p className="text-sm text-slate-300">
            {dictionary.evidenceList.summary(evidence.length)}
          </p>
        </div>

        <div className="mt-6 grid gap-4">
          {evidence.map((item) => (
            <Link
              key={item.code}
              href={`/case/${slug}/evidence/${item.slug}`}
              className="grid gap-3 rounded-[1.5rem] border border-white/10 bg-white/5 p-5 transition hover:border-cyan-100/30 hover:bg-white/8 lg:grid-cols-[8rem_minmax(0,1fr)_8rem]"
            >
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-cyan-100/60">
                  {item.code}
                </p>
                <p className="mt-2 text-sm text-slate-300">
                  {getEvidenceTypeLabel(locale, item.type)}
                </p>
              </div>
              <div>
                <h3 className="text-2xl text-white">{item.title}</h3>
                <p className="mt-2 text-sm leading-7 text-slate-300">
                  {item.summary}
                </p>
              </div>
              <div className="text-left lg:text-right">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                  {formatCaseDate(item.sortDate, locale)}
                </p>
                <p className="mt-2 text-sm text-slate-300">
                  {dictionary.shared.confidence}: {item.confidence}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </CaseShell>
  );
}
