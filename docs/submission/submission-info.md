# Shadow Broker Protocol — Submission Info

**Purpose:** Machine-readable reference sheet for hackathon entry forms, Discord announcements, and deployment fields. Copy values directly from here.

---

## 1. Core Identity

| Field | Value |
|-------|-------|
| **Project name** | The Shadow Broker Protocol |
| **One-line description** | Trustless intelligence marketplace for EVE Frontier — encrypted audio intel, atomic purchases, holder-only decryption |
| **Primary environment** | In-game SSU (Smart Storage Unit) |
| **Category** | Cryptographic commerce / DeFi meets espionage metagame |

**Short paragraph description:**

The Shadow Broker Protocol lets spies sell encrypted audio intelligence to buyers with zero trust and zero middlemen. Sellers upload encrypted recordings to Walrus, seal the decryption key via Seal threshold encryption, and list the intel on-chain as an NFT with a 2-second teaser preview. Buyers hear the teaser — real voices, a real location, a real number — then purchase atomically via a single Sui PTB. Only the NFT holder can decrypt. The entire flow runs in-game inside EVE Frontier's Smart Storage Unit.

---

## 2. Links

| Field | Value |
|-------|-------|
| **Repository** | https://github.com/Diabolacal/ShadowBrokerProtocol |
| **Website / deploy URL** | `TODO` — production domain not yet finalized |
| **Demo video URL** | `TODO` — exported locally; public URL pending upload |
| **Demo video path (local)** | `TODO` — will be `DEMO_FINAL_v#.mp4` per capture sheet convention |

---

## 3. Chain / Package Details

| Field | Value |
|-------|-------|
| **Network** | Stillness (EVE Frontier) — validated on Sui testnet during development |
| **Stillness Package ID** | `0xf37bd28ef8e67752168355525bc3d39dc9ff4275158d3cd1fb1abe020d3c5b8e` |
| **Settlement coin type** | `0x2a66a89b5a735738ffa4423ac024d23571326163f324f9051557617319e59d60::EVE::EVE` |
| **Denomination** | Lux (display) / EVE (settlement) — 100 Lux = 1 EVE = 10^9 base units |
| **Gas token** | SUI (separate from settlement) |
| **Move modules** | `intel_object`, `marketplace` |
| **Config source** | `apps/web/src/utils/config.ts` |

---

## 4. What the Project Does

1. **Seller uploads** encrypted audio intel — AES-encrypted blob to Walrus, Seal-encrypted key on-chain
2. **Teaser extracted** — first 2 seconds of the real recording, uploaded unencrypted as proof-of-life
3. **NFT minted** — IntelObject with metadata, blob IDs, and encrypted key
4. **Listed on marketplace** — price set in Lux, settlement in EVE
5. **Buyer previews teaser** — publicly playable, no payment required
6. **Buyer purchases atomically** — single PTB: split coin → pay seller → transfer NFT
7. **Buyer decrypts** — Seal threshold decryption recovers AES key, Walrus download, local decrypt, audio playback
8. **Verified in-game** — full flow tested inside EVE Frontier SSU

---

## 5. Technologies Used

| Technology | Role |
|------------|------|
| **Sui** | Smart contracts (Move), atomic PTB settlement, on-chain NFT |
| **Walrus** | Decentralized blob storage — encrypted audio + unencrypted teaser |
| **Seal** | Threshold encryption — holder-only decryption via key servers |
| **React + Vite + TypeScript** | Frontend application |
| **Tailwind CSS** | UI styling (dark covert theme) |
| **Web Audio API** | Teaser extraction, audio playback, waveform visualization |
| **AES-256-GCM** | Content encryption (envelope pattern) |
| **ElevenLabs** | Voice generation for demo audio asset |

---

## 6. Proof / Validation Status

| Claim | Status | Evidence |
|-------|--------|----------|
| Move contracts compile + pass tests | ✅ Verified | 8/8 tests pass (`sui move test`) |
| Walrus upload + download | ✅ Verified | Byte-for-byte confirmed in sandbox |
| Seal encrypt + decrypt | ✅ Verified | AES key recovery confirmed |
| Full E2E pipeline | ✅ Verified | 13/13 steps in pre-hackathon validation |
| **In-game SSU E2E** | ✅ Verified | Upload → list → purchase → decrypt → play inside EVE Frontier SSU |
| EVE coin settlement | ✅ Verified | Purchases settle in `Coin<EVE>`, not SUI |
| Browser wallet (zkLogin) decrypt | ⚠️ Known limitation | Seal `verifyPersonalMessage` fails with zkLogin signatures — SSU path canonical |

**Canonical tested path:** In-game SSU with standard Sui wallet signing.

See `docs/strategy/shadow-broker-validation-evidence.md` for full validation details.

---

## 7. Submission Fields Checklist

| Field | Value | Status |
|-------|-------|--------|
| Project name | The Shadow Broker Protocol | ✅ Ready |
| One-line description | Trustless intelligence marketplace for EVE Frontier — encrypted audio intel, atomic purchases, holder-only decryption | ✅ Ready |
| Network | Stillness (EVE Frontier) | ✅ Ready |
| Package ID | `0xf37bd28ef8e67752168355525bc3d39dc9ff4275158d3cd1fb1abe020d3c5b8e` (Stillness) | ✅ Ready |
| Repository URL | https://github.com/Diabolacal/ShadowBrokerProtocol | ✅ Ready |
| Website URL | `TODO` | ⏳ Pending |
| Demo video URL | `TODO` — exported locally, pending public upload | ⏳ Pending |
| Team / author | `TODO` | ⏳ Confirm |
| Discord / social | `TODO` | ⏳ If required |

---

## 8. Stillness Deployment Notes

| Field | Status |
|-------|--------|
| **Stillness deployment** | ✅ Deployed — contracts published on Stillness |
| **Stillness Package ID** | `0xf37bd28ef8e67752168355525bc3d39dc9ff4275158d3cd1fb1abe020d3c5b8e` |
| **Settlement coin type** | Stillness EVE: `0x2a66a89b5a735738ffa4423ac024d23571326163f324f9051557617319e59d60::EVE::EVE` |
| **E2E verification** | Full flow verified in-game via SSU |

---

## 9. Open Items Before Final Submission

- [ ] **Website deploy** — no public URL finalized (Cloudflare Pages templates exist)
- [ ] **Demo video upload** — video exported locally; host and link after upload
- [ ] **Entry form copy** — use §1 and §4 above as starting material
- [ ] **Discord announcement copy** — draft from §1 short paragraph
- [ ] **Team / author field** — confirm for entry form
