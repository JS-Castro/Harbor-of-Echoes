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

- `1754fb4` `feat: add interactive investigation board`
- `df1d13b` `feat: add prisma seed workflow`
- `1961753` `feat: scaffold investigation app foundation`

## Current Uncommitted Work

- `src/app/page.tsx`
- `docs/asset-attribution.md`
- `docs/progress.md`
- `public/images/hero-harbor-night.jpg`
- `public/images/mara-dossier-portrait.jpg`
- `public/images/evidence-turbine-interior.jpg`

## Next Steps

### Immediate

- review placeholder image integration
- commit and push asset placeholders

### After That

- replace temporary stock placeholders with project-owned art when available
- connect authored JSON content to Prisma-backed reads instead of direct file access
- add manual note creation and custom links on the board

## Resume Prompt

If a future session needs to resume quickly:

`Continue Harbor of Echoes from docs/progress.md, review any pending stock placeholder integration, then keep moving evidence/entity visuals forward before replacing placeholders with project-owned art.`
