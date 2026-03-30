# Shadow Broker Protocol — Working Memory Template

**Retention:** Carry-forward

> **Purpose:** Structured template for tracking implementation progress during hackathon sprints. Create a copy per session or per day.

---

## Usage

1. Copy this file to `docs/working_memory/YYYY-MM-DD_<task>.md`
2. Fill in the metadata block
3. Update Progress and Current State after each milestone
4. Update Checkpoint Log every 10-15 messages or before context compaction

---

## Template

```markdown
# Working Memory — Shadow Broker Protocol [Day X / Task Name]

**Date:** YYYY-MM-DD HH:MMZ
**Task Name:** [What you are doing — e.g., "Day 1: Move contracts + marketplace"]
**Version:** 1
**Maintainer:** Agent + Operator
**Active Branch:** [branch name]
**Environment:** [local devnet / testnet]

## Objective
[1–2 sentence mission for this session]

## Progress
- [ ] S01 — Move contract compilation
- [ ] S02 — Move tests passing
- [ ] S03 — Seal access policy implementation
- [ ] S04 — React frontend scaffold
- [ ] S05 — Walrus upload/download integration
- [ ] S06 — Seal encrypt/decrypt integration
- [ ] S07 — Marketplace listing flow
- [ ] S08 — Purchase flow (atomic PTB)
- [ ] S09 — Audio playback UI
- [ ] S10 — Demo recording
- [ ] ...

## Key Decisions
- Decision: [What was chosen]
  Rationale: [Why]
  Files: [Affected files]
  Risk: [low/med/high]

## Current State
- Last file touched: ...
- Last tx digest: ...
- Next action: ...
- Open questions: ...
- Blockers: ...

## Environment State
- Network: [devnet / testnet / local]
- ShadowBroker Package ID: [0x...]
- Marketplace Object ID: [0x...]
- Seal Policy Object ID: [0x...]
- Key Server IDs: [...]

## Evidence Captured
| Beat | Artifact | Tx Digest | Status |
|------|----------|-----------|--------|
| 1 | Upload + List | | |
| 2 | Browse + Teaser | | |
| 3 | Purchase + Decrypt | | |
| 4 | Revenue visible | | |
| 5 | Provenance check | | |

## Checkpoint Log
- [HH:MM] — [What was verified / decided / blocked]

## Commands Run
| Time | Command | Result |
|------|---------|--------|
| | | |

## Observations
- [Unexpected behavior, performance notes, API differences from docs]

## Next Step Pointer
> [Exact next action to take when resuming — specific enough to continue without re-reading context]
```

---

## Recovery Procedure

When resuming after context loss (summarization, new session):

1. Read the most recent `docs/working_memory/*.md` file
2. Run `git status` and `sui client active-env` to verify state
3. Read the Current State and Next Step Pointer sections
4. Confirm with operator before resuming work
