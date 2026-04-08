import { notFound } from "next/navigation";
import { CaseShell } from "@/components/case-shell";
import { getCaseBySlug } from "@/lib/case-data";
import { getDictionary } from "@/lib/i18n";
import { getCurrentLocale } from "@/lib/i18n-server";

type ReportPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function ReportPage({ params }: ReportPageProps) {
  const { slug } = await params;
  const locale = await getCurrentLocale();
  const dictionary = getDictionary(locale);
  const caseRecord = getCaseBySlug(slug, locale);

  if (!caseRecord) {
    notFound();
  }

  return (
    <CaseShell
      caseSlug={slug}
      title={caseRecord.title}
      tagline={dictionary.report.tagline}
      locale={locale}
    >
      <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <article className="rounded-[2rem] border border-white/10 bg-slate-950/35 p-6">
          <p className="text-xs uppercase tracking-[0.32em] text-cyan-100/70">
            {dictionary.report.heading}
          </p>
          <div className="mt-6 grid gap-5">
            {Object.entries(dictionary.report.answers).map(([key, answers]) => (
              <div
                key={key}
                className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5"
              >
                <p className="text-sm uppercase tracking-[0.24em] text-cyan-100/70">
                  {dictionary.report.axes[key as keyof typeof dictionary.report.axes]}
                </p>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {answers.map((answer) => (
                    <button
                      key={answer}
                      type="button"
                      className="rounded-[1rem] border border-white/10 px-4 py-3 text-left text-sm text-slate-200 transition hover:border-white/25 hover:bg-white/5"
                    >
                      {answer}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </article>

        <aside className="rounded-[2rem] border border-amber-100/15 bg-amber-50/5 p-6">
          <p className="text-xs uppercase tracking-[0.32em] text-amber-100/70">
            {dictionary.report.bestCaseAnswer}
          </p>
          <div className="mt-4 space-y-4 text-sm leading-7 text-stone-200">
            <p>{dictionary.report.bestCase.cause}</p>
            <p>{dictionary.report.bestCase.responsibility}</p>
            <p>{dictionary.report.bestCase.motive}</p>
          </div>
        </aside>
      </section>
    </CaseShell>
  );
}
