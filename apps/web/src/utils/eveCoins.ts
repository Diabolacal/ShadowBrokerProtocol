/**
 * EVE coin discovery and selection utilities.
 *
 * EVE is a non-gas coin — you cannot splitCoins from tx.gas.
 * Instead, fetch the player's EVE coin objects via getCoins(),
 * merge if needed, then split the exact payment amount.
 *
 * Pattern from CivilizationControl and Flappy-Frontier.
 */

import type { SuiJsonRpcClient } from '@mysten/sui/jsonRpc';
import { SETTLEMENT_COIN_TYPE } from './config';

export interface EveCoinObject {
  coinObjectId: string;
  balance: string;
}

/** Fetch all EVE coin objects owned by the given address. */
export async function fetchEveCoins(
  rpcClient: SuiJsonRpcClient,
  ownerAddress: string,
): Promise<EveCoinObject[]> {
  const coins: EveCoinObject[] = [];
  let cursor: string | null | undefined;
  let hasNext = true;

  while (hasNext) {
    const response = await rpcClient.getCoins({
      owner: ownerAddress,
      coinType: SETTLEMENT_COIN_TYPE,
      cursor: cursor ?? undefined,
      limit: 50,
    });

    for (const coin of response.data) {
      coins.push({
        coinObjectId: coin.coinObjectId,
        balance: coin.balance,
      });
    }

    hasNext = response.hasNextPage;
    cursor = response.nextCursor;
  }

  return coins;
}

/** Sum the total EVE balance across all coin objects. */
export function totalEveBalance(coins: EveCoinObject[]): bigint {
  return coins.reduce((sum, c) => sum + BigInt(c.balance), 0n);
}
