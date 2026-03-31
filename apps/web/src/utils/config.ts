/**
 * Shadow Broker Protocol — Configuration
 *
 * All package IDs, key server IDs, and network URLs live here.
 * Never hardcode these values in component files.
 *
 * Update these values after each `sui client publish`.
 */

/** Network to connect to. */
export const SUI_NETWORK = 'testnet' as const;

/** RPC URL for Sui testnet. */
export const SUI_RPC_URL = 'https://fullnode.testnet.sui.io:443';

/** Published ShadowBroker package ID. Update after `sui client publish`. */
export const PACKAGE_ID = '0xf37bd28ef8e67752168355525bc3d39dc9ff4275158d3cd1fb1abe020d3c5b8e';

/** Seal key server configurations for threshold decryption (testnet open-mode). */
export const SEAL_KEY_SERVERS: { objectId: string; weight: number }[] = [
  { objectId: '0x73d05d62c18d9374e3ea529e8e0ed6161da1a141a94d3f76ae3fe4e99356db75', weight: 1 },
  { objectId: '0xf5d14a81a982144ae441cd7d64b09027f116a468bd36e7eca494f750591623c8', weight: 1 },
];

/** Walrus network. */
export const WALRUS_NETWORK = 'testnet' as const;

/**
 * Settlement coin type for marketplace purchases.
 * The Move contract is generic (Coin<T>).
 * This is the Stillness EVE coin type from the EVE Frontier assets package.
 */
export const SETTLEMENT_COIN_TYPE =
  '0x2a66a89b5a735738ffa4423ac024d23571326163f324f9051557617319e59d60::EVE::EVE';

/** IntelObject type string for queries. */
export const INTEL_OBJECT_TYPE = `${PACKAGE_ID}::intel_object::IntelObject`;

/** Listing type string for queries. */
export const LISTING_TYPE = `${PACKAGE_ID}::marketplace::Listing`;
