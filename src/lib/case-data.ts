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
