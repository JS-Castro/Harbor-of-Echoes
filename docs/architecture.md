# Harbor of Echoes Architecture

## Build Target

Ship a single-case narrative investigation webapp with:

- archive browsing
- entity profiles
- timeline reconstruction
- manual case board linking
- conditional evidence unlocks
- final theory submission

## Recommended Stack

### Application

- `Next.js`
- `TypeScript`
- `App Router`

### Data Layer

- `PostgreSQL`
- `Prisma`

### UI

- `Tailwind CSS`
- custom components for the evidence reader, board, and timeline
- `React Flow` for the investigation board

### State

- server state through route handlers and database queries
- client session state with `Zustand`

### Optional Later Additions

- `Auth.js` if user accounts become necessary
- `S3` or `Supabase Storage` for media assets
- `Framer Motion` for controlled transitions only

## Product Architecture

The MVP should be split into these functional areas:

### Public Shell

- landing page
- case selection placeholder
- about the project

### Investigation App

- dashboard
- evidence vault
- entity detail pages
- timeline
- case board
- final report

### Authoring and Admin

Not required in MVP. All case content can be seeded manually.

## Route Structure

Suggested app routes:

- `/`
- `/case/vale-disappearance`
- `/case/vale-disappearance/evidence`
- `/case/vale-disappearance/evidence/[slug]`
- `/case/vale-disappearance/entities/[slug]`
- `/case/vale-disappearance/timeline`
- `/case/vale-disappearance/board`
- `/case/vale-disappearance/report`

## Domain Model

The system should separate canonical authored case content from player progress.

### Authored Content

- case
- evidence
- entity
- event
- location
- connection
- unlock rule

### Player State

- investigation session
- discovered evidence
- board nodes
- board links
- drafted hypotheses
- final report submission

## Minimum Data Schema

### `cases`

- `id`
- `slug`
- `title`
- `tagline`
- `summary`
- `status`

### `entities`

- `id`
- `case_id`
- `slug`
- `name`
- `type`
- `summary`
- `description`
- `public_notes`
- `hidden_notes`

Types can include:

- person
- organization
- location
- object

### `evidence`

- `id`
- `case_id`
- `slug`
- `code`
- `title`
- `type`
- `source_label`
- `summary`
- `content`
- `confidence`
- `discovery_phase`
- `sort_date`

Types can include:

- note
- photo
- message
- report
- transcript
- audio
- log

### `events`

- `id`
- `case_id`
- `slug`
- `title`
- `description`
- `event_time`
- `time_precision`
- `certainty`
- `location_id`

### `locations`

- `id`
- `case_id`
- `slug`
- `name`
- `summary`
- `latitude`
- `longitude`

### `connections`

- `id`
- `case_id`
- `from_type`
- `from_id`
- `to_type`
- `to_id`
- `relationship`
- `strength`
- `is_hidden`

Use this for authored relationships such as:

- person to person
- evidence to entity
- evidence to event
- event to location

### `unlock_rules`

- `id`
- `case_id`
- `target_type`
- `target_id`
- `rule_type`
- `rule_config`

Example rule types:

- view evidence
- open entity
- create board link
- inspect timeline event

### `sessions`

- `id`
- `case_id`
- `player_label`
- `started_at`
- `last_active_at`
- `status`

### `session_evidence`

- `id`
- `session_id`
- `evidence_id`
- `discovered_at`
- `is_read`
- `is_pinned`

### `board_nodes`

- `id`
- `session_id`
- `node_type`
- `node_ref_id`
- `pos_x`
- `pos_y`
- `note`

### `board_edges`

- `id`
- `session_id`
- `from_node_id`
- `to_node_id`
- `label`
- `note`

### `hypotheses`

- `id`
- `session_id`
- `title`
- `claim`
- `confidence`
- `status`

### `hypothesis_evidence`

- `id`
- `hypothesis_id`
- `evidence_id`
- `stance`

`stance` should support:

- support
- contradict
- unresolved

### `report_submissions`

- `id`
- `session_id`
- `cause_answer`
- `responsibility_answer`
- `motive_answer`
- `analysis_notes`
- `score`
- `ending_type`
- `submitted_at`

## MVP UI Composition

### Dashboard

Purpose:

- orient the player
- show current objectives
- surface recent discoveries

Key widgets:

- active case summary
- next recommended leads
- recently unlocked evidence
- progress by phase

### Evidence Vault

Purpose:

- browse and inspect discovered evidence

Key capabilities:

- filters by type, confidence, entity, phase
- quick preview pane
- pin to board
- mark as reviewed

### Entity Profile

Purpose:

- consolidate people, places, and organizations

Key capabilities:

- bio or summary
- related evidence
- timeline appearances
- known relationships

### Timeline

Purpose:

- reconstruct the night and prior escalation

Key capabilities:

- grouped chronological cards
- uncertainty markers
- contradictions surfaced visually
- jump from event to linked evidence

### Case Board

Purpose:

- player reasoning workspace

Key capabilities:

- pin evidence and entities
- draw manual links
- add personal notes
- cluster theories spatially

### Final Report

Purpose:

- capture the player's conclusion and map it to narrative outcome

Key capabilities:

- structured answer inputs
- summary of unresolved gaps
- scoring and ending reveal

## Content Seeding Strategy

Do not build authoring tools yet. Seed the first case directly from structured files or a Prisma seed.

Recommended seed sources:

- `data/cases/vale-disappearance/case.json`
- `data/cases/vale-disappearance/entities.json`
- `data/cases/vale-disappearance/evidence.json`
- `data/cases/vale-disappearance/events.json`
- `data/cases/vale-disappearance/unlocks.json`

## Implementation Order

### Phase 1

- scaffold Next.js app
- install Prisma and define schema
- seed one case with entities and evidence
- build dashboard and evidence vault

### Phase 2

- add entity pages
- add timeline and event relationships
- implement session progress and evidence discovery

### Phase 3

- implement case board with persisted nodes and edges
- add hypothesis drafting
- add final report scoring

### Phase 4

- improve visual identity
- add map view
- add richer media artifacts

## Engineering Constraints

- keep authored content independent from player state
- avoid over-engineering multiplayer or auth in the MVP
- treat evidence rendering as a first-class system, not generic markdown pages
- make unlock rules data-driven early so the first case does not hard-code every branch into UI components
