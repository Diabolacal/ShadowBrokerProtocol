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

## What Remains to Build

- [ ] Production Move contracts in `contracts/shadow_broker/`
- [ ] React frontend (Upload, Marketplace, My Intel pages)
- [ ] Walrus integration (upload/download hooks)
- [ ] Seal integration (encrypt/decrypt hooks)
- [ ] Audio teaser extraction (Web Audio API)
- [ ] Demo recording (3-minute screencast)
- [ ] Demo audio asset (scripted alliance comms)

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
sui client publish --path contracts/shadow_broker
```

### Frontend

```bash
cd apps/web
npm install
npm run dev
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
