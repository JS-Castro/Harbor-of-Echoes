"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { loadCaseProgress } from "@/app/actions/case-session";
import type { AppLocale } from "@/lib/i18n";
import { getDictionary } from "@/lib/i18n";
import type { ReportSubmission } from "@/lib/report-logic";

type DashboardReportProgressProps = {
  caseSlug: string;
  locale: AppLocale;
  requiredEvidenceCodes: string[];
};

export function DashboardReportProgress({
  caseSlug,
  locale,
  requiredEvidenceCodes,
}: DashboardReportProgressProps) {
  const dictionary = getDictionary(locale);
  const [reviewedEvidenceCodes, setReviewedEvidenceCodes] = useState<string[]>([]);
  const [submission, setSubmission] = useState<ReportSubmission | null>(null);

  useEffect(() => {
    let cancelled = false;

    void loadCaseProgress(caseSlug).then((progress) => {
      if (cancelled) {
        return;
      }

      setReviewedEvidenceCodes(progress.reviewedEvidenceCodes);
      setSubmission(progress.reportSubmission);
    });

    return () => {
      cancelled = true;
    };
  }, [caseSlug]);

  const reviewedEvidenceSet = useMemo(
    () => new Set(reviewedEvidenceCodes),
    [reviewedEvidenceCodes],
  );
  const reviewedRequiredCount = requiredEvidenceCodes.filter((code) =>
    reviewedEvidenceSet.has(code),
  ).length;
  const totalRequired = requiredEvidenceCodes.length;
  const isUnlocked = reviewedRequiredCount === totalRequired;

  return (
    <section className="rounded-[2rem] border border-cyan-100/12 bg-slate-950/35 p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.32em] text-cyan-100/70">
            {dictionary.dashboard.reportStatus}
          </p>
          <h2 className="mt-3 text-3xl text-white">{dictionary.nav.report}</h2>
        </div>
        <div className="flex flex-wrap gap-3">
          {submission ? (
            <Link
              href={`/case/${caseSlug}/ending`}
              className="rounded-full border border-cyan-100/20 bg-cyan-100/10 px-4 py-2 text-sm text-cyan-50 transition hover:border-cyan-100/40 hover:bg-cyan-100/15"
            >
              {dictionary.dashboard.openEnding}
            </Link>
          ) : null}
          <Link
            href={`/case/${caseSlug}/report`}
            className="rounded-full border border-white/10 px-4 py-2 text-sm text-slate-200 transition hover:border-white/30 hover:bg-white/5"
          >
            {dictionary.dashboard.openReport}
          </Link>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
          <p className="text-[11px] uppercase tracking-[0.18em] text-cyan-100/60">
            {dictionary.dashboard.archiveReview}
          </p>
          <p className="mt-3 text-3xl text-white">
            {reviewedRequiredCount}/{totalRequired}
          </p>
          <p className="mt-2 text-sm leading-7 text-slate-300">
            {isUnlocked
              ? dictionary.dashboard.reportUnlocked
              : dictionary.dashboard.reportLocked(totalRequired - reviewedRequiredCount)}
          </p>
        </div>

        <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
          <p className="text-[11px] uppercase tracking-[0.18em] text-amber-100/60">
            {dictionary.dashboard.caseStatus}
          </p>
          <p className="mt-3 text-3xl text-white">
            {submission ? dictionary.dashboard.caseClosed : dictionary.dashboard.caseOpen}
          </p>
          <p className="mt-2 text-sm leading-7 text-slate-300">
            {submission
              ? dictionary.dashboard.reportScore(submission.score, 3)
              : dictionary.dashboard.caseStillOpen}
          </p>
        </div>
      </div>
    </section>
  );
}
