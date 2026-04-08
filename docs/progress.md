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

## Key Documents

- `README.md`
- `docs/concept.md`
- `docs/case-bible.md`
- `docs/mvp-evidence-plan.md`
- `docs/architecture.md`
- `docs/art-direction.md`
- `docs/image-prompts.md`

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

- `src/components/board-canvas.tsx`
- `src/stores/board-store.ts`
- `src/lib/case-data.ts`
- `src/app/case/[slug]/board/page.tsx`
- `tsconfig.json`
- `docs/art-direction.md`
- `docs/image-prompts.md`
- `docs/progress.md`

## Next Steps

### Immediate

- commit the persisted board session work
- push latest local changes

### After That

- generate the first image asset pack once `OPENAI_API_KEY` is available
- connect authored JSON content to Prisma-backed reads instead of direct file access
- add manual note creation and custom links on the board

## Resume Prompt

If a future session needs to resume quickly:

`Continue Harbor of Echoes from docs/progress.md, commit any pending persisted-board work if valid, then proceed to image asset generation once OPENAI_API_KEY is available.`
