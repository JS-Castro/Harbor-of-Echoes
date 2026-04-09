export type ReportAxis = "cause" | "responsibility" | "motive";

export type ReportSelections = Partial<Record<ReportAxis, string>>;

export type ReportSubmission = {
  score: number;
  submittedAt: string;
  selections: Record<ReportAxis, string>;
};

export type EvidenceCatalogItem = {
  code: string;
  slug: string;
  title: string;
};

export type AxisExplanation = {
  summary: string;
  supportingEvidenceCodes: string[];
  conflictingEvidenceCodes: string[];
};

export const reportDraftHypothesisTitle = "__report_draft__";
export const totalReportAxes = 3;

export const bestCaseAnswerIndexes: Record<ReportAxis, number> = {
  cause: 0,
  responsibility: 2,
  motive: 1,
};

export const answerExplanations: Record<ReportAxis, AxisExplanation[]> = {
  cause: [
    {
      summary:
        "The strongest read is a fall during the confrontation, with the cover-up happening afterwards rather than the death being pre-planned.",
      supportingEvidenceCodes: ["EV-016", "EV-017", "EV-012"],
      conflictingEvidenceCodes: ["EV-004"],
    },
    {
      summary:
        "A murder reading fits the hostile confrontation, but the scene evidence points more strongly to a sudden fall than a deliberate killing method.",
      supportingEvidenceCodes: ["EV-016", "EV-012", "EV-013"],
      conflictingEvidenceCodes: ["EV-017"],
    },
    {
      summary:
        "The case does not support suicide. Mara was actively protecting material, preparing publication, and setting up contingency plans.",
      supportingEvidenceCodes: ["EV-018"],
      conflictingEvidenceCodes: ["EV-005", "EV-019", "EV-016"],
    },
    {
      summary:
        "Mara anticipated interference and built a dead-drop, but the audio and forensic scene argue against a voluntary disappearance.",
      supportingEvidenceCodes: ["EV-018", "EV-019"],
      conflictingEvidenceCodes: ["EV-016", "EV-017"],
    },
  ],
  responsibility: [
    {
      summary:
        "Tomas is clearly present in the confrontation, but the altered records and institutional omissions show a wider cover-up.",
      supportingEvidenceCodes: ["EV-003", "EV-016"],
      conflictingEvidenceCodes: ["EV-011", "EV-013", "EV-020"],
    },
    {
      summary:
        "Blackwake has motive and incriminating records, but the evidence also ties named local actors to the night and the later suppression.",
      supportingEvidenceCodes: ["EV-007", "EV-009", "EV-019"],
      conflictingEvidenceCodes: ["EV-010", "EV-011", "EV-020"],
    },
    {
      summary:
        "The archive points to a shared cover-up: corporate motive, local coordination on the night, and police suppression after the fact.",
      supportingEvidenceCodes: ["EV-011", "EV-013", "EV-014", "EV-020"],
      conflictingEvidenceCodes: [],
    },
    {
      summary:
        "There are gaps, but the remaining record is specific enough to move past an unknown-responsibility verdict.",
      supportingEvidenceCodes: ["EV-004"],
      conflictingEvidenceCodes: ["EV-010", "EV-011", "EV-020"],
    },
  ],
  motive: [
    {
      summary:
        "Personal tension exists, but the broader case file keeps pointing back to operational secrecy and suppression of records.",
      supportingEvidenceCodes: ["EV-003", "EV-012"],
      conflictingEvidenceCodes: ["EV-007", "EV-009", "EV-015"],
    },
    {
      summary:
        "This is the strongest motive. Mara had material tying Blackwake's false reporting to an actionable safety scandal.",
      supportingEvidenceCodes: ["EV-001", "EV-006", "EV-009", "EV-015"],
      conflictingEvidenceCodes: [],
    },
    {
      summary:
        "Financial panic may be adjacent to the case, but the authored record is much more explicit about safety concealment than liquidity pressure.",
      supportingEvidenceCodes: ["EV-008"],
      conflictingEvidenceCodes: ["EV-006", "EV-009", "EV-020"],
    },
    {
      summary:
        "There is institutional pressure, but the evidence trail still centers on the turbine safety record rather than a political bribery plot.",
      supportingEvidenceCodes: ["EV-020"],
      conflictingEvidenceCodes: ["EV-001", "EV-009", "EV-015"],
    },
  ],
};

export function parseStoredStringArray(value: string | null) {
  if (!value) {
    return [];
  }

  const parsed = JSON.parse(value);
  return Array.isArray(parsed)
    ? parsed.filter((item): item is string => typeof item === "string")
    : [];
}

export function parseReportSelections(value: string | null | undefined): ReportSelections {
  if (!value) {
    return {};
  }

  try {
    const parsed = JSON.parse(value) as ReportSelections;
    return typeof parsed === "object" && parsed ? parsed : {};
  } catch {
    return {};
  }
}
