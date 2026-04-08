# Harbor of Echoes Progress

## Current State

The project has moved from concept into a working application foundation.

Implemented:

- project concept and case canon
- MVP evidence plan
- architecture and data model planning
- Next.js app scaffold
- landing page with project branding
- authored case routes for dashboard, evidence, entities, timeline, board, and report
- Prisma schema and Prisma 7 config
- Prisma seed workflow from local JSON case files
- first interactive investigation board using React Flow
- local board session persistence with Zustand
- initial free-use placeholder image pack integrated into the homepage
- bilingual UI with `English` and `pt-PT`
- locale switcher persisted by cookie
- pt-PT localized case content overrides for case, entities, evidence, events, and locations
- evidence detail and entity dossier pages upgraded with placeholder visuals

## Key Documents

- `README.md`
- `docs/concept.md`
- `docs/case-bible.md`
- `docs/mvp-evidence-plan.md`
- `docs/architecture.md`
- `docs/art-direction.md`
- `docs/image-prompts.md`
- `docs/asset-attribution.md`

## Implemented App Areas

- `/`
- `/case/[slug]`
- `/case/[slug]/evidence`
- `/case/[slug]/evidence/[evidenceSlug]`
- `/case/[slug]/entities/[entitySlug]`
- `/case/[slug]/timeline`
- `/case/[slug]/board`
- `/case/[slug]/report`

## Data and Persistence

- case content currently loads from `data/cases/vale-disappearance/*.json`
- localized case content is composed through `src/lib/case-vale-disappearance.locales.ts`
- UI copy dictionaries live in `src/lib/i18n.ts`
- Prisma schema exists in `prisma/schema.prisma`
- Prisma seed exists in `prisma/seed.ts`
- board layout persists locally in browser storage by case slug

## Current Placeholder Assets

- `public/images/hero-harbor-night.jpg`
- `public/images/mara-dossier-portrait.jpg`
- `public/images/evidence-turbine-interior.jpg`

Source tracking lives in `docs/asset-attribution.md`.

## Validation Status

Passing:

- `npm run lint`
- `npm run build`

Known environment constraint:

- CLI image generation is blocked until `OPENAI_API_KEY` is set in the shell

## Most Recent Published Commits

- `42f0461` `feat: add bilingual UI and visual placeholders`
- `1754fb4` `feat: add interactive investigation board`
- `df1d13b` `feat: add prisma seed workflow`
- `1961753` `feat: scaffold investigation app foundation`

## Current Uncommitted Work

None. Working tree is currently clean.

## Next Steps

### Immediate

- review and refine `pt-PT` wording so it reads naturally and consistently across the game
- scan the UI for any remaining English or mixed-register text in Portuguese mode
- decide the minimum test surface for the current phase

### Testing and CI

- install a test runner
- add a small initial suite for i18n, case data composition, and critical route-level logic
- add a GitHub Actions workflow to run `lint`, `test`, and `build`

### After That

- replace temporary stock placeholders with project-owned art when available
- connect authored JSON content to Prisma-backed reads instead of direct file access
- add manual note creation and custom links on the board

## Resume Prompt

If a future session needs to resume quickly:

`Continue Harbor of Echoes from docs/progress.md, audit pt-PT consistency across the UI and case content, then add tests plus a GitHub Actions pipeline for lint, test, and build.`

## Agent Collaboration Preference

- Future AI agents working on this project may freely spawn additional sub-agents whenever that helps divide independent workstreams, speed up analysis, or parallelize implementation and verification.
