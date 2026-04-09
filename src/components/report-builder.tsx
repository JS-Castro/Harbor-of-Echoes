"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { clsx } from "clsx";
import {
  loadCaseProgress,
  resetReportState,
  saveReportSelections,
  submitReport,
} from "@/app/actions/case-session";
import type { AppLocale } from "@/lib/i18n";
import { getDictionary } from "@/lib/i18n";
import {
  answerExplanations,
  totalReportAxes,
  type EvidenceCatalogItem,
  type ReportAxis,
  type ReportSelections,
  type ReportSubmission,
} from "@/lib/report-logic";

type ReportBuilderProps = {
  caseSlug: string;
  locale: AppLocale;
  evidenceCatalog: EvidenceCatalogItem[];
  requiredEvidenceCodes: string[];
};

export function ReportBuilder({
  caseSlug,
  locale,
  evidenceCatalog,
  requiredEvidenceCodes,
}: ReportBuilderProps) {
  const dictionary = getDictionary(locale);
  const [selections, setSelections] = useState<ReportSelections>({});
  const [submission, setSubmission] = useState<ReportSubmission | null>(null);
  const [reviewedEvidenceCodes, setReviewedEvidenceCodes] = useState<string[]>([]);

  useEffect(() => {
    let cancelled = false;

    void loadCaseProgress(caseSlug).then((progress) => {
      if (cancelled) {
        return;
      }

      setSelections(progress.reportSelections);
      setSubmission(progress.reportSubmission);
      setReviewedEvidenceCodes(progress.reviewedEvidenceCodes);
    });

    return () => {
      cancelled = true;
    };
  }, [caseSlug]);

  const reviewedEvidenceSet = useMemo(
    () => new Set(reviewedEvidenceCodes),
    [reviewedEvidenceCodes],
  );

  const evidenceByCode = useMemo(
    () => new Map(evidenceCatalog.map((item) => [item.code, item])),
    [evidenceCatalog],
  );

  const completedAxes = (Object.keys(selections) as ReportAxis[]).filter(
    (axis) => selections[axis],
  ).length;
  const missingRequiredEvidence = requiredEvidenceCodes.filter(
    (code) => !reviewedEvidenceSet.has(code),
  );
  const hasUnlockedFinalReport = missingRequiredEvidence.length === 0;
  const isReadyToSubmit = completedAxes === totalReportAxes && hasUnlockedFinalReport;

  const completionLabel = useMemo(
    () => dictionary.report.completion(completedAxes, totalReportAxes),
    [completedAxes, dictionary.report],
  );

  const archiveProgressLabel = useMemo(
    () =>
      dictionary.report.archiveProgress(reviewedEvidenceCodes.length, requiredEvidenceCodes.length),
    [dictionary.report, requiredEvidenceCodes.length, reviewedEvidenceCodes.length],
  );

  const summaryLines = useMemo(
    () =>
      (Object.keys(dictionary.report.axes) as ReportAxis[]).map((axis) => ({
        axis,
        label: dictionary.report.axes[axis],
        value: selections[axis] ?? dictionary.report.pendingAnswer,
      })),
    [dictionary.report, selections],
  );

  const submittedVerdict = useMemo(() => {
    if (!submission) {
      return null;
    }

    return submission.score === 3
      ? dictionary.report.verdictPerfect
      : submission.score === 2
        ? dictionary.report.verdictStrong
        : dictionary.report.verdictWeak;
  }, [dictionary.report, submission]);

  const submittedAtLabel = useMemo(() => {
    if (!submission) {
      return null;
    }

    return new Intl.DateTimeFormat(locale, {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(submission.submittedAt));
  }, [locale, submission]);

  const submissionAnalysis = useMemo(() => {
    if (!submission) {
      return [];
    }

    return (Object.keys(submission.selections) as ReportAxis[]).map((axis) => {
      const answer = submission.selections[axis];
      const answerIndex = dictionary.report.answers[axis].indexOf(answer);
      const explanation = answerExplanations[axis][answerIndex] ?? {
        summary: "",
        supportingEvidenceCodes: [],
        conflictingEvidenceCodes: [],
      };

      return {
        axis,
        axisLabel: dictionary.report.axes[axis],
        answer,
        summary: explanation.summary,
        supportingEvidence: explanation.supportingEvidenceCodes
          .map((code) => evidenceByCode.get(code))
          .filter((item): item is EvidenceCatalogItem => Boolean(item)),
        conflictingEvidence: explanation.conflictingEvidenceCodes
          .map((code) => evidenceByCode.get(code))
          .filter((item): item is EvidenceCatalogItem => Boolean(item)),
      };
    });
  }, [dictionary.report, evidenceByCode, submission]);

  function handleSelect(axis: ReportAxis, answer: string) {
    const nextSelections = {
      ...selections,
      [axis]: selections[axis] === answer ? undefined : answer,
    };

    setSelections(nextSelections);
    setSubmission(null);
    void saveReportSelections(caseSlug, nextSelections);
  }

  function handleReset() {
    setSelections({});
    setSubmission(null);
    void resetReportState(caseSlug);
  }

  async function handleSubmit() {
    if (!isReadyToSubmit) {
      return;
    }

    try {
      setSubmission(await submitReport(caseSlug, locale, selections));
    } catch {
      return;
    }
  }

  return (
    <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
      <article className="rounded-[2rem] border border-white/10 bg-slate-950/35 p-6">
        <div className="flex flex-col gap-4 border-b border-white/10 pb-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.32em] text-cyan-100/70">
                {dictionary.report.heading}
              </p>
              <p className="mt-3 text-sm leading-7 text-slate-300">
                {dictionary.report.instructions}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <p className="text-xs uppercase tracking-[0.22em] text-amber-100/70">
                {completionLabel}
              </p>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!isReadyToSubmit}
                className={clsx(
                  "rounded-full px-4 py-2 text-xs uppercase tracking-[0.18em] transition",
                  isReadyToSubmit
                    ? "border border-cyan-100/25 bg-cyan-100/10 text-cyan-50 hover:border-cyan-100/45 hover:bg-cyan-100/15"
                    : "border border-white/10 text-slate-500",
                )}
              >
                {dictionary.report.submit}
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="rounded-full border border-white/10 px-4 py-2 text-xs uppercase tracking-[0.18em] text-slate-200 transition hover:border-white/25 hover:bg-white/5"
              >
                {dictionary.report.reset}
              </button>
            </div>
          </div>

          <div className="rounded-[1.5rem] border border-amber-100/10 bg-black/10 p-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs uppercase tracking-[0.24em] text-amber-100/70">
                {dictionary.report.finalReportUnlock}
              </p>
              <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                {archiveProgressLabel}
              </p>
            </div>
            <p className="mt-3 text-sm leading-7 text-slate-300">
              {hasUnlockedFinalReport
                ? dictionary.report.unlockReady
                : dictionary.report.unlockBlocked(missingRequiredEvidence.length)}
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-5">
          {(Object.keys(dictionary.report.answers) as ReportAxis[]).map((axis) => (
            <div key={axis} className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm uppercase tracking-[0.24em] text-cyan-100/70">
                  {dictionary.report.axes[axis]}
                </p>
                <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                  {selections[axis]
                    ? dictionary.report.axisLocked
                    : dictionary.report.axisPending}
                </p>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {dictionary.report.answers[axis].map((answer) => {
                  const isSelected = selections[axis] === answer;

                  return (
                    <button
                      key={answer}
                      type="button"
                      onClick={() => handleSelect(axis, answer)}
                      aria-pressed={isSelected}
                      className={clsx(
                        "rounded-[1rem] border px-4 py-3 text-left text-sm transition",
                        isSelected
                          ? "border-cyan-100/35 bg-cyan-100/10 text-white"
                          : "border-white/10 text-slate-200 hover:border-white/25 hover:bg-white/5",
                      )}
                    >
                      {answer}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {submission ? (
          <div className="mt-6 space-y-5">
            <div className="overflow-hidden rounded-[1.75rem] border border-cyan-100/15 bg-[radial-gradient(circle_at_top,#2a5461_0%,#0e1a24_48%,#091119_100%)] p-6">
              <p className="text-xs uppercase tracking-[0.28em] text-cyan-100/70">
                {dictionary.report.caseClosed}
              </p>
              <h3 className="mt-3 max-w-2xl text-3xl text-white sm:text-4xl">
                {dictionary.report.endingTitle}
              </h3>
              <p className="mt-4 max-w-3xl text-base leading-8 text-slate-200">
                {submittedVerdict}
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href={`/case/${caseSlug}/ending`}
                  className="rounded-full border border-cyan-100/20 bg-cyan-100/10 px-4 py-2 text-sm text-cyan-50 transition hover:border-cyan-100/40 hover:bg-cyan-100/15"
                >
                  {dictionary.report.viewEnding}
                </Link>
                <div className="rounded-full border border-cyan-100/20 bg-cyan-100/10 px-4 py-2 text-sm text-cyan-50">
                  {dictionary.report.scoreLabel(submission.score, totalReportAxes)}
                </div>
                {submittedAtLabel ? (
                  <div className="rounded-full border border-white/10 bg-black/10 px-4 py-2 text-sm text-slate-200">
                    {dictionary.report.submittedAt(submittedAtLabel)}
                  </div>
                ) : null}
              </div>
            </div>

            <div className="rounded-[1.5rem] border border-white/10 bg-black/10 p-5">
            <p className="text-xs uppercase tracking-[0.24em] text-cyan-100/70">
              {dictionary.report.evidenceReview}
            </p>
            <div className="mt-4 grid gap-4">
              {submissionAnalysis.map((item) => (
                <div key={item.axis} className="rounded-[1.25rem] border border-white/10 bg-white/5 p-4">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-amber-100/60">
                    {item.axisLabel}
                  </p>
                  <p className="mt-1 text-lg text-white">{item.answer}</p>
                  <p className="mt-3 text-sm leading-7 text-slate-300">{item.summary}</p>
                  {item.supportingEvidence.length > 0 ? (
                    <div className="mt-4">
                      <p className="text-[11px] uppercase tracking-[0.18em] text-cyan-100/70">
                        {dictionary.report.supportingEvidence}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {item.supportingEvidence.map((evidence) => (
                          <Link
                            key={`${item.axis}-${evidence.code}-support`}
                            href={`/case/${caseSlug}/evidence/${evidence.slug}`}
                            className="rounded-full border border-cyan-100/20 px-3 py-1 text-xs text-cyan-50 transition hover:border-cyan-100/40 hover:bg-cyan-100/10"
                          >
                            {evidence.code}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ) : null}
                  {item.conflictingEvidence.length > 0 ? (
                    <div className="mt-4">
                      <p className="text-[11px] uppercase tracking-[0.18em] text-amber-100/70">
                        {dictionary.report.conflictingEvidence}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {item.conflictingEvidence.map((evidence) => (
                          <Link
                            key={`${item.axis}-${evidence.code}-conflict`}
                            href={`/case/${caseSlug}/evidence/${evidence.slug}`}
                            className="rounded-full border border-amber-100/20 px-3 py-1 text-xs text-amber-50 transition hover:border-amber-100/40 hover:bg-amber-100/10"
                          >
                            {evidence.code}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
          </div>
        ) : null}
      </article>

      <aside className="rounded-[2rem] border border-amber-100/15 bg-amber-50/5 p-6">
        {submission ? (
          <div className="mb-6 rounded-[1.5rem] border border-cyan-100/20 bg-cyan-100/8 p-4">
            <p className="text-xs uppercase tracking-[0.24em] text-cyan-100/70">
              {dictionary.report.caseClosed}
            </p>
            <p className="mt-2 text-lg text-white">{dictionary.report.endingSummary}</p>
            <p className="mt-3 text-sm leading-7 text-slate-300">
              {dictionary.report.scoreLabel(submission.score, totalReportAxes)}
            </p>
          </div>
        ) : null}
        <p className="text-xs uppercase tracking-[0.32em] text-amber-100/70">
          {dictionary.report.currentTheory}
        </p>
        <div className="mt-4 space-y-4 text-sm leading-7 text-stone-200">
          {summaryLines.map((line) => (
            <div key={line.axis}>
              <p className="text-[11px] uppercase tracking-[0.18em] text-amber-100/60">
                {line.label}
              </p>
              <p className="mt-1">{line.value}</p>
            </div>
          ))}
        </div>

        {!hasUnlockedFinalReport && missingRequiredEvidence.length > 0 ? (
          <div className="mt-8 rounded-[1.5rem] border border-white/10 bg-black/10 p-4">
            <p className="text-xs uppercase tracking-[0.24em] text-slate-300">
              {dictionary.report.stillMissing}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {missingRequiredEvidence.slice(0, 10).map((code) => (
                <span
                  key={code}
                  className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-300"
                >
                  {code}
                </span>
              ))}
              {missingRequiredEvidence.length > 10 ? (
                <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-300">
                  {dictionary.report.moreEvidence(missingRequiredEvidence.length - 10)}
                </span>
              ) : null}
            </div>
          </div>
        ) : null}

        <div className="mt-8 rounded-[1.5rem] border border-white/10 bg-black/10 p-4">
          <p className="text-xs uppercase tracking-[0.24em] text-slate-300">
            {dictionary.report.bestCaseAnswer}
          </p>
          <div className="mt-3 space-y-3 text-sm leading-7 text-slate-200">
            <p>{dictionary.report.bestCase.cause}</p>
            <p>{dictionary.report.bestCase.responsibility}</p>
            <p>{dictionary.report.bestCase.motive}</p>
          </div>
        </div>
      </aside>
    </section>
  );
}
