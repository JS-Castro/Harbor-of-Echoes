import caseFile from "../../data/cases/vale-disappearance/case.json";
import entitiesFile from "../../data/cases/vale-disappearance/entities.json";
import evidenceFile from "../../data/cases/vale-disappearance/evidence.json";
import eventsFile from "../../data/cases/vale-disappearance/events.json";
import locationsFile from "../../data/cases/vale-disappearance/locations.json";
import unlocksFile from "../../data/cases/vale-disappearance/unlocks.json";
import {
  getValeDisappearanceLocale,
  type CaseLocaleCode,
} from "@/lib/case-vale-disappearance.locales";
import type { AppLocale } from "@/lib/i18n";

export type CaseRecord = typeof caseFile;
export type EntityRecord = (typeof entitiesFile)[number];
export type EvidenceRecord = (typeof evidenceFile)[number];
export type EventRecord = (typeof eventsFile)[number];
export type LocationRecord = (typeof locationsFile)[number];
export type UnlockRecord = (typeof unlocksFile)[number];

export type BoardSeedNode = {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: {
    label: string;
    meta: string;
    tone: "entity" | "evidence";
  };
};

export type BoardSeedEdge = {
  id: string;
  source: string;
  target: string;
  label?: string;
};

export type BoardSeed = {
  nodes: BoardSeedNode[];
  edges: BoardSeedEdge[];
};

const caseRecord = caseFile;
const unlocks = unlocksFile;

function getLocalizedCaseContent(locale: AppLocale | CaseLocaleCode = "en") {
  return getValeDisappearanceLocale(locale);
}

export function getCaseBySlug(slug: string, locale: AppLocale | CaseLocaleCode = "en") {
  return caseRecord.slug === slug ? getLocalizedCaseContent(locale).case : null;
}

export function getCaseEntities(slug: string, locale: AppLocale | CaseLocaleCode = "en") {
  return getCaseBySlug(slug, locale)
    ? Object.values(getLocalizedCaseContent(locale).entities)
    : [];
}

export function getCaseEvidence(slug: string, locale: AppLocale | CaseLocaleCode = "en") {
  return getCaseBySlug(slug, locale)
    ? Object.values(getLocalizedCaseContent(locale).evidence)
    : [];
}

export function getCaseEvents(slug: string, locale: AppLocale | CaseLocaleCode = "en") {
  return getCaseBySlug(slug, locale)
    ? Object.values(getLocalizedCaseContent(locale).events)
    : [];
}

export function getCaseLocations(slug: string, locale: AppLocale | CaseLocaleCode = "en") {
  return getCaseBySlug(slug, locale)
    ? Object.values(getLocalizedCaseContent(locale).locations)
    : [];
}

export function getCaseUnlocks(slug: string) {
  return getCaseBySlug(slug) ? unlocks : [];
}

export function getEntityBySlug(
  caseSlug: string,
  entitySlug: string,
  locale: AppLocale | CaseLocaleCode = "en",
) {
  return getCaseEntities(caseSlug, locale).find((item) => item.slug === entitySlug) ?? null;
}

export function getEvidenceBySlug(
  caseSlug: string,
  evidenceSlug: string,
  locale: AppLocale | CaseLocaleCode = "en",
) {
  return getCaseEvidence(caseSlug, locale).find((item) => item.slug === evidenceSlug) ?? null;
}

export function getLocationBySlug(
  caseSlug: string,
  locationSlug: string,
  locale: AppLocale | CaseLocaleCode = "en",
) {
  return getCaseLocations(caseSlug, locale).find((item) => item.slug === locationSlug) ?? null;
}

export function getRelatedEvidence(
  caseSlug: string,
  codes: string[],
  locale: AppLocale | CaseLocaleCode = "en",
) {
  const evidenceMap = new Set(codes);
  return getCaseEvidence(caseSlug, locale).filter((item) => evidenceMap.has(item.code));
}

export function getRelatedEntities(
  caseSlug: string,
  slugs: string[],
  locale: AppLocale | CaseLocaleCode = "en",
) {
  const entityMap = new Set(slugs);
  return getCaseEntities(caseSlug, locale).filter((item) => entityMap.has(item.slug));
}

export function formatCaseDate(
  value: string | null | undefined,
  locale: AppLocale | CaseLocaleCode = "en",
) {
  if (!value) {
    return locale === "pt-PT" ? "Desconhecido" : "Unknown";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
    timeStyle: value.includes("T") ? "short" : undefined,
    timeZone: "UTC",
  }).format(date);
}

export function getBoardSeed(caseSlug: string, locale: AppLocale | CaseLocaleCode = "en") {
  const caseEntities = getCaseEntities(caseSlug, locale).slice(0, 6);
  const caseEvidence = getCaseEvidence(caseSlug, locale).slice(0, 6);

  const entityNodes = caseEntities.map((entity, index) => ({
    id: entity.slug,
    type: "entity",
    position: {
      x: 48 + (index % 2) * 280,
      y: 48 + Math.floor(index / 2) * 132,
    },
    data: {
      label: entity.name,
      meta: entity.role,
      tone: "entity" as const,
    },
  }));

  const evidenceNodes = caseEvidence.map((item, index) => ({
    id: item.code,
    type: "evidence",
    position: {
      x: 660 + (index % 2) * 280,
      y: 48 + Math.floor(index / 2) * 132,
    },
    data: {
      label: item.title,
      meta: item.code,
      tone: "evidence" as const,
    },
  }));

  const evidenceEdges = caseEvidence.flatMap((item) =>
    item.relatedEntitySlugs
      .slice(0, 2)
      .map((entitySlug, index) => {
        const entity = caseEntities.find((candidate) => candidate.slug === entitySlug);

        if (!entity) {
          return null;
        }

        return {
          id: `${entity.slug}-${item.code}-${index}`,
          source: entity.slug,
          target: item.code,
        };
      })
      .filter((edge): edge is NonNullable<typeof edge> => edge !== null),
  );

  return {
    nodes: [...entityNodes, ...evidenceNodes],
    edges: evidenceEdges,
  } satisfies BoardSeed;
}
