"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { loadCaseProgress } from "@/app/actions/case-session";
import type { AppLocale } from "@/lib/i18n";
import { getDictionary } from "@/lib/i18n";
import {
  answerExplanations,
  totalReportAxes,
  type EvidenceCatalogItem,
  type ReportAxis,
  type ReportSubmission,
} from "@/lib/report-logic";

type CaseEndingProps = {
  caseSlug: string;
  locale: AppLocale;
  evidenceCatalog: EvidenceCatalogItem[];
};

export function CaseEnding({ caseSlug, locale, evidenceCatalog }: CaseEndingProps) {
  const dictionary = getDictionary(locale);
  const [submission, setSubmission] = useState<ReportSubmission | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;

    void loadCaseProgress(caseSlug).then((progress) => {
      if (cancelled) {
        return;
      }

      setSubmission(progress.reportSubmission);
      setLoaded(true);
    });

    return () => {
      cancelled = true;
    };
  }, [caseSlug]);

  const submittedAtLabel = submission
    ? new Intl.DateTimeFormat(locale, {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(new Date(submission.submittedAt))
    : null;

  const evidenceByCode = new Map(evidenceCatalog.map((item) => [item.code, item]));

  const verdict = submission
    ? submission.score === 3
      ? dictionary.report.verdictPerfect
      : submission.score === 2
        ? dictionary.report.verdictStrong
        : dictionary.report.verdictWeak
    : null;

  const epilogue = submission
    ? submission.score === 3
      ? dictionary.ending.epiloguePerfect
      : submission.score === 2
        ? dictionary.ending.epilogueStrong
        : dictionary.ending.epilogueWeak
    : null;

  const analysis = submission
    ? (Object.keys(submission.selections) as ReportAxis[]).map((axis) => {
        const answer = submission.selections[axis];
        const answerIndex = dictionary.report.answers[axis].indexOf(answer);
        const explanation = answerExplanations[axis][answerIndex];

        return {
          axis,
          axisLabel: dictionary.report.axes[axis],
          answer,
          summary: explanation?.summary ?? "",
          supportingEvidence: (explanation?.supportingEvidenceCodes ?? [])
            .map((code) => evidenceByCode.get(code))
            .filter((item): item is EvidenceCatalogItem => Boolean(item)),
        };
      })
    : [];

  if (loaded && !submission) {
    return (
      <section className="rounded-[2rem] border border-white/10 bg-slate-950/35 p-8">
        <p className="text-xs uppercase tracking-[0.32em] text-cyan-100/70">
          {dictionary.ending.heading}
        </p>
        <h2 className="mt-4 text-4xl text-white">{dictionary.ending.unavailableTitle}</h2>
        <p className="mt-4 max-w-2xl text-base leading-8 text-slate-300">
          {dictionary.ending.unavailableCopy}
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href={`/case/${caseSlug}/report`}
            className="rounded-full border border-cyan-100/20 bg-cyan-100/10 px-5 py-3 text-sm text-cyan-50 transition hover:border-cyan-100/40 hover:bg-cyan-100/15"
          >
            {dictionary.ending.returnToReport}
          </Link>
          <Link
            href={`/case/${caseSlug}`}
            className="rounded-full border border-white/10 px-5 py-3 text-sm text-slate-200 transition hover:border-white/25 hover:bg-white/5"
          >
            {dictionary.ending.returnToDashboard}
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
      <article className="space-y-6">
        <section className="overflow-hidden rounded-[2rem] border border-cyan-100/15 bg-[radial-gradient(circle_at_top,#335d69_0%,#10202b_48%,#091119_100%)] p-8">
          <p className="text-xs uppercase tracking-[0.32em] text-cyan-100/70">
            {dictionary.ending.heading}
          </p>
          <h2 className="mt-4 max-w-3xl text-4xl text-white sm:text-5xl">
            {dictionary.report.endingTitle}
          </h2>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-200">{verdict}</p>
          <p className="mt-5 max-w-3xl text-base leading-8 text-slate-300">{epilogue}</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <div className="rounded-full border border-cyan-100/20 bg-cyan-100/10 px-4 py-2 text-sm text-cyan-50">
              {submission ? dictionary.report.scoreLabel(submission.score, totalReportAxes) : null}
            </div>
            {submittedAtLabel ? (
              <div className="rounded-full border border-white/10 bg-black/10 px-4 py-2 text-sm text-slate-200">
                {dictionary.report.submittedAt(submittedAtLabel)}
              </div>
            ) : null}
          </div>
        </section>

        <section className="rounded-[2rem] border border-white/10 bg-slate-950/35 p-6">
          <p className="text-xs uppercase tracking-[0.32em] text-cyan-100/70">
            {dictionary.ending.finalTheory}
          </p>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {submission
              ? (Object.keys(submission.selections) as ReportAxis[]).map((axis) => (
                  <div key={axis} className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
                    <p className="text-[11px] uppercase tracking-[0.18em] text-amber-100/60">
                      {dictionary.report.axes[axis]}
                    </p>
                    <p className="mt-2 text-xl text-white">{submission.selections[axis]}</p>
                  </div>
                ))
              : null}
          </div>
        </section>

        <section className="rounded-[2rem] border border-white/10 bg-slate-950/35 p-6">
          <p className="text-xs uppercase tracking-[0.32em] text-cyan-100/70">
            {dictionary.ending.evidenceTrail}
          </p>
          <div className="mt-5 grid gap-4">
            {analysis.map((item) => (
              <div key={item.axis} className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
                <p className="text-[11px] uppercase tracking-[0.18em] text-amber-100/60">
                  {item.axisLabel}
                </p>
                <p className="mt-2 text-xl text-white">{item.answer}</p>
                <p className="mt-3 text-sm leading-7 text-slate-300">{item.summary}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {item.supportingEvidence.map((evidence) => (
                    <Link
                      key={`${item.axis}-${evidence.code}`}
                      href={`/case/${caseSlug}/evidence/${evidence.slug}`}
                      className="rounded-full border border-cyan-100/20 px-3 py-1 text-xs text-cyan-50 transition hover:border-cyan-100/40 hover:bg-cyan-100/10"
                    >
                      {evidence.code}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </article>

      <aside className="rounded-[2rem] border border-amber-100/15 bg-amber-50/5 p-6">
        <p className="text-xs uppercase tracking-[0.32em] text-amber-100/70">
          {dictionary.ending.nextSteps}
        </p>
        <div className="mt-5 space-y-3">
          <Link
            href={`/case/${caseSlug}/report`}
            className="block rounded-[1.25rem] border border-white/10 px-4 py-4 text-slate-200 transition hover:border-white/25 hover:bg-white/5"
          >
            {dictionary.ending.returnToReport}
          </Link>
          <Link
            href={`/case/${caseSlug}/evidence`}
            className="block rounded-[1.25rem] border border-white/10 px-4 py-4 text-slate-200 transition hover:border-white/25 hover:bg-white/5"
          >
            {dictionary.ending.revisitEvidence}
          </Link>
          <Link
            href={`/case/${caseSlug}`}
            className="block rounded-[1.25rem] border border-white/10 px-4 py-4 text-slate-200 transition hover:border-white/25 hover:bg-white/5"
          >
            {dictionary.ending.returnToDashboard}
          </Link>
        </div>
      </aside>
    </section>
  );
}
