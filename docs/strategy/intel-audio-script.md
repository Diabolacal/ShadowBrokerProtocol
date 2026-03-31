# Intel Audio Script — Intercepted Comms Asset

**Retention:** Carry-forward
**Purpose:** Canonical script and assembly plan for the demo's intercepted comms audio asset. This is the file that gets uploaded, encrypted, sold, and decrypted in the Shadow Broker demo. It is not narration — the narrator script lives in the beat sheet.

---

## 1. Teaser Hook (First 2 Seconds)

This is the publicly previewable clip on the marketplace listing. It must function as a hook — proof that the content is real, specific, and worth buying.

```
"Target's IMT-GV3. P5L2. Over a million fuel—" [cut]
```

- Extracted from the first 2 seconds of the full recording
- Publicly readable on Walrus (unencrypted)
- The buyer hears a real target, a real location, and the start of a number — then silence

---

## 2. Full Comms Script

Pre-op raid planning. Two players in a Discord voice channel. Clipped, functional, no theatrics.

```
VOICE 1:  "Target's IMT-GV3. P5L2. Over a million fuel in the SSU,
           plus packaged materials."

VOICE 2:  "That confirmed?"

VOICE 1:  "Confirmed. Friday evening op. Two MAULs for the bash,
           two CHUMAQs to clear the fuel and whatever else is
           worth hauling."

VOICE 2:  "Defence?"

VOICE 1:  "Turrets on grid. Doesn't matter. We land hard, strip
           the guns, crack the storage, and move the fuel before
           anyone can form."

VOICE 2:  "What's the staging?"

VOICE 1:  "One jump out. Hold until everyone's in. We hit IMT-GV3
           together, burn straight to P5L2, and keep the CHUMAQs
           in a safe until the grid's clean."

VOICE 2:  "Copy. IMT-GV3, P5L2, Friday evening. Two MAULs,
           two CHUMAQs. I'll have pilots ready."

[brief pause]

VOICE 1:  "Keep the CHUMAQs in a safe until the grid's clean.
           I don't want them landing early."

VOICE 2:  "Copy. Both MAUL pilots confirmed?"

VOICE 1:  "One is. Waiting on the second. If he can't make it,
           we bounce and reset."

VOICE 2:  "Scouts on the entry?"

VOICE 1:  "Yeah. Eyes one jump out. If he shouts, we bounce
           and reset."

VOICE 2:  "Understood. I'll have the ping ready."
```

---

## 3. Why This Intel Is Valuable

A buyer hearing this recording gets actionable advance knowledge of an incoming raid:

| Detail | Value |
|--------|-------|
| **Where** | IMT-GV3 |
| **Exact location** | P5L2 |
| **Target value** | Over a million fuel + packaged materials in an SSU |
| **Timing** | Friday evening |
| **Attacker composition** | 2× MAUL (combat/bash), 2× CHUMAQ (haulers) |
| **Staging** | One jump out, hold until full fleet, hit together |
| **Execution** | Strip turrets → crack storage → haul fuel before defenders form |
| **Contingency** | Scout on entry gate; if he shouts, they bounce and reset |
| **Uncertainty** | Second MAUL pilot unconfirmed — op may slip |

This is the kind of intel that lets a defender evacuate cargo, reinforce, or set a counter-ambush. It's worth paying for.

---

## 4. Voice Generation Plan

Generate each spoken line as a separate audio file, then mix into one master asset.

| Voice | Character | Tone |
|-------|-----------|------|
| **Voice A** | Raid lead / planner | Calm, authoritative, concise — sounds like a player who's done this before |
| **Voice B** | Secondary pilot / confirming | Shorter lines, readback cadence — slightly less sure, confirming details |

### Generation rules

- Generate one line per file via 11Labs
- Do NOT generate the entire script as a single prompt — timing and pacing will be wrong
- Keep each line clean and natural — Discord voice-chat quality, not theatrical
- No radio filter, no static, no walkie-talkie FX — this is a recorded Discord conversation
- Light compression in the mix stage is fine if it helps consistency, but no dramatic processing
- The narrator voice is a completely separate asset and does not appear in this file

---

## 5. File Naming

### Individual lines

| Filename | Voice | Content |
|----------|-------|---------|
| `COMMS_A_010_teaser-hook.mp3` | A | "Target's IMT-GV3. P5L2. Over a million fuel in the SSU, plus packaged materials." |
| `COMMS_B_010_confirmed.mp3` | B | "That confirmed?" |
| `COMMS_A_020_plan.mp3` | A | "Confirmed. Friday evening op…" |
| `COMMS_B_020_defence-question.mp3` | B | "Defence?" |
| `COMMS_A_030_defence.mp3` | A | "Turrets on grid. Doesn't matter…" |
| `COMMS_B_030_staging-question.mp3` | B | "What's the staging?" |
| `COMMS_A_040_staging.mp3` | A | "One jump out. Hold until everyone's in…" |
| `COMMS_B_040_readback.mp3` | B | "Copy. IMT-GV3, P5L2, Friday evening…" |
| `COMMS_A_050_chumaq-hold.mp3` | A | "Keep the CHUMAQs in a safe until the grid's clean…" |
| `COMMS_B_050_maul-confirm.mp3` | B | "Copy. Both MAUL pilots confirmed?" |
| `COMMS_A_060_contingency.mp3` | A | "One is. Waiting on the second…" |
| `COMMS_B_060_scouts.mp3` | B | "Scouts on the entry?" |
| `COMMS_A_070_eyes-out.mp3` | A | "Yeah. Eyes one jump out…" |
| `COMMS_B_070_ping-ready.mp3` | B | "Understood. I'll have the ping ready." |

### Final assets

| Filename | Description |
|----------|-------------|
| `ASSET_INTEL_FULL_master.mp3` | Mixed-down full comms recording (uploaded to Walrus, encrypted) |
| `ASSET_INTEL_TEASER_2s.mp3` | First 2 seconds extracted from master (uploaded to Walrus, unencrypted) |

---

## 6. Assembly Plan

1. **Start** with `COMMS_A_010_teaser-hook.mp3` — Voice A's first line begins the recording immediately
2. **Sequence** remaining lines with natural conversational gaps (~0.3–0.5s between speakers)
3. **Apply** light compression if needed for level consistency — no radio filter, no FX
4. **Export** the full mix as `ASSET_INTEL_FULL_master.mp3`
5. **Extract** the first 2 seconds as `ASSET_INTEL_TEASER_2s.mp3` — this must cut mid-sentence after "Over a million fuel—"

**Critical:** The teaser is a slice of the master, not a separately generated file. Continuity between teaser and full recording is the proof-of-authenticity mechanic.

---

## 7. Duration Guidance

- Target full asset duration: **~35–50 seconds** of real spoken content
- The recording naturally breaks into two halves:
  - **First half (~20s):** High-value actionable intel — target, value, timing, composition, execution plan
  - **Second half (~15–25s):** Lower-value logistics/contingency chatter — CHUMAQ hold, pilot confirmation, scout plan
- Both halves are genuine content; there is no padding or filler
- Set the on-chain `duration_seconds` metadata to match the actual master file length
- Do not inflate metadata to claim a longer file than what exists
- The teaser is exactly 2 seconds, extracted from the start of the master
- If the mixed master lands slightly outside the 35–50s range, that's fine — the goal is believable, not padded

---

## 8. Tone Rules

### Do

- Sound like two players planning in a Discord voice channel — casual but focused
- Keep it terse and functional — this is pre-op coordination, not a performance
- Keep it specific — real system name, real grid ref, real ship classes, real cargo type
- Keep it actionable — a listener can act on this information
- Sound natural and believable — the kind of conversation that actually happens in gaming voice chat

### Don't

- Sound like military radio comms or cinematic intercepts
- Use radio FX, static bursts, or walkie-talkie processing
- Use generic sci-fi filler ("shields failing!", "we're taking fire!")
- Over-explain or repeat information unnecessarily
- Turn it into theatrical movie dialogue
- Add dramatic pauses or emotional delivery — these are players, not actors
