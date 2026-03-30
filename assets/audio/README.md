# Demo Audio Assets

This directory holds demo audio files for the Shadow Broker Protocol hackathon submission.

## Requirements

- **Format:** WAV or MP3, mono or stereo
- **Duration:** 15–30 seconds of "intercepted communications" (scripted, not real comms)
- **Teaser:** A 2-second clip extracted from the first 2 seconds via Web Audio API (`teaserExtract.ts`)
- **Content:** Role-played EVE Frontier voice comms — route intel, hazard warnings, political intelligence

## Files

| File | Purpose | Status |
|------|---------|--------|
| `intel-sample-01.wav` | Full encrypted intel audio | TODO: record during sprint |
| `intel-sample-01-teaser.wav` | 2-second unencrypted teaser | TODO: auto-extract |

## Notes

- Full audio is AES-256-GCM encrypted and stored on Walrus
- Only the 2-second teaser is stored unencrypted (also on Walrus) for marketplace browsing
- Do not commit large audio files to git — use Walrus for storage
- For the demo, a small sample file (~100KB) is acceptable in git as a development fixture
