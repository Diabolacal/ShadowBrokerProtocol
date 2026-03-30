/**
 * Shadow Broker Protocol — Configuration
 *
 * All package IDs, key server IDs, and network URLs live here.
 * Never hardcode these values in component files.
 *
 * Update these values after each `sui client publish`.
 */

/** Network to connect to. Change to 'mainnet' for production. */
export const SUI_NETWORK = 'testnet' as const;

/** Published ShadowBroker package ID. Update after `sui client publish`. */
export const SHADOW_BROKER_PACKAGE_ID = '0xTODO';

/** Marketplace shared object ID. Update after package publish (created in init). */
export const MARKETPLACE_ID = '0xTODO';

/** Seal key server configurations for threshold decryption. */
export const SEAL_KEY_SERVERS = [
  { objectId: '0xTODO', weight: 1 },
  // Add additional key servers for threshold redundancy
];

/** Walrus network configuration. */
export const WALRUS_NETWORK = 'testnet' as const;
