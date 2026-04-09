"use server";

import { db } from "@/lib/db";
import {
  deserializeBoardSnapshot,
  serializeBoardNode,
} from "@/lib/board-session";
import { getCaseUnlocksRuntime } from "@/lib/case-data";
import {
  getOrCreateCaseSession,
  getPersistedCaseProgress,
} from "@/lib/case-session-server";
import {
  bestCaseAnswerIndexes,
  reportDraftHypothesisTitle,
  type ReportAxis,
  type ReportSelections,
  type ReportSubmission,
} from "@/lib/report-logic";
import type { BoardSnapshot } from "@/stores/board-store";
import { getDictionary, normalizeLocale } from "@/lib/i18n";

async function getRequiredEvidenceCodes(caseSlug: string) {
  const reportUnlock = (await getCaseUnlocksRuntime(caseSlug)).find(
    (unlock) => unlock.targetType === "report" && unlock.targetCode === "final-report",
  );
  const ruleConfig =
    typeof reportUnlock?.ruleConfig === "object" && reportUnlock.ruleConfig
      ? (reportUnlock.ruleConfig as { requiredEvidenceCodes?: unknown })
      : {};

  return Array.isArray(ruleConfig.requiredEvidenceCodes)
    ? ruleConfig.requiredEvidenceCodes.filter((code): code is string => typeof code === "string")
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

export async function loadBoardSnapshot(caseSlug: string): Promise<BoardSnapshot | null> {
  const session = await getOrCreateCaseSession(caseSlug);

  const boardNodes = await db.boardNode.findMany({
    where: { sessionId: session.id },
    orderBy: { createdAt: "asc" },
    select: {
      nodeRefId: true,
      nodeType: true,
      posX: true,
      posY: true,
      note: true,
    },
  });

  if (boardNodes.length === 0) {
    return null;
  }

  const boardEdges = await db.boardEdge.findMany({
    where: { sessionId: session.id },
    include: {
      fromNode: { select: { nodeRefId: true } },
      toNode: { select: { nodeRefId: true } },
    },
    orderBy: { createdAt: "asc" },
  });

  return deserializeBoardSnapshot(boardNodes, boardEdges);
}

export async function saveBoardSnapshot(caseSlug: string, snapshot: BoardSnapshot) {
  const session = await getOrCreateCaseSession(caseSlug);

  await db.$transaction(async (tx) => {
    await tx.boardEdge.deleteMany({
      where: { sessionId: session.id },
    });

    await tx.boardNode.deleteMany({
      where: { sessionId: session.id },
    });

    const createdNodes = new Map<string, string>();

    for (const node of snapshot.nodes) {
      const createdNode = await tx.boardNode.create({
        data: {
          sessionId: session.id,
          nodeType:
            node.type === "entity"
              ? "ENTITY"
              : node.type === "evidence"
                ? "EVIDENCE"
                : "HYPOTHESIS",
          nodeRefId: node.id,
          posX: node.position.x,
          posY: node.position.y,
          note: serializeBoardNode(node),
        },
        select: { id: true },
      });

      createdNodes.set(node.id, createdNode.id);
    }

    for (const edge of snapshot.edges) {
      const fromNodeId = createdNodes.get(edge.source);
      const toNodeId = createdNodes.get(edge.target);

      if (!fromNodeId || !toNodeId) {
        continue;
      }

      await tx.boardEdge.create({
        data: {
          sessionId: session.id,
          fromNodeId,
          toNodeId,
          label: edge.label,
        },
      });
    }
  });
}

export async function saveReportSelections(caseSlug: string, selections: ReportSelections) {
  const session = await getOrCreateCaseSession(caseSlug);

  const serializedSelections = JSON.stringify(selections);
  const existingDraft = await db.hypothesis.findFirst({
    where: {
      sessionId: session.id,
      title: reportDraftHypothesisTitle,
    },
    select: { id: true },
  });

  if (existingDraft) {
    await db.hypothesis.update({
      where: { id: existingDraft.id },
      data: {
        claim: serializedSelections,
        status: "DRAFT",
      },
    });
  } else {
    await db.hypothesis.create({
      data: {
        sessionId: session.id,
        title: reportDraftHypothesisTitle,
        claim: serializedSelections,
        status: "DRAFT",
      },
    });
  }

  return selections;
}

export async function resetReportState(caseSlug: string) {
  const session = await getOrCreateCaseSession(caseSlug);

  await db.$transaction([
    db.reportSubmission.deleteMany({
      where: { sessionId: session.id },
    }),
    db.hypothesis.deleteMany({
      where: {
        sessionId: session.id,
        title: reportDraftHypothesisTitle,
      },
    }),
  ]);

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
  const requiredEvidenceCodes = await getRequiredEvidenceCodes(caseSlug);
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

  await db.hypothesis.deleteMany({
    where: {
      sessionId: session.id,
      title: reportDraftHypothesisTitle,
    },
  });

  return {
    score: reportSubmission.score,
    submittedAt: reportSubmission.submittedAt.toISOString(),
    selections,
  };
}
