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
- final report page now supports interactive theory selection with local per-case persistence, a live theory summary, and a final case submission step
- report page currently supports axis selection, local persistence, live summary updates, theory reset per case, a submitted verdict state with simple best-case scoring, and an evidence-backed review panel for the submitted theory
- hydration mismatch on the report page was traced to localStorage-backed client state and has now been removed by deferring persisted state loading until after hydration
- local browser-debugging workflow is usable against the project, but the reliable path for interactive validation is `build` + `start`; scripted Playwright interaction was flaky under `next dev` and worked correctly under `next start`
- evidence detail pages now mark reviewed case files in local browser storage, and the final report submission is gated behind reviewing the authored evidence set required by `unlock-final-report`
- dashboard now surfaces report progress from the persisted case session, including archive review progress and whether the case has already been closed
- submitted reports now render a stronger ending-state presentation in the report view instead of only a compact verdict box
- the case now has a dedicated `/case/[slug]/ending` route that reads the submitted report from the persisted case session and presents a fuller closing screen / epilogue
- case progress is now persisted server-side through Prisma-backed `SessionEvidence` and `ReportSubmission` records keyed by an anonymous session cookie, so reviewed evidence and final case completion no longer depend on `localStorage`
- report draft selections are now restored from the persisted session path as well, using a session-scoped draft record so unfinished report work survives reloads
- board state is now restored and saved through the same persisted anonymous session path, so node movement, manual notes, and manual links no longer rely on local-only storage
- report answer buttons now avoid pre-hydration race overrides and correctly expose selected state through `aria-pressed`, improving accessibility and browser automation reliability
- board controls now guard against session-load races and fall back to an interactive state even when snapshot loading fails, preventing the board from getting stuck disabled
- investigation board now supports manual note nodes with local persistence
- board UX now includes manual note removal and avoids duplicating the same source-target connection
- board rendering is currently using a custom interactive overlay above a hidden React Flow layer because the authored React Flow canvas became visually unreliable in-browser
- board overlay currently supports visible draggable cards, visible manual notes, connector drag from either side, keyboard deletion of selected links, and direct edge selection
- connector geometry in the overlay now uses measured connector positions so edge anchors stay aligned with the visible left/right points
- board overlay now has working replacement viewport controls for the visible layer, including overlay zoom buttons, background drag-to-pan, and reset-to-center behavior
- visible note cards now expose note removal directly in the overlay instead of relying on hidden underlying markup
- initial automated test coverage expanded to frontend components and board state operations
- report builder has focused component coverage for selection persistence, submission, and reset behavior
- board overlay has a focused component test covering manual note creation and visible removal
- board canvas refactored to extract overlay helpers and overlay rendering parts so the main component is easier to reason about while keeping the current interaction model
- GitHub Actions pipeline added for `lint`, `test`, and `build`

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

- case content now loads through Prisma-backed runtime readers on server routes, with JSON/localized fallback kept in place so the app still boots when the local database is unavailable
- localized case content is composed through `src/lib/case-vale-disappearance.locales.ts`
- UI copy dictionaries live in `src/lib/i18n.ts`
- Prisma schema exists in `prisma/schema.prisma`
- Prisma seed exists in `prisma/seed.ts`
- reviewed evidence, report draft selections, final report submission, and board state now persist through the anonymous server-side session path
- board persistence now uses `BoardNode` and `BoardEdge` records directly, with serialized node payloads stored on `BoardNode.note` instead of the earlier stopgap hypothesis-based snapshot

## Current Placeholder Assets

- `public/images/hero-harbor-night.jpg`
- `public/images/mara-dossier-portrait.jpg`
- `public/images/evidence-turbine-interior.jpg`

Source tracking lives in `docs/asset-attribution.md`.

## Validation Status

Passing:

- `npm run lint`
- `npm run test:run`
- `npm run build`

Known environment constraint:

- CLI image generation is blocked until `OPENAI_API_KEY` is set in the shell

## Most Recent Published Commits

- `42f0461` `feat: add bilingual UI and visual placeholders`
- `1754fb4` `feat: add interactive investigation board`
- `df1d13b` `feat: add prisma seed workflow`
- `1961753` `feat: scaffold investigation app foundation`

## Current Uncommitted Work

- no active uncommitted work at the moment; latest persistence cleanup and Prisma runtime read pass has been committed and pushed
- main remaining board risk is architectural: the app still relies on a custom overlay above hidden React Flow instead of a single renderer path
- the game now has a lightweight end-to-end loop: the player can explore the case, build a final theory in the report, submit it, and receive a simple verdict state
- current report scoring is intentionally lightweight: it compares the final theory against the authored best-case answer and now surfaces supporting/conflicting evidence links, but it still does not produce a richer narrative ending or a fully systemic unlock engine across the whole app
- reviewed evidence, draft report selections, final report submission, and board state now persist through the server-side session model, and the main remaining persistence gap is anonymous-session productization rather than raw storage coverage
- dashboard report-progress remains client-fetched for now because rendering session state directly in the dashboard server route triggered Prisma runtime constraints in this environment; revisit once the Prisma runtime adapter setup is finalized
- current debugging/tooling investigation is narrowed: Playwright automation matches real browser behavior against `next start`, so remaining work is to codify that workflow rather than debug the report feature itself
- keep `docs/progress.md` updated during active work so future AI sessions can resume from the latest real state

## Next Steps

### Immediate

- review the board implementation with the goal of making it simpler and easier to work on, ideally by restoring a clean React Flow-based path instead of a growing overlay workaround
- prioritize a board UX/UI that feels straightforward to use: visible nodes, obvious linking, working controls, and low-friction interactions
- confirm current board interactions remain stable in-browser: bidirectional connector drag, note dragging, visible note removal, link selection with `Delete`, zoom buttons, wheel zoom, and drag-to-pan
- decide the next report iteration: evidence-backed explanation, stronger verdict presentation, or unlock-aware submission flow
- decide the next report iteration: stronger ending presentation, dashboard visibility for report-unlock progress, or a fuller systemic unlock engine beyond the final report gate
- decide the next report iteration: dedicated ending route/epilogue, broader unlock-aware navigation across the app, or deeper evidence reasoning beyond fixed authored explanations
- decide the next endgame iteration: persist case completion beyond local browser storage, expose ending availability more broadly in navigation, or deepen the epilogue logic beyond the current score bands
- decide the next persistence iteration: surface anonymous session management more explicitly, persist per-session board viewport if that matters, or add cross-device/account-backed persistence later
- decide the next data iteration: deepen Prisma-backed runtime reads beyond the current authored-case hybrid, or simplify the content layer now that runtime readers exist
- keep using `next start` for reliable automated UI validation on interactive routes, especially when `next dev` shows HMR or hydration-related automation noise
- update `docs/progress.md` as work lands so the next AI can resume without re-discovery
- decide the next board iteration after notes and links are stable

### Testing and CI

- add focused tests for the current board overlay interaction logic once the browser behavior is stable
- keep CI green for `lint`, `test`, and `build`

### After That

- replace temporary stock placeholders with project-owned art when available
- decide whether to keep the current hybrid content layer or complete a fuller Prisma-native authored content pipeline
- revisit a cleaner long-term board renderer once the current interaction model is trusted

## Resume Prompt

If a future session needs to resume quickly:

`Continue Harbor of Echoes from docs/progress.md, then verify the current board overlay behavior in-browser and decide whether to keep refining the overlay or replace it with a cleaner single-renderer board implementation.`

## Agent Collaboration Preference

- Future AI agents working on this project may freely spawn additional sub-agents whenever that helps divide independent workstreams, speed up analysis, or parallelize implementation and verification.
- Future AI agents should update `docs/progress.md` during the session whenever meaningful progress lands, so the file stays usable as the primary handoff record.
- Future AI agents should prefer the simplest board architecture that delivers a clean UX/UI and avoid piling on temporary interaction layers if restoring a direct, maintainable implementation is feasible.
