"use client";

import { useEffect, useMemo, useState } from "react";
import { clsx } from "clsx";
import type { AppLocale } from "@/lib/i18n";
import { getDictionary } from "@/lib/i18n";

type ReportBuilderProps = {
  caseSlug: string;
  locale: AppLocale;
};

type ReportAxis = "cause" | "responsibility" | "motive";

type ReportSelections = Partial<Record<ReportAxis, string>>;

const reportStorageKeyPrefix = "harbor-of-echoes-report";

function getReportStorageKey(caseSlug: string) {
  return `${reportStorageKeyPrefix}:${caseSlug}`;
}

export function ReportBuilder({ caseSlug, locale }: ReportBuilderProps) {
  const dictionary = getDictionary(locale);
  const [selections, setSelections] = useState<ReportSelections>(() => {
    if (typeof window === "undefined") {
      return {};
    }

    const storedValue = window.localStorage.getItem(getReportStorageKey(caseSlug));

    if (!storedValue) {
      return {};
    }

    try {
      return JSON.parse(storedValue) as ReportSelections;
    } catch {
      window.localStorage.removeItem(getReportStorageKey(caseSlug));
      return {};
    }
  });

  useEffect(() => {
    window.localStorage.setItem(getReportStorageKey(caseSlug), JSON.stringify(selections));
  }, [caseSlug, selections]);

  const completedAxes = (Object.keys(selections) as ReportAxis[]).filter(
    (axis) => selections[axis],
  ).length;

  const completionLabel = useMemo(
    () => dictionary.report.completion(completedAxes, 3),
    [completedAxes, dictionary.report],
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

  function handleSelect(axis: ReportAxis, answer: string) {
    setSelections((current) => ({
      ...current,
      [axis]: current[axis] === answer ? undefined : answer,
    }));
  }

  function handleReset() {
    setSelections({});
  }

  return (
    <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
      <article className="rounded-[2rem] border border-white/10 bg-slate-950/35 p-6">
        <div className="flex flex-col gap-4 border-b border-white/10 pb-5 sm:flex-row sm:items-end sm:justify-between">
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
              onClick={handleReset}
              className="rounded-full border border-white/10 px-4 py-2 text-xs uppercase tracking-[0.18em] text-slate-200 transition hover:border-white/25 hover:bg-white/5"
            >
              {dictionary.report.reset}
            </button>
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
      </article>

      <aside className="rounded-[2rem] border border-amber-100/15 bg-amber-50/5 p-6">
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
