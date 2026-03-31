# Demo Production Capture Sheet

**Retention:** Carry-forward
**Purpose:** Operational checklist for recording, editing, and assembling the Shadow Broker Protocol demo video.

---

## A. Locked Production Facts

| Parameter | Value |
|-----------|-------|
| Capture method | In-game SSU (Smart Storage Unit) via OBS |
| Resolution | 1440p (2560×1440) |
| Frame rate | 30 fps |
| Recording tool | OBS Studio — Game Capture source |
| Editor | Descript |
| Voice generation | ElevenLabs (11Labs) |
| Seller identity | **lacal** |
| Buyer identity | **Vifrevaert** |
| Target duration | 3:00 ±5s |
| Network | Sui Testnet |

---

## B. Voice Plan

### Voices Required

| Voice | Role | Source | Processing |
|-------|------|--------|------------|
| **Narrator** | Demo voiceover — guides the viewer through the flow | 11Labs generation | Clean, slight reverb for presence |
| **Comms Voice 1** | Raid lead — plans the SSU raid (Voice A) | 11Labs generation | Clean Discord voice-chat quality, light compression only |
| **Comms Voice 2** | Secondary pilot — confirms / readback (Voice B) | 11Labs generation (different voice) OR same voice pitch-shifted | Clean Discord voice-chat quality, light compression only |

### Fallback: Single Comms Voice

If only one distinct 11Labs voice is available for comms:
1. Generate all comms lines with that voice
2. Pitch-shift one speaker down ~3 semitones in Descript/Audacity
3. Apply different EQ curves to distinguish the two

### Script Stubs

**Narrator lines** — see beat sheet for exact cues (beats 1.3, 1.6, 2.6, 3.3, 3.5, 3.9, 4.7).

**Comms audio** — the canonical intercepted comms script lives in [`intel-audio-script.md`](intel-audio-script.md). Key facts:
- Pre-op SSU raid planning, ~35–50 seconds mixed
- Target: IMT-GV3, grid P5L2, over a million fuel
- Two voices: raid lead (Voice A) + secondary pilot (Voice B)
- Framing: recorded Discord / voice-chat conversation between players
- Teaser hook (first 2s): `"Target's IMT-GV3. P5L2. Over a million fuel—" [cut]`
- Generate each line separately via 11Labs, mix in post

> See `intel-audio-script.md` for the full script, file naming, and assembly plan.

---

## C. Teaser Guidance

- The teaser is the **first 2 seconds** of the full comms recording
- It MUST be extracted from the same source file (proving continuity)
- Teaser content: `"Target's IMT-GV3. P5L2. Over a million fuel—" [cut]`
- Teaser is uploaded **unencrypted** to Walrus — publicly playable by anyone browsing the marketplace
- The teaser creates the emotional hook: a real system, a real grid ref, a real number — then silence
- No static burst or radio FX — the teaser starts with a voice speaking immediately

---

## D. Recording Order by Character

Record all shots for each character in sequence to minimize SSU/wallet switching.

### Session 1: lacal (Seller)

| Order | Beat | Description | Notes |
|-------|------|-------------|-------|
| 1 | 1.2 | Wallet connected, Upload Intel panel | Establish seller identity |
| 2 | 1.4–1.11 | Full upload flow: drag file → progress → mint | Continuous capture, ~30s |
| 3 | 2.1–2.3 | List for sale flow | Set price, confirm listing |
| 4 | 2.4–2.5 | Play Preview on own listing | Teaser plays, waveform pulses |
| 5 | 2.7 | Disconnect / transition shot | Clean exit |

### Session 2: Vifrevaert (Buyer)

| Order | Beat | Description | Notes |
|-------|------|-------------|-------|
| 6 | 3.1 | Wallet connects, marketplace loads | Establish buyer identity |
| 7 | 3.2 | Browse listings, click into intel listing | Show marketplace browse |
| 8 | 3.4 | Play Preview as buyer | Same teaser plays — different perspective |
| 9 | 3.6–3.8 | Purchase flow + confirmation | Single PTB, explorer view |
| 10 | 4.1–4.4 | Decrypt & Play — full reveal | **THE moment** — full audio plays |
| 11 | 4.5–4.6 | Waveform hold, audio playing | Let it breathe |

### Session 3: Overlays & Pickups

| Order | Description | Notes |
|-------|-------------|-------|
| 12 | Title card (beat 1.1) | Can be OBS scene or post-production |
| 13 | Envelope encryption diagram overlay (after beat 1.9) | Subtle, brief |
| 14 | Closing text card (beat 4.7) | "Zero trust. Zero middlemen." |
| 15 | Transaction explorer close-ups | Capture from Sui explorer if needed |

---

## E. File Naming Convention

All raw and generated assets use **descriptive, sortable** names: `TYPE_ROLE_###_slug`.
The 3-digit number sets timeline order (use 010/020/030 gaps for inserts). The slug describes content.

### Voice Assets — Narrator
| Filename | Beat | Spoken Line |
|----------|------|-------------|
| `VO_NARR_010_title.mp3` | 1.3 | "An operative has intercepted alliance comms. A recording of players planning a raid on a fuel depot." |
| `VO_NARR_020_teaser-proof.mp3` | 1.6 | "A two-second teaser. Just enough to prove the content is real." |
| `VO_NARR_030_sealed.mp3` | 1.12 | "The intel is sealed. Only the holder can unlock it." |
| `VO_NARR_040_two-seconds.mp3` | 2.6 | "Two seconds. Just enough to hear something real. Not enough to know why it matters." |
| `VO_NARR_050_buyer-scan.mp3` | 3.3 | "The listing says audio. Intercepted comms. Alliance raid planning." |
| `VO_NARR_060_teaser-tension.mp3` | 3.5 | "Two seconds of intercepted comms. Voices. Urgency. That's all you get. The rest is on the listing." |
| `VO_NARR_070_atomic-purchase.mp3` | 3.9 | "Coins left. Intelligence arrived. One transaction." |

> **Note:** Beat 4.7 ("Zero trust. Zero middlemen. The intelligence speaks for itself.") is a text overlay only — it is NOT narrated.

### Voice Assets — Comms (intercepted recording)
| Filename | Description |
|----------|-------------|
| See [`intel-audio-script.md` §5](intel-audio-script.md) | Full per-line file naming for all COMMS_A / COMMS_B lines |
| `ASSET_INTEL_FULL_master.mp3` | Mixed-down full comms recording (~35–50s, uploaded to Walrus) |
| `ASSET_INTEL_TEASER_2s.mp3` | First 2 seconds extracted from FULL (teaser clip) |

### Screen Captures
| Filename | Session | Beat | Description |
|----------|---------|------|-------------|
| `CAP_LACAL_010_upload.mp4` | 1 | 1.2–1.11 | Wallet connect → upload → mint |
| `CAP_LACAL_020_list.mp4` | 1 | 2.1–2.3 | List for sale flow |
| `CAP_LACAL_030_preview.mp4` | 1 | 2.4–2.5 | Play Preview on own listing |
| `CAP_LACAL_040_disconnect.mp4` | 1 | 2.7 | Disconnect / transition |
| `CAP_VIF_010_browse.mp4` | 2 | 3.1–3.2 | Wallet connect → browse marketplace |
| `CAP_VIF_020_preview.mp4` | 2 | 3.4 | Play Preview as buyer |
| `CAP_VIF_030_purchase.mp4` | 2 | 3.6–3.8 | Purchase + confirmation |
| `CAP_VIF_040_decrypt-play.mp4` | 2 | 4.1–4.6 | Decrypt & Play → waveform hold |

### Overlays & Graphics
| Filename | Description |
|----------|-------------|
| `OVR_TITLE.png` | Title card |
| `OVR_CLOSING.png` | Closing text card |
| `OVR_DIAGRAM.png` | Envelope encryption diagram |
| `OVR_TX_010_mint.png` | Mint transaction explorer detail |
| `OVR_TX_020_purchase.png` | Purchase transaction explorer detail |

### Final Output
| Pattern | Description |
|---------|-------------|
| `DEMO_FINAL_v#.mp4` | Final exported demo (versioned) |
| `DEMO_DRAFT_v#.mp4` | Work-in-progress export |

---

## F. Asset Manifest / Cue Sheet

Master tracking table — fill in filenames as assets are produced.

| Beat | Time | Character | Capture File | Voice File(s) | Overlay | Notes |
|------|------|-----------|-------------|---------------|---------|-------|
| 1.1 | 0:00 | — | — | — | `OVR_TITLE` | 3s fade-in |
| 1.2 | 0:03 | lacal | `CAP_LACAL_010_upload` | — | — | Wallet connected |
| 1.3 | 0:07 | lacal | `CAP_LACAL_010_upload` | `VO_NARR_010_title` | — | "An operative has intercepted…" |
| 1.4–1.11 | 0:12–0:48 | lacal | `CAP_LACAL_010_upload` | `VO_NARR_020_teaser-proof`, `VO_NARR_030_sealed` | `OVR_DIAGRAM` | Upload → Mint flow |
| 2.1–2.3 | 0:48–1:02 | lacal | `CAP_LACAL_020_list` | — | — | List for sale |
| 2.4–2.5 | 1:08–1:14 | lacal | `CAP_LACAL_030_preview` | `ASSET_INTEL_TEASER_2s` (in-app) | — | Play Preview |
| 2.6 | 1:20 | lacal | `CAP_LACAL_030_preview` | `VO_NARR_040_two-seconds` | — | "Two seconds. Just enough…" |
| 2.7 | 1:27 | lacal | `CAP_LACAL_040_disconnect` | — | — | Disconnect transition |
| 3.1 | 1:30 | Vifrevaert | `CAP_VIF_010_browse` | — | — | Wallet connects |
| 3.2–3.3 | 1:37–1:42 | Vifrevaert | `CAP_VIF_010_browse` | `VO_NARR_050_buyer-scan` | — | "The listing says audio…" |
| 3.4 | 1:47 | Vifrevaert | `CAP_VIF_020_preview` | `ASSET_INTEL_TEASER_2s` (in-app) | — | Play Preview as buyer |
| 3.5 | 1:52 | Vifrevaert | `CAP_VIF_020_preview` | `VO_NARR_060_teaser-tension` | — | "Two seconds of intercepted…" |
| 3.6–3.8 | 1:58–2:20 | Vifrevaert | `CAP_VIF_030_purchase` | `VO_NARR_070_atomic-purchase` | `OVR_TX_020_purchase` | "Coins left. Intelligence arrived…" |
| 4.1–4.4 | 2:25–2:42 | Vifrevaert | `CAP_VIF_040_decrypt-play` | `ASSET_INTEL_FULL_master` (in-app) | — | **Decrypt & Play** |
| 4.5–4.6 | 2:48–2:52 | Vifrevaert | `CAP_VIF_040_decrypt-play` | — | — | Waveform hold |
| 4.7 | 2:56 | — | — | — | `OVR_CLOSING` | Closing card, 4s hold |

---

## G. Positioning Notes

- **"Any media" messaging** belongs in the repo README and hackathon submission text only — NOT in the demo narration
- The demo should feel like a **real intelligence operation**, not a product pitch
- The narration uses in-universe language: "operative", "intel", "comms", "intercepted"
- Avoid mentioning "hackathon", "prototype", or "demo" within the video itself
- The README can explain broader vision (images, documents, any encrypted payload) — the demo proves it works with the most compelling media type: audio

---

## H. Audio Generation Workflow

Step-by-step production path from script to final assets. This section makes the capture sheet self-sufficient for audio generation — no need to cross-reference other docs.

### Step 1: Generate Narrator Lines

1. Open 11Labs → select narrator voice
2. Generate each line from the **Voice Assets — Narrator** table above (§E) — one file per line
3. Export as MP3, name per the table: `VO_NARR_010_title.mp3` through `VO_NARR_070_atomic-purchase.mp3`
4. Processing: clean delivery, slight reverb for presence — no radio filter

### Step 2: Generate Comms Lines

1. Open 11Labs → select comms voices (Voice A = raid lead, Voice B = secondary pilot)
2. Generate each line from [`intel-audio-script.md` §5](intel-audio-script.md) — one file per line
3. Export as MP3, name per the script: `COMMS_A_010_teaser-hook.mp3` through `COMMS_B_070_ping-ready.mp3`
4. Processing: clean Discord voice-chat quality — no radio filter, no static, no walkie-talkie FX
5. If only one comms voice available: generate all lines, then pitch-shift one speaker ~3 semitones (see §B Fallback)

### Step 3: Mix Comms Master

1. Open Descript (or DAW)
2. Follow the assembly plan in [`intel-audio-script.md` §6](intel-audio-script.md):
   - Start directly with `COMMS_A_010_teaser-hook.mp3`
   - Sequence comms lines with ~0.3–0.5s gaps
   - Apply light compression if needed for level consistency
   - No radio filter, no hiss bed, no static — clean Discord-style conversation
3. Export full mix → `ASSET_INTEL_FULL_master.mp3`
4. Extract first 2 seconds → `ASSET_INTEL_TEASER_2s.mp3` (must cut mid-sentence after "Over a million fuel—")

### Step 4: Verify

- [ ] `ASSET_INTEL_FULL_master.mp3` plays correctly, ≤5 MB
- [ ] `ASSET_INTEL_TEASER_2s.mp3` is exactly the first 2 seconds of the master
- [ ] Teaser cuts mid-sentence — continuity with full recording is audible
- [ ] All 7 narrator lines generated and named correctly
- [x] Master duration locked: **39 seconds** (display: **0:39**)

---

## I. Open Variables

These items need to be locked before recording:

- [x] **Final price value** — **100,000 Lux** (on-chain: `1000000000000` base units). Derived from canonical `format.ts`: 1 Lux = 10^7 base units. Narration no longer speaks the price, so changing it only requires re-capturing the listing UI.
- [ ] **Comms script finalized** — canonical version in `intel-audio-script.md`; review and lock before generation
- [ ] **11Labs voice selection** — pick narrator voice and comms voice(s)
- [ ] **Teaser source clip recorded** — cannot extract teaser until full comms recording exists
- [ ] **OBS scene configured** — game capture source, audio routing, 1440p/30fps confirmed
- [ ] **SSU pre-flight verified** — both characters can load the dApp in-game without issues
