# The Shadow Broker Protocol

**Trustless intelligence trading for a lawless frontier.**

The Shadow Broker Protocol is a cryptographic intelligence marketplace for [EVE Frontier](https://www.evefrontier.com/) on Sui. Spies upload encrypted audio intelligence, set a price, and buyers purchase with cryptographic delivery guarantees — zero trust, zero middlemen, zero escrow.

---

## The Problem: Fair Exchange

Corporate espionage is EVE's most celebrated metagame. Spies acquire valuable intel — fleet positions, alliance comms recordings, staging coordinates — but have no trustless way to sell it:

1. **Spy sends first → buyer doesn't pay.** No leverage after disclosure.
2. **Buyer pays first → spy sends garbage.** No recourse after payment.
3. **Escrow → trust bottleneck.** The intermediary can collude, leak, or vanish.

The Shadow Broker Protocol solves this with three Mysten Labs technologies working in concert.

---

## Architecture: The Mysten Trinity

| Layer | Technology | Role |
|-------|-----------|------|
| **Storage** | [Walrus](https://docs.wal.app/) | Decentralized blob storage for encrypted audio + unencrypted 2-second teaser clips |
| **Encryption** | [Seal](https://seal-docs.wal.app/) | Threshold encryption — only the NFT holder can decrypt |
| **Exchange** | [Sui PTB](https://docs.sui.io/) | Atomic swap — payment and NFT transfer in a single transaction |

### Data Flow

```
SPY: Record audio → AES-encrypt → upload to Walrus → extract 2s teaser (unencrypted) → upload teaser
     → mint IntelObject NFT → Seal-encrypt AES key → list on marketplace

BUYER: Browse listings → play 2-second teaser (proof of life) → purchase (atomic PTB)
       → Seal-decrypt AES key → download from Walrus → AES-decrypt → play full recording
```

The **audio teaser** is the key UX innovation: buyers hear two seconds of real intercepted comms — enough to know the content is genuine, but not enough to learn anything useful — before committing funds.

---

## Repo Structure

```
ShadowBrokerProtocol/
├── .github/          ← Agent instructions, prompts, skills, security guidelines
├── .vscode/          ← Workspace settings, tasks, prompt files
├── contracts/
│   └── shadow_broker/  ← Sui Move smart contracts
├── apps/
│   └── web/            ← React + Vite + TypeScript frontend
├── assets/
│   └── audio/          ← Demo audio assets (recorded during sprint)
├── docs/               ← Project documentation
│   ├── core/           ← Conventions, working memory template
│   ├── strategy/       ← Product vision, tech architecture, demo script, validation evidence
│   ├── decision-log.md
│   └── README.md       ← Documentation index
├── templates/
│   └── cloudflare/     ← Deployment templates
├── AGENTS.md           ← Agent context and guardrails
├── README.md           ← This file
└── LICENSE             ← MIT
```

---

## What's Already Validated

Pre-hackathon validation (conducted in a separate sandbox repo) confirmed all three technical layers work end-to-end:

| Layer | Result | Evidence |
|-------|--------|----------|
| Move contracts | 9/9 tests pass, on-chain smoke (mint/list/purchase) confirmed | Validation evidence doc |
| Walrus | Upload + download, byte-for-byte verified | Validation evidence doc |
| Seal | Encrypt + decrypt, AES key recovery confirmed | Validation evidence doc |
| E2E pipeline | 13/13 steps pass, 70.2s total | Validation evidence doc |

See `docs/strategy/shadow-broker-validation-evidence.md` for full details and SDK patterns.

---

## Status

The MVP is implemented, deployed to Sui testnet, and **verified end-to-end in-game via EVE Frontier's Smart Storage Unit (SSU)**:

- [x] Move contracts (`intel_object`, `marketplace`) — 8/8 tests pass
- [x] React frontend (Marketplace, Upload Intel, My Intel pages)
- [x] Walrus integration (upload/download hooks)
- [x] Seal integration (encrypt/decrypt hooks)
- [x] Audio teaser extraction (Web Audio API)
- [x] AES-256-GCM encryption utilities
- [x] Published to Sui testnet
- [x] EVE/Lux denomination model (CivilizationControl-aligned)
- [x] Real EVE settlement (Stillness `Coin<EVE>`)
- [x] In-game E2E verified: upload → list → purchase → Seal decrypt → Walrus download → playback
- [ ] Demo recording (3-minute screencast)
- [ ] Demo audio asset (scripted alliance comms)

### Primary Access: In-Game SSU

The Shadow Broker Protocol is designed to operate **inside EVE Frontier** via Smart Storage Units. The in-game SSU environment provides the walrus/seal-compatible wallet signing that the full encrypt/decrypt pipeline requires. Browser wallet extensions (e.g., EveVault zkLogin) have known limitations with Seal's `verifyPersonalMessage` — the SSU path is the canonical, tested flow.

**Package ID:** `0xf37bd28ef8e67752168355525bc3d39dc9ff4275158d3cd1fb1abe020d3c5b8e`

> **Economy model:** Prices display in **Lux** (primary) with **EVE** (secondary). Purchases settle in **EVE tokens** (`Coin<EVE>` from the Stillness assets package), not SUI. Gas remains SUI. Buyers must hold EVE tokens in their wallet. The Move contract's `purchase<T>` is generic — the frontend wires the Stillness EVE coin type: `0x2a66a89b5a735738ffa4423ac024d23571326163f324f9051557617319e59d60::EVE::EVE`.

---

## Quickstart

### Prerequisites

- [Sui CLI](https://docs.sui.io/guides/developer/getting-started/sui-install) installed
- [Node.js](https://nodejs.org/) 20+
- Sui testnet or localnet configured

### Move Contracts

```bash
sui move build --path contracts/shadow_broker
sui move test --path contracts/shadow_broker
```

### Frontend

```bash
cd apps/web
npm install
npm run dev     # Dev server at http://localhost:5173
npm run build   # Production build
```

---

## Key Technical Decisions

- **Standalone marketplace** — no world-contracts / EVE SSU dependency. The project's value is the Mysten Trinity, not world-contracts integration.
- **Envelope encryption** — AES-encrypt content locally, Seal-encrypt only the AES key. Performant for any file size.
- **2-transaction seller flow** — TX1: mint (get object ID), TX2: update sealed key + list (single PTB). Decouples minting from Seal encryption.
- **Audio teaser** — 2-second unencrypted clip on Walrus provides proof-of-life without revealing substance.

---

## Critical SDK Notes

These findings were discovered during validation and are essential for implementation:

- **Seal decrypt PTB:** Must use `tx.build({ client, onlyTransactionKind: true })` — default `build()` causes "Invalid PTB: Invalid BCS" from key servers
- **WalrusClient constructor:** Requires `{ network, suiClient, packageConfig }` — not just a URL
- **WAL tokens:** Walrus uploads require WAL tokens — exchange SUI→WAL via `wal_exchange::exchange_all_for_wal`
- **SealClient constructor:** Uses `serverConfigs: [{ objectId, weight }]` — NOT `serverObjectIds`
- **Session key signing:** `keypair.signPersonalMessage(sessionKey.getPersonalMessage())` → `sessionKey.setPersonalMessageSignature(signature)`

---

## Hackathon Context

This project targets the **EVE Frontier Hackathon** (March 11–31, 2026). Primary prize target: **Most Creative**. The combination of Sui + Walrus + Seal in a single project is unique across the portfolio — no other entry integrates the full Mysten Labs technology suite.

---

## License

MIT — see [LICENSE](LICENSE).
