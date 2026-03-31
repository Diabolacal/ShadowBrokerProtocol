/**
 * Denomination & display helpers for Shadow Broker Protocol.
 *
 * Settlement token: EVE (Stillness EVE Frontier assets package).
 * Display denomination: Lux (primary), EVE (secondary).
 * Conversion: 100 Lux = 1 EVE = 1,000,000,000 base units (9 decimals).
 * Therefore 1 Lux = 10,000,000 base units (10^7).
 */

// ─── Denomination Constants ──────────────────────────────

/** Base units per 1 EVE (10^9). */
export const BASE_UNITS_PER_EVE = 1_000_000_000;

/** Lux per 1 EVE. */
export const LUX_PER_EVE = 100;

/** Base units per 1 Lux (10^7). */
export const BASE_UNITS_PER_LUX = BASE_UNITS_PER_EVE / LUX_PER_EVE;

// ─── Conversion Functions ────────────────────────────────

/** Convert base units (on-chain u64) to Lux. */
export function baseUnitsToLux(baseUnits: bigint | number | string): number {
  return Number(BigInt(baseUnits)) / BASE_UNITS_PER_LUX;
}

/** Convert Lux to base units (on-chain u64). */
export function luxToBaseUnits(lux: number): bigint {
  return BigInt(Math.round(lux * BASE_UNITS_PER_LUX));
}

/** Convert base units to EVE (human-readable). */
export function baseUnitsToEve(baseUnits: bigint | number | string): number {
  return Number(BigInt(baseUnits)) / BASE_UNITS_PER_EVE;
}

/** Convert Lux to EVE. */
export function luxToEve(lux: number): number {
  return lux / LUX_PER_EVE;
}

// ─── Display Formatting ──────────────────────────────────

/** Format base units as Lux with locale-aware grouping. */
export function formatLux(baseUnits: bigint | number | string): string {
  const lux = baseUnitsToLux(baseUnits);
  return lux.toLocaleString(undefined, { maximumFractionDigits: 2 });
}

/** Format base units as EVE with locale-aware grouping. */
export function formatEve(baseUnits: bigint | number | string): string {
  const eve = baseUnitsToEve(baseUnits);
  return eve.toLocaleString(undefined, { maximumFractionDigits: 4 });
}

/** Format for display: "X Lux" primary, "(Y EVE)" secondary. */
export function formatPrice(baseUnits: bigint | number | string): { lux: string; eve: string } {
  return {
    lux: `${formatLux(baseUnits)} Lux`,
    eve: `${formatEve(baseUnits)} EVE`,
  };
}

// ─── Address Formatting ──────────────────────────────────

/** Format a Sui address for display. */
export function shortenAddress(address: string, chars = 4): string {
  if (address.length <= chars * 2 + 2) return address;
  return `${address.slice(0, chars + 2)}…${address.slice(-chars)}`;
}
