# Agents Context — Shadow Broker Protocol

Purpose: Provide persistent, high-signal context and guardrails for agent mode in this repository. VS Code will automatically ingest this file (1.104+). Keep it short and link out for depth.

## Workflow primer

- Start every reply with a brief acknowledgement plus a high-level plan.
- Manage work through the todo list tool with exactly one item `in-progress`; update statuses as soon as tasks start or finish.
- Report status as deltas—highlight what changed since the last message instead of repeating full plans.
- Run fast verification steps yourself when feasible and note any gates you couldn't execute.

## Project quick facts

- What: Cryptographic intelligence marketplace for EVE Frontier — trustless buying/selling of encrypted audio intel
- Stack: Sui Move (contracts) + React/Vite/TypeScript (frontend) + Walrus (blob storage) + Seal (threshold encryption)
- Architecture: Standalone dApp — no EVE Frontier world-contracts dependency
- Frontend: React + Vite + TypeScript + Tailwind CSS (`apps/web/`)
- Contracts: Sui Move (`contracts/shadow_broker/`)
- Data flow: Spy → AES encrypt audio → Walrus upload → Mint IntelObject NFT → Seal encrypt AES key → List on marketplace → Buyer purchases (atomic PTB) → Seal decrypt → Walrus download → AES decrypt → Playback

> **Glossary note:** If you see "SWE" in voice notes or transcripts, it refers to **Sui** (the blockchain). Transcription tools frequently mishear it.

Useful entry points:
- **Documentation Index**: `docs/README.md` — central map for all project documentation
- **Guardrails**: `.github/copilot-instructions.md` (source of truth for patterns)
- **Decisions**: `docs/decision-log.md` (newest first)
- **Product Vision**: `docs/strategy/shadow-broker-product-vision.md`
- **Technical Architecture**: `docs/strategy/shadow-broker-technical-architecture.md`
- **Demo Beat Sheet**: `docs/strategy/shadow-broker-demo-beat-sheet.md`
- **Validation Evidence**: `docs/strategy/shadow-broker-validation-evidence.md`

## Three-tier boundaries

✅ **Always do (no permission needed):**
- Read any file for context gathering
- Run build, test, lint commands
- Update working memory documents (`docs/working_memory/`)
- Write to `docs/` (decision logs, working memory, guides)
- Execute automated test and verification steps

⚠️ **Ask first (coordinate before action):**
- Modifying core Move contract structs or function signatures
- Changes to Seal access policy logic (`seal_approve`)
- Changes to marketplace purchase/listing mechanics
- Signing, certificate, or credential handling
- Adding external dependencies beyond the core stack
- Changes spanning >3 core files or >150 LoC delta

🚫 **Never do (hard boundaries):**
- Commit secrets, certificates, private keys, Sui keystore files
- Deploy unsigned or unverified artifacts to users
- Remove failing tests to make CI pass
- Store PII in analytics or telemetry
- Hardcode Seal key server IDs or package IDs in component files (use config.ts)

## Operational guardrails (summary)

Authoritative language for every mandate lives in `.github/copilot-instructions.md`. This section is a quick primer so agents see the rules even if only `AGENTS.md` is loaded.

- **Run the commands yourself.** Execute CLI / git / HTTP checks directly unless a secret prompt is required. Launch the command, ask the operator to paste secrets locally, and summarize results.
- **Preview vs production deploys.** Feature branches deploy to preview environments. Production deploys only come from `main` after merge.
- **Working memory discipline.** Consider a Working Memory file when: (a) a task spans multiple real-world sessions, (b) VS Code shows "summarizing conversation" or ≥70% context, or (c) operator explicitly asks.
- **Decision logging.** Any non-trivial behavior change, data migration, or platform action must be reflected in `docs/decision-log.md`.

Treat this list as a pointer; if wording differs, the `.github/copilot-instructions.md` version wins.

### External Spec Handling

When the operator pastes an externally generated plan or spec (e.g., from ChatGPT or Gemini), treat it as **intent**. Reconcile it with `.github/copilot-instructions.md` guardrails before execution. Full policy lives in `.github/copilot-instructions.md` § "External Spec Intake Policy".

## Agent operating rules (must follow)

1. Prefer smallest safe change; don't refactor broadly without explicit approval.
2. Follow the workflow primer: purposeful preamble + plan, synchronized todo list, and delta-style progress updates.
3. CLI mandate: When possible, run CLI commands yourself and summarize results. Prompt user only for secret inputs. Never commit secrets.
4. Sensitive edits: Treat Move contract entry points, Seal access policy, and marketplace logic as sensitive; ask before structural changes.
5. **Manual deployment may be required**: Check whether your deployment platform auto-deploys on push. If not, YOU must execute the deploy command after pushing.
6. **Feature branch deploys**: Always use feature-branch-scoped preview deploys. Never deploy feature branches to production.
7. **Automated error recovery**: If a build, typecheck, or test fails after your patch, do NOT present raw errors to the user and ask how to proceed. Self-diagnose, explain the cause in plain English, apply a fix, and re-run the gate. Only escalate if a fix attempt also fails or requires a design decision. See `.github/copilot-instructions.md` § Vibe Coding rule 8.

## Code & Repo Conventions

Full conventions in `docs/core/hackathon-repo-conventions.md` (carry-forward). Language-specific rules in `.github/instructions/`. These are the top-priority rules agents must internalize:

### Git Workflow
- **Branch for all non-trivial work.** Pattern: `feat/`, `fix/`, `docs/`, `chore/`, `spike/`. Lowercase, hyphen-separated.
- **Squash merge to `main`.** One clean commit per feature. PR title = commit message.
- **Commit message format:** `type: Imperative description` (e.g., `feat: Add marketplace purchase flow`). Types: `feat`, `fix`, `docs`, `chore`, `refactor`, `test`.
- **`main` must always be demo-ready.** Never merge broken code.
- **Spike branches** (`spike/`) are throwaway — never merge them.

### File Discipline
- **No files >500 lines** without explicit justification. React components ~150 lines, page components ~100 lines, Move modules ~500 lines.
- **No "god files."** Split any file doing 3+ unrelated things.
- **No commented-out code.** Write it or delete it.
- **No duplicate utilities.** Grep the workspace before creating helpers.
- **Place files correctly.** Follow directory conventions. No random one-off files at project root.

### Naming
- **React components:** `PascalCase.tsx`. Hooks: `useCamelCase.ts`. Utils: `camelCase.ts`.
- **Move:** modules `snake_case`, structs `PascalCase`, caps `PascalCaseCap`, events `PascalCaseEvent`, errors `EPascalCase`.
- **Directories:** `kebab-case`. Scripts: `verb-noun.ts`.
- **No generic names:** `utils2.ts`, `helper.ts`, `stuff.ts`, `Component3.tsx` are forbidden.

### Agent Behavior
- **Check for existing files** before creating new ones. Duplicates are a common failure mode.
- **Respect file size limits** proactively — split at generation time, not after.
- **Do not create summary docs** after every change. Update existing docs or confirm verbally.
- **Do not add speculative code** "for future use." Only write what's needed now.

## Working Memory & Context Management

Agent Mode enforces a per-conversation context limit. When the buffer fills, VS Code silently summarizes prior turns, which is lossy. A Working Memory file helps preserve task context.

### When to use Working Memory (optional)

Recommended—not required—for:
- Tasks spanning **multiple real-world sessions** (overnight, multi-day)
- After seeing a **"summarizing conversation"** toast or ≥70% context warning
- When the **operator explicitly requests** added rigor or handoff prep

For typical single-session work, proceed directly.

### Required metadata block

```markdown
# Working Memory — Shadow Broker Protocol [Day X / Task Name]
**Date:** YYYY-MM-DD HH:MMZ
**Task Name:** <What you are doing>
**Version:** <increment when meaningfully edited>
**Maintainer:** <Agent / human pairing>
```

### Template

```markdown
## Objective  ⬅ keep current
[1–2 sentence mission]

## Progress
- [x] Major milestone – note
- [ ] Upcoming step – blocker/notes

## Key Decisions
- Decision: <What>
  Rationale: <Why>
  Files: <Touched files>

## Current State  ⬅ keep these bullets current
- Last file touched: …
- Next action: …
- Open questions: …

## Checkpoint Log (self-audit)
- Agent self-check (Turn ~X / HH:MM): confirmed Objective + Next action before editing <file>.

## Context Preservation
- Active branch / services verified
- Last checkpoint: [Time / description]
- External references consulted
```

### Recovery anti-patterns
- Do **not** continue after a summarization event without re-reading context.
- Do **not** rely solely on chat history for architecture decisions.
- Do **not** invent missing details—ask the operator when information is unclear.

### Maintenance rhythm
- Update after every major milestone or multi-file edit.
- Before stepping away, ensure "Next action" reflects the very next command.
- When you see the summarization toast: (1) stop, (2) re-read the file, (3) append recap.

### Rehydration (`/rehydrate`)
When resuming after context loss: (1) read Working Memory file, (2) restate Objective/Status/Next Step, (3) ask confirmation before resuming. See `.github/prompts/rehydrate.prompt.md`.

### Cleanup
- Move completed Working Memory files to `docs/archive/working_memory/` or delete.
- Keep at most one active file per task.
- If exceeding ~200 lines, summarize into decision log and trim.

Use the extended template in `docs/core/memory.md` for multi-day sprints.

## Context Discipline & Subagent Policy

Subagents are the **primary mechanism** for complex work. Use them by default for:
- Multi-file changes (≥3 files) or cross-surface edits
- Research-heavy tasks (audits, schema analysis, migration planning)
- Any step that might consume >20% of context budget

**Subagent output requirements:** (1) short summary, (2) concrete deliverables, (3) risks/follow-ups.

**Fallback:** Break into smallest safe chunks; ask permission before proceeding with reduced scope.

## High-risk surfaces (coordinate before changing)

- **Move contract structs** — changes to `IntelObject` or `Listing` fields affect frontend, Seal policy, and demo flow
- **Seal access policy** — `seal_approve` function is the decryption gate; changes break buyer decryption
- **Marketplace purchase logic** — atomic swap must remain all-or-nothing
- **Sui key material** — private keys, mnemonics, wallet configs
- **Config.ts** — package IDs, key server IDs, network URLs; changes affect all SDK integrations

## Critical SDK Implementation Notes

These findings come from pre-hackathon validation. Violating them causes hard failures:

1. **Seal decrypt PTB:** `tx.build({ client, onlyTransactionKind: true })` is REQUIRED. Default `build()` produces full TransactionData BCS; Seal SDK does `transactionBytes.slice(1)` which strips the wrong byte. Error: "Invalid PTB: Invalid BCS".
2. **WalrusClient:** Constructor needs `{ network: 'testnet', suiClient, packageConfig: TESTNET_WALRUS_PACKAGE_CONFIG }` — not just a URL.
3. **WAL tokens:** Walrus uploads require WAL tokens. Exchange SUI→WAL via `wal_exchange::exchange_all_for_wal`.
4. **SealClient:** Constructor uses `serverConfigs: [{ objectId, weight }]` — NOT `serverObjectIds`.
5. **SessionKey:** Sign with `keypair.signPersonalMessage(sessionKey.getPersonalMessage())` → `sessionKey.setPersonalMessageSignature(signature)`.
6. **Object content:** `suiClient.getObject({ id, options: { showContent: true } })` for JSON fields. Do NOT use `suiClient.core.getObject()` which returns BCS bytes.
7. **AES-GCM pattern:** Prepend 12-byte IV to ciphertext: `[iv | ciphertext]`.

## Safety & boundaries

- Never commit secrets; use env vars or `.env.example` for placeholders
- Avoid large diffs (>150 LoC) or dependency adds without explicit approval
- Working memory docs in `docs/working_memory/` are gitignored — ephemeral, not permanent

Append material decisions to `docs/decision-log.md` using the template format.

## Documentation Rules

1. All new markdown documents must be placed inside a categorized subfolder under `docs/`.
2. Do NOT create markdown files directly under `docs/` root (only `docs/README.md` and `docs/decision-log.md` live at root).
3. When creating a new doc, update `docs/README.md` index.

## SUI Documentation Policy

Sui chain-level documentation at https://docs.sui.io is canonical for all blockchain mechanics.

- **Before assuming chain behavior** (object model, gas, PTBs, coins, events, limits, abilities), consult SUI docs.
- **Seal documentation** is at https://seal-docs.wal.app/ — NOT docs.sui.io.
- **Walrus documentation** is at https://docs.wal.app/.
- **Key constraints:** 250 KB object size limit, 1000 PTB command limit, shared object consensus latency.

## VS Code 1.110 – Agent Tooling Notes

- **Built-in browser tools** (`workbench.browser.enableChatTools`) are enabled in `.vscode/settings.json`. Prefer them over external browser MCP tooling for routine web-app verification.
- **Context compaction** happens automatically when the context window fills. Manual compaction: type `/compact` in the chat input, optionally with focus instructions.

## Fast context to load on start

- Read `.github/copilot-instructions.md` (source of truth)
- Read `AGENTS.md` (this file)
- Skim last ~40 lines of `docs/decision-log.md` for recent initiatives
- Review `docs/README.md` for documentation map
- Read `docs/strategy/shadow-broker-technical-architecture.md` for contract and SDK specs

— Keep this file concise. Update when operating rules or architecture materially change.
