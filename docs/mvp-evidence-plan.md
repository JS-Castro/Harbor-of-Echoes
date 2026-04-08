# MVP Evidence Plan

## Scope Target

The MVP should ship with `20` evidence items, enough to support multiple plausible theories while still being authorable by hand.

## Evidence List

### EV-001 Field Notebook Excerpt

- type: scanned notes
- source: Mara Vale
- reveals: marine anomalies, concern about falsified reports
- confidence: high
- unlocked: start

### EV-002 Harbor CCTV Frame

- type: image
- source: harbor camera
- reveals: Mara approaching service road at 20:42
- confidence: high
- unlocked: start

### EV-003 Phone Message from Tomas

- type: text message
- source: Tomas Reed
- reveals: invitation to late meeting
- confidence: high
- unlocked: start

### EV-004 Official Missing Person Report

- type: police report
- source: Deputy Pike
- reveals: delayed framing of event as disappearance
- confidence: medium
- unlocked: start

### EV-005 Interview Transcript: Jonah Quill

- type: transcript
- source: journalist interview
- reveals: Mara had publishable material and feared interference
- confidence: medium
- unlocked: start

### EV-006 Environmental Photo Set

- type: images
- source: Mara camera
- reveals: dead fish and chemical foam near discharge channel
- confidence: high
- unlocked: after linking EV-001 to Blackwake

### EV-007 Internal Maintenance Memo

- type: company memo
- source: Blackwake
- reveals: employees told not to discuss servicing
- confidence: medium
- unlocked: after reviewing EV-006

### EV-008 Duplicate Inspection Report A

- type: PDF report
- source: contractor archive
- reveals: safe structural summary
- confidence: medium
- unlocked: after reviewing EV-005

### EV-009 Duplicate Inspection Report B

- type: PDF report
- source: contractor archive
- reveals: vibration fault and urgent repair warning
- confidence: high
- unlocked: after connecting EV-008 to Turbine 3

### EV-010 Patrol Car Traffic Camera

- type: still image
- source: municipal road camera
- reveals: Pike vehicle near lighthouse road at 21:11
- confidence: high
- unlocked: after comparing EV-004 with the timeline

### EV-011 Call Log Snapshot

- type: telecom metadata
- source: phone records
- reveals: Elena called Tomas at 21:20
- confidence: high
- unlocked: after connecting Tomas and Elena

### EV-012 Witness Statement: Iris Fen

- type: transcript
- source: harbor witness
- reveals: heard argument and two voices near cliff path
- confidence: medium
- unlocked: start

### EV-013 Redacted Witness Statement

- type: police archive document
- source: police file
- reveals: official copy removed reference to second male voice
- confidence: high
- unlocked: after comparing EV-012 with archive records

### EV-014 Plant Access Log Export

- type: system log
- source: Blackwake plant
- reveals: suspicious deletion around 22:02
- confidence: medium
- unlocked: after reviewing EV-011

### EV-015 Voicemail Draft

- type: audio transcript
- source: Mara phone
- reveals: "I found the piece that proves intent"
- confidence: high
- unlocked: after reviewing Mara profile

### EV-016 Recorder Fragment

- type: damaged audio
- source: recovered device fragment
- reveals: argument, demand for bag, partial slip noise
- confidence: medium
- unlocked: after proving Pike was near the scene

### EV-017 Cliff Path Forensic Photos

- type: scene images
- source: later inspection
- reveals: broken barrier post, blood traces, drag marks absent
- confidence: high
- unlocked: after reviewing EV-016

### EV-018 Ferry Locker Receipt

- type: paper receipt
- source: terminal records
- reveals: Mara created a dead-drop the day before
- confidence: high
- unlocked: after reviewing EV-015

### EV-019 Encrypted Package Partial Decrypt

- type: recovered file bundle
- source: Jonah Quill
- reveals: selected Blackwake records and unfinished cover note
- confidence: medium
- unlocked: after linking EV-018 to Jonah

### EV-020 Prior Complaint Archive Gap

- type: archive audit
- source: records office
- reveals: one historical safety complaint was removed from police intake
- confidence: medium
- unlocked: after connecting Pike to Blackwake records

## Recommended Unlock Structure

### Phase 1: Suspicion

Start with evidence that supports:

- Mara was investigating something serious
- Tomas arranged the final meeting
- the police framing is incomplete

Primary items:

- EV-001
- EV-002
- EV-003
- EV-004
- EV-005
- EV-012

### Phase 2: Corporate Fault

Unlock evidence that proves the company had a real safety secret:

- EV-006
- EV-007
- EV-008
- EV-009
- EV-015
- EV-019

### Phase 3: Night Reconstruction

Shift focus from motive to the actual confrontation:

- EV-010
- EV-011
- EV-013
- EV-014
- EV-016
- EV-017

### Phase 4: Cover-Up

Expose the wider system protecting the outcome:

- EV-018
- EV-020

## Core Entity Set for MVP

- Mara Vale
- Elena Voss
- Deputy Soren Pike
- Tomas Reed
- Jonah Quill
- Iris Fen
- Blackwake Energy
- Old Harbor
- Cliff Path
- Turbine 3

## Minimum Event Set for Timeline

- Mara starts investigation
- Mara meets Jonah
- maintenance memo distributed
- duplicate inspection report created
- dead-drop prepared
- Mara leaves flat
- harbor approach seen on CCTV
- Pike vehicle near lighthouse road
- Tomas arrives at old harbor
- Elena calls Tomas
- confrontation on cliff path
- Mara falls
- access log deleted
- missing person report filed

## Final Report Logic

The final report should score the player on three axes:

- `Cause`: accidental fall, murder, suicide, staged disappearance
- `Responsibility`: Tomas alone, Blackwake alone, shared cover-up, unknown
- `Motive`: personal conflict, safety scandal, financial panic, political corruption

The best answer should map to:

- cause: accidental fall during coercive confrontation
- responsibility: shared cover-up led by Pike, Tomas, and Elena
- motive: concealment of the turbine safety scandal and its consequences
