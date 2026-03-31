# Shadow Broker Protocol — Decision Log

> Newest entries first. Use the template below for each entry.

## 2026-03-31 – Productization Pass: UI Upgrade + SSU-Primary Pivot
- Goal: Upgrade UI from prototype to hackathon-demo quality (dark covert aesthetic). Pivot docs to reflect in-game SSU as primary environment after successful E2E test. Surface teaser preview prominently.
- Files: tailwind.config.js, index.css, NavBar.tsx, ListingCard.tsx, IntelCard.tsx, MarketplacePage.tsx, UploadPage.tsx, MyIntelPage.tsx, README.md, decision-log.md
- Diff: ~200 added, ~120 removed (pure styling/docs — zero logic changes)
- Risk: low (no contract, Seal, Walrus, or settlement logic touched)
- Gates: typecheck ✅ build ✅
- Design: Dark, covert, classified, monospace typography, INTERCEPT badges, scanline overlays, prominent teaser preview with waveform animation, pulsing borders on active playback
- Key pivot: In-game SSU is now primary access path; browser wallet demoted to secondary

## 2026-03-31 – Bypass Seal client-side zkLogin verification via export/import
- Goal: Fix "Session key signature verification failed: Not valid" for EveVault (zkLogin) wallets.
- Root cause: Seal SDK's `setPersonalMessageSignature` calls `verifyPersonalMessageSignature` which uses `sui_verifyZkLoginSignature` RPC. This fails for zkLogin wallets (error swallowed into generic "Not valid").
- Fix: Use `SessionKey.export()` → set signature → `SessionKey.import()` to bypass client-side verify. Seal key servers verify the signature independently.
- Files: useSeal.ts
- Diff: ~20 added, ~60 removed (diagnostic code removed)
- Risk: medium (decrypt flow change, but standard wallets still use verified path)
- Gates: typecheck ✅ build ✅
- Follow-ups: Smoke test with EveVault wallet

## 2026-03-31 – Full EVE Settlement (Stillness)
- Goal: Wire real EVE coin settlement. Purchase PTB now fetches EVE coin objects, merges, and splits payment — no longer uses `tx.gas` (SUI). Targets Stillness environment.
- Files: config.ts, eveCoins.ts (NEW), useMarketplace.ts, ListingCard.tsx, UploadPage.tsx, format.ts
- Diff: ~60 added, ~20 removed
- Risk: high (settlement coin change, PTB coin selection pattern)
- Gates: typecheck ✅ build ✅ move-test ✅ (8/8)
- Settlement coin: `0x2a66a89b5a735738ffa4423ac024d23571326163f324f9051557617319e59d60::EVE::EVE` (Stillness)
- Pattern: Flappy-Frontier `seedProvider.ts` — getCoins → mergeCoins → splitCoins → moveCall
- UI: Lux primary + EVE secondary on listing cards and upload page
- Prerequisite: Buyer wallet must hold EVE tokens (separate from SUI gas)

## 2026-03-31 – EVE/Lux Denomination Model
- Goal: Replace SUI-denominated pricing with EVE/Lux model from EVE Frontier. Move contract made generic, frontend shows Lux.
- Files: marketplace.move, format.ts, config.ts, ListingCard.tsx, UploadPage.tsx, useMarketplace.ts
- Diff: ~80 added, ~30 removed
- Risk: high (Move contract change, republish, denomination logic)
- Gates: typecheck ✅ build ✅ move-build ✅ move-test ✅ (8/8)
- Source of truth: CivilizationControl `src/lib/currency.ts` (1 EVE = 10^9 base units, 100 Lux = 1 EVE)
- Package ID: `0xf37bd28ef8e67752168355525bc3d39dc9ff4275158d3cd1fb1abe020d3c5b8e` (testnet, republished with generic `purchase<T>`)
- Limitation: Testnet uses `Coin<SUI>` as settlement token (EVE not available on testnet). Production would use `Coin<EVE>`.

## 2026-03-31 – MVP Implementation: Move Contracts + React Frontend
- Goal: Implement full MVP — Move contracts (intel_object, marketplace), React frontend (upload/browse/purchase/decrypt flows), crypto utilities, Walrus/Seal hooks
- Files: contracts/shadow_broker/sources/*.move, contracts/shadow_broker/tests/*.move, apps/web/src/**/*.{ts,tsx,css}, tailwind.config.js, postcss.config.js
- Diff: ~1500 added LoC across 16 files
- Risk: high (Move contracts, Seal integration, marketplace logic)
- Gates: typecheck ✅ build ✅ move-build ✅ move-test ✅ (8/8) smoke ✅ (all pages render)
- Package ID: `0x2eddccc37abce8cfabfe08242a36f90d389b7eae5c65d742b0714207d8c030f7` (testnet)
- Follow-ups: E2E test with two wallets, demo audio file, Walrus WAL token exchange

<!--
## YYYY-MM-DD – <Title>
- Goal:
- Files:
- Diff: (added/removed LoC)
- Risk: low/med/high
- Gates: typecheck ✅|❌ build ✅|❌ smoke ✅|❌
- Follow-ups: (optional)
-->
