import { PrismaClient } from "@prisma/client";
import caseFile from "../data/cases/vale-disappearance/case.json";
import entitiesFile from "../data/cases/vale-disappearance/entities.json";
import eventsFile from "../data/cases/vale-disappearance/events.json";
import evidenceFile from "../data/cases/vale-disappearance/evidence.json";
import locationsFile from "../data/cases/vale-disappearance/locations.json";
import unlocksFile from "../data/cases/vale-disappearance/unlocks.json";

const prisma = new PrismaClient();

const caseStatusMap = {
  draft: "DRAFT",
  published: "PUBLISHED",
  archived: "ARCHIVED",
} as const;

const entityTypeMap = {
  person: "PERSON",
  organization: "ORGANIZATION",
  location: "LOCATION",
  object: "OBJECT",
} as const;

const evidenceTypeMap = {
  note: "NOTE",
  photo: "PHOTO",
  message: "MESSAGE",
  report: "REPORT",
  transcript: "TRANSCRIPT",
  audio: "AUDIO",
  log: "LOG",
} as const;

const confidenceMap = {
  low: "LOW",
  medium: "MEDIUM",
  high: "HIGH",
} as const;

const timePrecisionMap = {
  minute: "EXACT",
  day: "DATE_ONLY",
  approximate: "APPROXIMATE",
} as const;

const certaintyMap = {
  low: "DISPUTED",
  medium: "PLAUSIBLE",
  high: "CONFIRMED",
} as const;

const unlockRuleTypeMap = {
  available_from_start: "VIEW_EVIDENCE",
  requires_all: "CREATE_BOARD_LINK",
  requires_case_progress: "INSPECT_TIMELINE_EVENT",
} as const;

function toDate(value: string | null | undefined) {
  return value ? new Date(value) : null;
}

async function main() {
  await prisma.$transaction([
    prisma.reportSubmission.deleteMany(),
    prisma.hypothesisEvidence.deleteMany(),
    prisma.hypothesis.deleteMany(),
    prisma.boardEdge.deleteMany(),
    prisma.boardNode.deleteMany(),
    prisma.sessionEvidence.deleteMany(),
    prisma.session.deleteMany(),
    prisma.unlockRule.deleteMany(),
    prisma.connection.deleteMany(),
    prisma.eventEntity.deleteMany(),
    prisma.event.deleteMany(),
    prisma.evidence.deleteMany(),
    prisma.entity.deleteMany(),
    prisma.location.deleteMany(),
    prisma.case.deleteMany(),
  ]);

  const createdCase = await prisma.case.create({
    data: {
      id: caseFile.id,
      slug: caseFile.slug,
      title: caseFile.title,
      tagline: caseFile.tagline,
      summary: caseFile.summary,
      status: caseStatusMap[caseFile.status],
    },
  });

  await prisma.location.createMany({
    data: locationsFile.map((location) => ({
      id: location.id,
      caseId: createdCase.id,
      slug: location.slug,
      name: location.name,
      summary: location.summary,
      latitude: location.latitude,
      longitude: location.longitude,
    })),
  });

  await prisma.entity.createMany({
    data: entitiesFile.map((entity) => ({
      id: entity.id,
      caseId: createdCase.id,
      slug: entity.slug,
      name: entity.name,
      type: entityTypeMap[entity.type],
      summary: entity.summary,
      description: entity.description,
      publicNotes: entity.publicNotes,
      hiddenNotes: entity.hiddenNotes,
    })),
  });

  await prisma.evidence.createMany({
    data: evidenceFile.map((item) => ({
      id: item.id,
      caseId: createdCase.id,
      slug: item.slug,
      code: item.code,
      title: item.title,
      type: evidenceTypeMap[item.type],
      sourceLabel: item.sourceLabel,
      summary: item.summary,
      content: {
        text: item.content,
        relatedEntitySlugs: item.relatedEntitySlugs,
        relatedLocationSlugs: item.relatedLocationSlugs,
      },
      confidence: confidenceMap[item.confidence],
      discoveryPhase: item.discoveryPhase,
      sortDate: toDate(item.sortDate),
    })),
  });

  const locationIdBySlug = new Map(
    locationsFile.map((location) => [location.slug, location.id]),
  );

  await prisma.event.createMany({
    data: eventsFile.map((event) => ({
      id: event.id,
      caseId: createdCase.id,
      locationId: locationIdBySlug.get(event.locationSlug) ?? null,
      slug: event.slug,
      title: event.title,
      description: event.description,
      eventTime: toDate(event.eventTime),
      timePrecision: timePrecisionMap[event.timePrecision],
      certainty: certaintyMap[event.certainty],
    })),
  });

  const entityIdBySlug = new Map(entitiesFile.map((entity) => [entity.slug, entity.id]));

  await prisma.eventEntity.createMany({
    data: eventsFile.flatMap((event) =>
      event.relatedEntitySlugs
        .map((entitySlug) => {
          const entityId = entityIdBySlug.get(entitySlug);

          if (!entityId) {
            return null;
          }

          return {
            eventId: event.id,
            entityId,
          };
        })
        .filter((value): value is { eventId: string; entityId: string } => value !== null),
    ),
  });

  await prisma.unlockRule.createMany({
    data: unlocksFile.map((rule) => ({
      id: rule.id,
      caseId: createdCase.id,
      targetType: "CASE",
      targetRefId: rule.targetCode,
      ruleType: unlockRuleTypeMap[rule.ruleType],
      ruleConfig: {
        targetType: rule.targetType,
        notes: rule.notes,
        sortOrder: rule.sortOrder,
        ...rule.ruleConfig,
      },
    })),
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
