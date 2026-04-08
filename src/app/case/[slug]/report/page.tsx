import { notFound } from "next/navigation";
import { CaseShell } from "@/components/case-shell";
import { getCaseBySlug } from "@/lib/case-data";

type ReportPageProps = {
  params: Promise<{ slug: string }>;
};

const answerSets = {
  cause: ["Accidental fall", "Premeditated murder", "Suicide", "Staged disappearance"],
  responsibility: [
    "Tomas alone",
    "Blackwake alone",
    "Shared cover-up",
    "Unknown",
  ],
  motive: [
    "Personal conflict",
    "Safety scandal",
    "Financial panic",
    "Political corruption",
  ],
};

export default async function ReportPage({ params }: ReportPageProps) {
  const { slug } = await params;
  const caseRecord = getCaseBySlug(slug);

  if (!caseRecord) {
    notFound();
  }

  return (
    <CaseShell
      caseSlug={slug}
      title={caseRecord.title}
      tagline="Structured final report aligned with the authored scoring axes."
    >
      <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <article className="rounded-[2rem] border border-white/10 bg-slate-950/35 p-6">
          <p className="text-xs uppercase tracking-[0.32em] text-cyan-100/70">
            Final Report
          </p>
          <div className="mt-6 grid gap-5">
            {Object.entries(answerSets).map(([key, answers]) => (
              <div
                key={key}
                className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5"
              >
                <p className="text-sm uppercase tracking-[0.24em] text-cyan-100/70">
                  {key}
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
            Best-Case Answer
          </p>
          <div className="mt-4 space-y-4 text-sm leading-7 text-stone-200">
            <p>Cause: accidental fall during a coercive confrontation.</p>
            <p>Responsibility: shared cover-up by Pike, Tomas, and Elena.</p>
            <p>Motive: concealment of the turbine safety scandal.</p>
          </div>
        </aside>
      </section>
    </CaseShell>
  );
}
