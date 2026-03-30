# Copilot Project Instructions (Shadow Broker Protocol)

Purpose: Authoritative source of truth for AI agent guardrails, interaction patterns, and workflow conventions in this VS Code project. GitHub Copilot loads this file automatically. Follow the patterns below when adding or modifying code. Optimized for a "vibe coding" workflow: the human provides intent (non-coder friendly) and the AI agent converts intent into safe, minimal, verifiable changes.

## Beginner Defaulting
If the user doesn't know an answer yet, propose a sensible default and proceed. Do not block progress.

## Operator Quick Start (Non-Coder)
1. Describe goal in plain language (what you want changed / added / fixed).
2. Assistant replies with: checklist, assumptions (≤2), risk class, plan.
3. You approve or adjust scope (optionally grant token if High risk).
4. Assistant patches code, runs typecheck/build, reports gates & follow-ups.
5. Non-trivial decisions appended to `docs/decision-log.md` (≤10 lines each).

If stuck: ask for "safer alternative" or "explain tradeoffs". Avoid giving line-by-line code; just describe desired outcome.

## Instruction Strategy & Scope
- Repo-wide mandates live here. `AGENTS.md` summarizes them; path- or persona-specific instructions belong in `.github/instructions/*.instructions.md`.
- Commands belong near the top of each relevant section. Provide exact flags so agents can run them verbatim.
- Use bullet lists over prose and include concrete "good vs bad" examples when reinforcing style or architecture conventions.

## Model Workflow Expectations
- Start every reply with a brief acknowledgement plus a high-level plan.
- Manage work through a todo list with exactly one item `in-progress`; update statuses as tasks start or finish.
- Report status as deltas — highlight what changed since the last message instead of repeating full plans.
- Run fast verification steps yourself when feasible and note any gates you couldn't execute.

## Operational Guardrails (Authoritative)
These rules have the highest precedence. `AGENTS.md` mirrors them in shortened form; if wording differs, this section wins.

1. **Execute commands yourself.** Run CLI/git/HTTP commands directly unless a secret prompt is needed, then launch the command and let the operator paste the secret locally. Summarize results instead of listing commands for the user to run.
2. **Deploy protocol.** Feature branches must deploy as previews and report the preview URL (never deploy to production from a feature branch). Production deploys only come from `main` after merge. **Deploy commands MUST be run from `apps/web/`** to pick up project bindings.
3. **Working memory discipline.** Consider a Working Memory file when: (a) a task spans multiple real-world sessions, (b) VS Code shows "summarizing conversation" or ≥70% context, or (c) operator explicitly asks. For most single-session work, proceed directly — Working Memory is optional, not blocking.
4. **Decision logging.** Any non-trivial behavior change, data migration, or platform action must be reflected in `docs/decision-log.md`.
5. **No regressions.** All persistence changes must target the project's current platform abstraction — do not reintroduce deprecated providers.

## Git Workflow & Commit Hygiene

> Full conventions: `docs/core/hackathon-repo-conventions.md`. This section is the enforced summary.

- **Branch for all non-trivial work.** Naming: `feat/`, `fix/`, `docs/`, `chore/`, `spike/` + `kebab-case-description`.
- **Direct-to-main only for:** typo fixes, `.gitignore` tweaks, trivial doc corrections.
- **Squash merge all feature branches to `main`.** One clean commit per feature. PR title = commit message.
- **Commit message format:** `type: Imperative description` (≤72 chars). Types: `feat`, `fix`, `docs`, `chore`, `refactor`, `test`.
- **`main` must always be demo-ready.** Never merge broken code.
- **Spike branches (`spike/`):** throwaway experiments — never merge to main.
- **PRs even when solo:** judges browse merged PRs. Minimal body: What / Why / Verified.
- **Never force-push to `main`.** Linear, append-only history.

## Code Organization & File Discipline

> Language-specific rules in `.github/instructions/`. This section covers cross-cutting rules.

- **No files >500 lines** without explicit justification. React components ~150 lines, page components ~100 lines, Move modules ~500 lines.
- **No "god files."** Split any file doing 3+ unrelated things.
- **No commented-out code** in the submission repo. Write it or delete it.
- **No duplicate utilities.** Grep the workspace before creating helpers.
- **Place files in the correct directory** per project conventions. No random one-off files at project root.
- **Name files consistently:** PascalCase for components, camelCase for utils/hooks, snake_case for Move, kebab-case for directories and scripts.
- **No generic names:** `utils2.ts`, `helper.ts`, `stuff.ts`, `Component3.tsx` are forbidden.
- **Check for existing files** before creating new ones — agent-generated duplicates are a common failure mode.
- **Respect file size limits proactively** — split at generation time, not after.

## Architecture Overview
- **Contracts:** Sui Move (`contracts/shadow_broker/`) — `intel_object` module (IntelObject NFT, Seal access policy) + `marketplace` module (listing, purchase, revenue)
- **Frontend:** React + Vite + TypeScript + Tailwind CSS (`apps/web/`)
- **Storage:** Walrus (encrypted audio blob storage via `@mysten/walrus`)
- **Encryption:** Seal (threshold decryption access control via `@mysten/seal`)
- **Data flow:** Spy → AES encrypt audio → Walrus upload → Mint IntelObject NFT → Seal encrypt AES key → List on marketplace → Buyer purchases (atomic PTB) → Seal decrypt → Walrus download → AES decrypt → Playback

## Quick Command Reference

```bash
# Sui Move (contracts)
sui move build --path contracts/shadow_broker     # Build Move package
sui move test --path contracts/shadow_broker       # Run Move tests
sui client publish --path contracts/shadow_broker  # Publish to active network
sui client active-env                              # Verify active Sui environment

# Frontend (apps/web)
cd apps/web
npm install                    # Install dependencies
npm run dev                    # Start Vite dev server
npm run build                  # Production build (TypeScript check + Vite)

# Verification gates (run after ANY code change)
sui move build --path contracts/shadow_broker     # Must compile
sui move test --path contracts/shadow_broker       # Must pass
cd apps/web && npm run build                       # Must succeed
```

## Key Folders / Files
- `contracts/shadow_broker/`: Move contract source and tests
- `apps/web/`: React frontend application
- `apps/web/src/utils/config.ts`: **All** package IDs, key server IDs, network URLs
- `apps/web/src/hooks/`: Custom hooks for Seal, Walrus, marketplace interactions
- `assets/audio/`: Demo audio assets
- `docs/`: Structured documentation (see `docs/README.md` for index)
- `docs/core/`: Repo conventions, working memory template
- `docs/strategy/`: Product vision, technical architecture, demo beat sheet, validation evidence

## Assistant Interaction Protocol (Strict Sequence)
1. **Intent Echo:** Restate user goal as bullet checklist (features, constraints, data touched).
2. **Assumptions:** Call out at most 2 inferred assumptions (or ask if blocking).
3. **Risk Class:** Label change Low / Medium / High (see below) + required tokens if any.
4. **Plan:** List files to read/edit, expected diff size, verification steps.
5. **Patch:** Apply minimal diff; avoid unrelated formatting.
6. **Verify:** Typecheck + build + (describe smoke steps). If unable to run, output exact commands.
7. **Summarize:** What changed, gates status, follow-ups.

## Risk Classes & Escalation Triggers
- **Low:** Pure docs, styling (CSS), isolated panel UI, copy tweaks.
- **Medium:** New utility function, new React component, new Move test, minor algorithm tweak.
- **High:** Move contract struct changes, Seal access policy modifications, marketplace purchase logic, AES key handling, config.ts changes affecting all SDK calls.

Escalate / request token if: touching Move entry points, >3 core files, >150 LoC delta, adds dependency, alters IntelObject struct, or changes Seal policy.

## Vibe Coding (Non-Coder Operator) Guidance
When the user (non-coder) asks for a change:
1. Restate goal as a concise checklist (what will change, files likely touched).
2. Identify risk level: Move contracts / Seal policy / marketplace logic / simple UI.
3. If risky token required (e.g., `CORE CHANGE OK`, `SCHEMA CHANGE OK`) and not provided: propose safer alternative or request token.
4. Propose minimal patch; avoid refactors unless solving an explicit pain point.
5. After patch: ensure typecheck + build succeed and note any manual smoke steps.
6. Update or create docs only if behavior, metrics, or public API changed — otherwise skip doc churn.
7. Offer a brief rationale when choosing between multiple implementations so the operator can approve.
8. **Automated error recovery (mandatory).** If a typecheck, build, or test command fails after your patch, you MUST NOT present the raw error to the user and ask how to proceed. Instead: (a) read and diagnose the error yourself, (b) explain the cause in one plain-English sentence, (c) immediately propose and apply a fix, and (d) re-run the failing gate. Only escalate to the user if you have attempted a fix and it also fails, or if the fix requires a design decision you cannot make alone.

Language: prefer plain language over jargon when explaining tradeoffs; surface 1–2 alternative approaches only if materially different in complexity or performance.

## Minimal Patch Contract
Each change must include: reason, scope (files), diff size estimate, success criteria, rollback (revert commit). Avoid speculative refactors.

## Task Decomposition & Subagent Execution
Subagents are the **primary mechanism** for complex work. Use them by default for:
- Multi-file changes (≥3 files) or cross-surface edits (Move + frontend)
- Research-heavy tasks (SDK audits, Seal policy design)
- Any step that might consume >20% of context budget

**Subagent output requirements:** (1) short summary, (2) concrete deliverables (files, diffs, commands), (3) risks/follow-ups.

**Failure handling:** Retry failing subagent once with tighter prompt/context. On second failure, fall back to manual decomposition and report failure cause.

## Safer Alternative Rule
If user asks for broad refactor, first propose smallest path to accomplish user-visible benefit; proceed only after confirmation or token granting scope.

## Quality Gates (Always)
- Move build passes (`sui move build --path contracts/shadow_broker`).
- Move tests pass (`sui move test --path contracts/shadow_broker`).
- Frontend build succeeds (`cd apps/web && npm run build`).
- Smoke: `sui client active-env` confirms expected network.
- **Error recovery:** If any gate fails, the agent must self-diagnose and attempt a fix before reporting to the user. See Vibe Coding rule 8 for the full protocol. Never present raw compiler output to a non-coder without a plain-English explanation and proposed fix.
- Run the relevant checks yourself whenever tooling is available. If a gate cannot be executed (e.g., missing dependency, platform constraint), call it out explicitly with the command you would have run and any fallback validation performed.

## Decision Log Template
```
## YYYY-MM-DD – <Title>
- Goal:
- Files:
- Diff: (added/removed LoC)
- Risk: low/med/high
- Gates: typecheck ✅|❌ build ✅|❌ smoke ✅|❌
- Follow-ups: (optional)
```

## Critical SDK Implementation Notes

These findings come from pre-hackathon validation. Violating them causes hard failures:

1. **Seal decrypt PTB:** `tx.build({ client, onlyTransactionKind: true })` is REQUIRED. Default `build()` produces full TransactionData BCS; Seal SDK does `transactionBytes.slice(1)` which strips the wrong byte. Error: "Invalid PTB: Invalid BCS".
2. **WalrusClient:** Constructor needs `{ network: 'testnet', suiClient, packageConfig: TESTNET_WALRUS_PACKAGE_CONFIG }` — not just a URL.
3. **WAL tokens:** Walrus uploads require WAL tokens. Exchange SUI→WAL via `wal_exchange::exchange_all_for_wal`.
4. **SealClient:** Constructor uses `serverConfigs: [{ objectId, weight }]` — NOT `serverObjectIds`.
5. **SessionKey:** Sign with `keypair.signPersonalMessage(sessionKey.getPersonalMessage())` → `sessionKey.setPersonalMessageSignature(signature)`.
6. **Object content:** `suiClient.getObject({ id, options: { showContent: true } })` for JSON fields. Do NOT use `suiClient.core.getObject()` which returns BCS bytes.
7. **AES-GCM pattern:** Prepend 12-byte IV to ciphertext: `[iv | ciphertext]`.
8. **Sui SDK:** Use `SuiJsonRpcClient` from `@mysten/sui/jsonRpc` — NOT deprecated `SuiClient` or `@mysten/sui.js`.
9. **Transaction class:** `Transaction` from `@mysten/sui/transactions` — NOT `TransactionBlock`.

## Code Style Examples

### TypeScript/React Patterns
```typescript
// ✅ GOOD – Typed props, error handling, descriptive names
interface IntelCardProps {
  intelId: string;
  title: string;
  priceMist: bigint;
}

async function purchaseIntel({ intelId, priceMist }: { intelId: string; priceMist: bigint }): Promise<PurchaseResult> {
  if (!intelId) {
    throw new Error('Intel ID is required');
  }
  // ... implementation
}

// ❌ BAD – Any types, vague names, no validation
async function buy(id: any, p: any) {
  return await doBuy(id, p);
}
```

### State Management
```typescript
// ✅ GOOD – Extract to custom hook
function useSealDecrypt() {
  const [decryptedData, setDecryptedData] = useState<Uint8Array | null>(null);
  const [decrypting, setDecrypting] = useState(false);

  const decrypt = useCallback(async (params: DecryptParams) => {
    setDecrypting(true);
    try {
      const data = await performDecrypt(params);
      setDecryptedData(data);
    } finally {
      setDecrypting(false);
    }
  }, []);

  return { decryptedData, decrypting, decrypt };
}
```

## CLI Execution Policy

### Core Mandate
The assistant MUST directly run every CLI command that does not require pasting or revealing a secret value. The operator will manually paste any secret when prompted. Do NOT ask the operator to run a command the assistant can execute.

### Operational Rules
1. Default to executing (not just printing) non-secret commands.
2. **Secret Entry Boundary:** For commands that prompt for a secret, the assistant initiates the command; the operator pastes the secret at the prompt locally.
3. **Batch & Verify:** After running 3–5 related CLI actions, summarize outcomes before proceeding.
4. **Idempotence First:** For potentially destructive commands, first run a dry-run/listing variant.
5. **Error Handling:** On command failure, attempt one focused retry if transient. If still failing, surface exact stderr + next options.
6. **Logging Hygiene:** Never log or store secret tokens; redact if accidentally echoed.

### Prohibited Patterns
- "Please run …" followed by a command the assistant could execute.
- Providing only a list of commands without executing them when execution is possible.

## Context & Memory Protocols

### Working Memory Documents
When working on multi-step tasks (>30 minutes or >50 messages), maintain a working memory document:

**Location:** `docs/working_memory/<YYYY-MM-DD>_<task_name>.md`

See `docs/core/memory.md` for the full template.

### When to Create / Update
- **Create:** At task start if expected duration >30 min.
- **Update:** Every 10–15 messages OR when approaching context budget limit.
- **Critical update:** IMMEDIATELY before context compaction.

### Post-Compaction Recovery
1. Read `docs/working_memory/<current_task>.md`.
2. Verify current state (git status, running processes).
3. Resume from "Next action" in working memory.

## External Spec Intake Policy (ChatGPT / Gemini Prompts)

The operator may paste a "spec" produced by an external LLM. Treat it as **INTENT**, not strict instructions.

**Required behavior:**
1. Extract the intended outcome.
2. Validate against repository guardrails.
3. Check workspace reality and prefer existing patterns over assumptions in the spec.
4. If the spec is inefficient, outdated, or architecturally unsound, propose a safer or cleaner approach and proceed.

## High-Risk Surfaces

- **Move contract structs** — changes to `IntelObject` or `Listing` affect frontend, Seal policy, and demo flow
- **Seal access policy** — `seal_approve` function gates decryption; errors lock buyers out of purchased content
- **Marketplace purchase logic** — atomic swap must remain all-or-nothing
- **Sui key material** — private keys, mnemonics, wallet configs
- **Config.ts** — package IDs, key server IDs, network URLs; changes affect all SDK integrations
- **AES key handling** — bugs here leak content or make it unrecoverable

## Hackathon Rules Compliance Policy

- **Before submission**, cross-check repo hygiene: original work, GitHub-hosted, within deadline.
- An eligible Entry may win **max 1 prize**. Player vote = 25% of Best Entry score.
- **No vote manipulation** — do not automate vote solicitation, trading, or purchasing.

## SUI Documentation Policy

Sui chain-level documentation at https://docs.sui.io is canonical for all blockchain-level mechanics.

- **Seal documentation** is at https://seal-docs.wal.app/ — NOT docs.sui.io/guides/developer/nautilus/seal.
- **Walrus documentation** is at https://docs.wal.app/.
- Key constraints: 250 KB object size limit, 1000 PTB command limit, shared object consensus latency.

## Documentation Rules

1. All new markdown documents must be placed inside a categorized subfolder under `docs/`.
2. Do NOT create markdown files directly under `docs/` root (only `docs/README.md` and `docs/decision-log.md` live at root).
3. When creating a new doc, update `docs/README.md` index.

## VS Code 1.110 – Agent Tooling Notes

- **Built-in browser tools** (`workbench.browser.enableChatTools`) are enabled in `.vscode/settings.json`. Prefer them over external browser MCP tooling for routine web-app verification.
- **Context compaction** happens automatically when the context window fills. Manual compaction: `/compact` in the chat input, optionally with focus instructions.

## Response Framing
- Start with a purposeful plan; reserve redundant labels only when they aid scanning.
- Keep follow-up updates focused on what changed since the prior message (delta reporting).
- Reference filenames and symbols with backticks for clarity.
- Keep answers concise — don't over-explain completed file operations.

## Common Failure Modes & Preventers
- **Seal "Invalid PTB" error** → forgot `onlyTransactionKind: true` on decrypt build. Always include it.
- **Walrus upload fails with no WAL** → must exchange SUI for WAL tokens first.
- **Deprecated SDK imports** → use `SuiJsonRpcClient` from `@mysten/sui/jsonRpc`, never `SuiClient` or `@mysten/sui.js`.
- **Object fields appear empty** → must pass `options: { showContent: true }` to `getObject()`.
- **Speculative refactors** → apply safer alternative rule; smallest safe change first.

## When Unsure
- Search existing patterns first (grep for similar feature names).
- Consult Seal docs at https://seal-docs.wal.app/ for encryption patterns.
- Consult Walrus docs at https://docs.wal.app/ for storage patterns.
- Keep components < ~150 lines, utils < ~100 lines.

<!-- End – Provide feedback if additional sections should be documented. -->
