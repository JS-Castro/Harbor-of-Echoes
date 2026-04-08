import caseFile from "../../data/cases/vale-disappearance/case.json";
import entitiesFile from "../../data/cases/vale-disappearance/entities.json";
import evidenceFile from "../../data/cases/vale-disappearance/evidence.json";
import eventsFile from "../../data/cases/vale-disappearance/events.json";
import locationsFile from "../../data/cases/vale-disappearance/locations.json";
import unlocksFile from "../../data/cases/vale-disappearance/unlocks.json";

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
const entities = entitiesFile;
const evidence = evidenceFile;
const events = eventsFile;
const locations = locationsFile;
const unlocks = unlocksFile;

export function getCaseBySlug(slug: string) {
  return caseRecord.slug === slug ? caseRecord : null;
}

export function getCaseEntities(slug: string) {
  return getCaseBySlug(slug) ? entities : [];
}

export function getCaseEvidence(slug: string) {
  return getCaseBySlug(slug) ? evidence : [];
}

export function getCaseEvents(slug: string) {
  return getCaseBySlug(slug) ? events : [];
}

export function getCaseLocations(slug: string) {
  return getCaseBySlug(slug) ? locations : [];
}

export function getCaseUnlocks(slug: string) {
  return getCaseBySlug(slug) ? unlocks : [];
}

export function getEntityBySlug(caseSlug: string, entitySlug: string) {
  return getCaseEntities(caseSlug).find((item) => item.slug === entitySlug) ?? null;
}

export function getEvidenceBySlug(caseSlug: string, evidenceSlug: string) {
  return getCaseEvidence(caseSlug).find((item) => item.slug === evidenceSlug) ?? null;
}

export function getLocationBySlug(caseSlug: string, locationSlug: string) {
  return getCaseLocations(caseSlug).find((item) => item.slug === locationSlug) ?? null;
}

export function getRelatedEvidence(caseSlug: string, codes: string[]) {
  const evidenceMap = new Set(codes);
  return getCaseEvidence(caseSlug).filter((item) => evidenceMap.has(item.code));
}

export function getRelatedEntities(caseSlug: string, slugs: string[]) {
  const entityMap = new Set(slugs);
  return getCaseEntities(caseSlug).filter((item) => entityMap.has(item.slug));
}

export function formatCaseDate(value: string | null | undefined) {
  if (!value) {
    return "Unknown";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: value.includes("T") ? "short" : undefined,
    timeZone: "UTC",
  }).format(date);
}

export function getBoardSeed(caseSlug: string) {
  const caseEntities = getCaseEntities(caseSlug).slice(0, 6);
  const caseEvidence = getCaseEvidence(caseSlug).slice(0, 6);

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
          label: index === 0 ? "linked" : undefined,
        };
      })
      .filter((edge): edge is NonNullable<typeof edge> => edge !== null),
  );

  return {
    nodes: [...entityNodes, ...evidenceNodes],
    edges: evidenceEdges,
  } satisfies BoardSeed;
}
