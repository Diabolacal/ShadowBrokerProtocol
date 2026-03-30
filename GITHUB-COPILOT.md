# GITHUB-COPILOT.md — How We Work in This Repo

> **Authoritative source:** `.github/copilot-instructions.md`
> **Agent quick-load:** `AGENTS.md`
> **Documentation index:** `docs/README.md`

This file is a short orientation for Copilot agents. It does **not** override the files above — if anything here conflicts, `copilot-instructions.md` wins.

## What this repo is

Shadow Broker Protocol — a cryptographic intelligence marketplace dApp for EVE Frontier on Sui. Players sell encrypted audio intel (route data, hazard warnings, political intelligence) for SUI tokens. Uses Mysten's Trinity stack: Sui Move (contracts), Walrus (encrypted blob storage), and Seal (threshold decryption access control).

## Verification commands

```bash
# Move contracts
sui move build --path contracts/shadow_broker   # Must compile
sui move test --path contracts/shadow_broker     # Must pass
sui client active-env                            # Verify network before any tx

# Frontend
cd apps/web
npm install                                      # Install deps
npm run build                                    # Must succeed (Vite + TypeScript)
npm run dev                                      # Local dev server
```

## Do

- Follow the guardrails in `.github/copilot-instructions.md`.
- Use `apps/web/src/utils/config.ts` for all package IDs, key server IDs, and network URLs.
- Use `tx.build({ client, onlyTransactionKind: true })` when building Seal decrypt PTBs.
- Append non-trivial decisions to `docs/decision-log.md`.
- Make the smallest safe change. Prefer guard clauses and helpers over refactors.
- Use approval tokens for high-risk changes: `CORE CHANGE OK`, `SCHEMA CHANGE OK`.

## Don't

- Hardcode package IDs, key server IDs, or network URLs in component files.
- Commit secrets, keys, mnemonics, or `.env` files.
- Use deprecated `@mysten/sui.js` or `SuiClient` imports — use `SuiJsonRpcClient` from `@mysten/sui/jsonRpc`.
- Skip the `onlyTransactionKind: true` flag on Seal decrypt transactions.
- Store raw audio files in git — audio belongs on Walrus.

## Safe edit checklist

- [ ] Plan: summary, files to touch, risk class (Low/Medium/High).
- [ ] Move build: `sui move build --path contracts/shadow_broker` passes.
- [ ] Move test: `sui move test --path contracts/shadow_broker` passes.
- [ ] Frontend build: `cd apps/web && npm run build` passes.
- [ ] Smoke: `sui client active-env` confirms expected network.
- [ ] Decision log: entry appended if non-trivial.
