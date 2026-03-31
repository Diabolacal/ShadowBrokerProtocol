import { useQuery } from '@tanstack/react-query';
import { useCurrentAccount, useCurrentClient } from '@mysten/dapp-kit-react';
import { SuiJsonRpcClient, type SuiObjectResponse } from '@mysten/sui/jsonRpc';

/**
 * EVE Frontier Stillness world package — PlayerProfile + Character types.
 * Confirmed working in Flappy Frontier (Stillness-targeted).
 */
const WORLD_PACKAGE_ID =
  '0x28b497559d65ab320d9da4613bf2498d5946b2c0ae3597ccfda3072ce127448c';

const PLAYER_PROFILE_TYPE = `${WORLD_PACKAGE_ID}::character::PlayerProfile`;

interface PlayerIdentity {
  characterName: string;
  characterId: string;
}

function getObjectContent(
  obj: SuiObjectResponse | { data?: { content?: { fields?: Record<string, unknown> } } },
): Record<string, unknown> | null {
  const data = 'data' in obj ? obj.data : obj;
  const content = (data as Record<string, unknown>)?.content as
    | { fields?: Record<string, unknown> }
    | undefined;
  return (content?.fields as Record<string, unknown>) ?? null;
}

/**
 * Resolve player/character name from chain data.
 *
 * Two-step read (Stillness-compatible):
 * 1. Find PlayerProfile owned object → extract character_id
 * 2. Fetch Character shared object → extract metadata.fields.name
 */
export async function fetchPlayerIdentity(
  walletAddress: string,
  client: SuiJsonRpcClient,
): Promise<PlayerIdentity | null> {
  const { data } = await client.getOwnedObjects({
    owner: walletAddress,
    filter: { StructType: PLAYER_PROFILE_TYPE },
    options: { showContent: true },
  });

  if (!data || data.length === 0) return null;

  const firstObj = data[0];
  if (!firstObj) return null;
  const content = getObjectContent(firstObj);
  if (!content) return null;

  const characterId = String(content.character_id ?? content.characterId ?? '');
  if (!characterId) return null;

  let characterName = '';
  try {
    const charResp = await client.getObject({
      id: characterId,
      options: { showContent: true },
    });
    const charContent = getObjectContent(charResp);
    if (charContent) {
      const meta = charContent.metadata as Record<string, unknown> | undefined;
      const metaFields = (meta?.fields ?? meta) as Record<string, unknown> | undefined;
      characterName = String(metaFields?.name ?? '');
    }
  } catch {
    // Character object fetch failed — proceed with empty name
  }

  if (!characterName) return null;

  return { characterName, characterId };
}

/** Resolve the connected player's character name from EVE Frontier chain data. */
export function usePlayerIdentity() {
  const account = useCurrentAccount();
  const suiClient = useCurrentClient();
  const walletAddress = account?.address ?? null;
  const rpcClient = suiClient as unknown as SuiJsonRpcClient;

  const { data: identity, isLoading } = useQuery({
    queryKey: ['playerIdentity', walletAddress],
    queryFn: () => fetchPlayerIdentity(walletAddress!, rpcClient),
    enabled: !!walletAddress,
    staleTime: 60_000,
    refetchOnWindowFocus: false,
  });

  return {
    characterName: identity?.characterName ?? null,
    isLoading: !!walletAddress && isLoading,
  };
}

/** Resolve player/character names for a list of addresses (e.g. listing sellers). */
export function useSellerNames(addresses: string[]) {
  const suiClient = useCurrentClient();
  const rpcClient = suiClient as unknown as SuiJsonRpcClient;

  // Deduplicate and sort for stable query key
  const uniqueAddrs = [...new Set(addresses)].sort();

  const { data: nameMap } = useQuery({
    queryKey: ['sellerNames', uniqueAddrs],
    queryFn: async () => {
      const results = await Promise.all(
        uniqueAddrs.map(async (addr) => {
          const identity = await fetchPlayerIdentity(addr, rpcClient);
          return [addr, identity?.characterName ?? null] as const;
        }),
      );
      return Object.fromEntries(results) as Record<string, string | null>;
    },
    enabled: uniqueAddrs.length > 0,
    staleTime: 120_000,
    refetchOnWindowFocus: false,
  });

  return nameMap ?? {};
}
