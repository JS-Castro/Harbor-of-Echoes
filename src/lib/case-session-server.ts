import { randomUUID } from "crypto";
import { cookies } from "next/headers";
import { db } from "@/lib/db";
import type { ReportSelections, ReportSubmission } from "@/lib/report-logic";

const caseSessionCookieName = "hoe-case-session";

type PersistedCaseProgress = {
  reviewedEvidenceCodes: string[];
  reportSelections: ReportSelections;
  reportSubmission: ReportSubmission | null;
};

function getCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  };
}

function mapStoredSubmission(
  submission:
    | {
        causeAnswer: string;
        responsibilityAnswer: string;
        motiveAnswer: string;
        score: number;
        submittedAt: Date;
      }
    | null
    | undefined,
): ReportSubmission | null {
  if (!submission) {
    return null;
  }

  return {
    score: submission.score,
    submittedAt: submission.submittedAt.toISOString(),
    selections: {
      cause: submission.causeAnswer,
      responsibility: submission.responsibilityAnswer,
      motive: submission.motiveAnswer,
    },
  };
}

async function readSessionKey() {
  try {
    const cookieStore = await cookies();
    return cookieStore.get(caseSessionCookieName)?.value ?? null;
  } catch {
    return null;
  }
}

async function ensureSessionKey() {
  const cookieStore = await cookies();
  let sessionKey = cookieStore.get(caseSessionCookieName)?.value;

  if (!sessionKey) {
    sessionKey = randomUUID();
    cookieStore.set(caseSessionCookieName, sessionKey, getCookieOptions());
  }

  return sessionKey;
}

export async function getPersistedCaseProgress(caseSlug: string): Promise<PersistedCaseProgress> {
  const sessionKey = await readSessionKey();

  if (!sessionKey) {
    return {
      reviewedEvidenceCodes: [],
      reportSelections: {},
      reportSubmission: null,
    };
  }

  try {
    const session = await db.session.findFirst({
      where: {
        playerLabel: sessionKey,
        case: { slug: caseSlug },
      },
      include: {
        evidenceEntries: {
          where: { isRead: true },
          include: { evidence: true },
        },
        reportSubmission: true,
      },
    });

    if (!session) {
      return {
        reviewedEvidenceCodes: [],
        reportSelections: {},
        reportSubmission: null,
      };
    }

    return {
      reviewedEvidenceCodes: session.evidenceEntries.map((entry) => entry.evidence.code).sort(),
      reportSelections: {},
      reportSubmission: mapStoredSubmission(session.reportSubmission),
    };
  } catch {
    return {
      reviewedEvidenceCodes: [],
      reportSelections: {},
      reportSubmission: null,
    };
  }
}

export async function getOrCreateCaseSession(caseSlug: string) {
  const sessionKey = await ensureSessionKey();
  const caseRecord = await db.case.findUnique({
    where: { slug: caseSlug },
    select: { id: true },
  });

  if (!caseRecord) {
    throw new Error(`Unknown case slug: ${caseSlug}`);
  }

  const existingSession = await db.session.findFirst({
    where: {
      caseId: caseRecord.id,
      playerLabel: sessionKey,
    },
    include: {
      evidenceEntries: {
        where: { isRead: true },
        include: { evidence: true },
      },
      reportSubmission: true,
    },
  });

  if (existingSession) {
    return existingSession;
  }

  return db.session.create({
    data: {
      caseId: caseRecord.id,
      playerLabel: sessionKey,
      status: "ACTIVE",
    },
    include: {
      evidenceEntries: {
        where: { isRead: true },
        include: { evidence: true },
      },
      reportSubmission: true,
    },
  });
}
