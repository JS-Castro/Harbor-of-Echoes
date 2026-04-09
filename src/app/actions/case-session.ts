"use server";

import { db } from "@/lib/db";
import { getCaseUnlocks } from "@/lib/case-data";
import {
  getOrCreateCaseSession,
  getPersistedCaseProgress,
} from "@/lib/case-session-server";
import {
  bestCaseAnswerIndexes,
  type ReportAxis,
  type ReportSelections,
  type ReportSubmission,
} from "@/lib/report-logic";
import { getDictionary, normalizeLocale } from "@/lib/i18n";

function getRequiredEvidenceCodes(caseSlug: string) {
  const reportUnlock = getCaseUnlocks(caseSlug).find(
    (unlock) => unlock.targetType === "report" && unlock.targetCode === "final-report",
  );

  return Array.isArray(reportUnlock?.ruleConfig?.requiredEvidenceCodes)
    ? reportUnlock.ruleConfig.requiredEvidenceCodes
    : [];
}

function isCompleteSelection(selections: ReportSelections): selections is Record<ReportAxis, string> {
  return Boolean(selections.cause && selections.responsibility && selections.motive);
}

export async function markEvidenceViewed(caseSlug: string, evidenceCode: string) {
  const session = await getOrCreateCaseSession(caseSlug);
  const evidence = await db.evidence.findFirst({
    where: {
      code: evidenceCode,
      case: { slug: caseSlug },
    },
    select: { id: true, code: true },
  });

  if (!evidence) {
    throw new Error("Evidence not found");
  }

  await db.sessionEvidence.upsert({
    where: {
      sessionId_evidenceId: {
        sessionId: session.id,
        evidenceId: evidence.id,
      },
    },
    update: {
      isRead: true,
    },
    create: {
      sessionId: session.id,
      evidenceId: evidence.id,
      isRead: true,
    },
  });

  return [
    ...new Set([...session.evidenceEntries.map((entry) => entry.evidence.code), evidence.code]),
  ].sort();
}

export async function loadCaseProgress(caseSlug: string) {
  return getPersistedCaseProgress(caseSlug);
}

export async function saveReportSelections(caseSlug: string, selections: ReportSelections) {
  await getOrCreateCaseSession(caseSlug);
  return selections;
}

export async function resetReportState(caseSlug: string) {
  const session = await getOrCreateCaseSession(caseSlug);

  await db.reportSubmission.deleteMany({
    where: { sessionId: session.id },
  });

  return { selections: {}, submission: null };
}

export async function submitReport(
  caseSlug: string,
  locale: string,
  selections: ReportSelections,
): Promise<ReportSubmission> {
  const session = await getOrCreateCaseSession(caseSlug);

  if (!isCompleteSelection(selections)) {
    throw new Error("Incomplete report selections");
  }

  const reviewedEvidenceCodes = new Set(session.evidenceEntries.map((entry) => entry.evidence.code));
  const requiredEvidenceCodes = getRequiredEvidenceCodes(caseSlug);
  const hasUnlockedFinalReport = requiredEvidenceCodes.every((code) => reviewedEvidenceCodes.has(code));

  if (!hasUnlockedFinalReport) {
    throw new Error("Final report is still locked");
  }

  const dictionary = getDictionary(normalizeLocale(locale));
  const score = (Object.keys(bestCaseAnswerIndexes) as ReportAxis[]).filter(
    (axis) => selections[axis] === dictionary.report.answers[axis][bestCaseAnswerIndexes[axis]],
  ).length;
  const endingType = score === 3 ? "perfect" : score === 2 ? "strong" : "weak";

  const reportSubmission = await db.reportSubmission.upsert({
    where: { sessionId: session.id },
    update: {
      causeAnswer: selections.cause,
      responsibilityAnswer: selections.responsibility,
      motiveAnswer: selections.motive,
      score,
      endingType,
    },
    create: {
      sessionId: session.id,
      causeAnswer: selections.cause,
      responsibilityAnswer: selections.responsibility,
      motiveAnswer: selections.motive,
      score,
      endingType,
    },
  });

  await db.session.update({
    where: { id: session.id },
    data: {
      status: "COMPLETED",
    },
  });

  return {
    score: reportSubmission.score,
    submittedAt: reportSubmission.submittedAt.toISOString(),
    selections,
  };
}
