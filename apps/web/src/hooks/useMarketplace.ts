import { useCallback } from 'react';
import { Transaction } from '@mysten/sui/transactions';
import { useCurrentClient, useCurrentAccount, useDAppKit } from '@mysten/dapp-kit-react';
import { SuiJsonRpcClient } from '@mysten/sui/jsonRpc';
import { PACKAGE_ID, SETTLEMENT_COIN_TYPE } from '../utils/config';
import { fetchEveCoins } from '../utils/eveCoins';

/** Parse a Sui RPC Option<String> field — handles null, string, { Some: v }, { vec: [v] }. */
function parseOptionString(raw: unknown): string | null {
  if (raw == null) return null;
  if (typeof raw === 'string') return raw || null;
  if (typeof raw === 'object') {
    const obj = raw as Record<string, unknown>;
    if (typeof obj.Some === 'string') return obj.Some || null;
    if (Array.isArray(obj.vec) && typeof obj.vec[0] === 'string') return obj.vec[0] || null;
  }
  return null;
}

export interface MintResult {
  intelObjectId: string;
  digest: string;
}

/** Hook for on-chain marketplace operations. */
export function useMarketplace() {
  const suiClient = useCurrentClient();
  const account = useCurrentAccount();
  const dAppKit = useDAppKit();

  /** TX1: Mint an IntelObject. Returns the created object ID. */
  const mintIntel = useCallback(
    async (params: {
      blobId: string;
      fileType: string;
      durationSeconds: number;
      fileSizeBytes: number;
      description: string;
      teaserBlobId: string | null;
    }): Promise<MintResult> => {
      if (!account) throw new Error('Wallet not connected');

      const tx = new Transaction();
      const [intel] = tx.moveCall({
        target: `${PACKAGE_ID}::intel_object::mint`,
        arguments: [
          tx.pure.string(params.blobId),
          tx.pure.vector('u8', []), // empty encrypted_key
          tx.pure.string(params.fileType),
          tx.pure.u64(params.durationSeconds),
          tx.pure.u64(params.fileSizeBytes),
          tx.pure.string(params.description),
          params.teaserBlobId
            ? tx.pure.option('string', params.teaserBlobId)
            : tx.pure.option('string', null),
        ],
      });
      tx.transferObjects([intel!], tx.pure.address(account.address));

      const result = await dAppKit.signAndExecuteTransaction({
        transaction: tx,
      });

      if (result.$kind === 'FailedTransaction') {
        throw new Error('Mint transaction failed');
      }

      // Extract created object ID from effects
      const created = result.Transaction.effects.changedObjects.filter(
        (obj) => obj.idOperation === 'Created' && obj.outputState === 'ObjectWrite',
      );
      if (created.length === 0) {
        throw new Error('No object created in mint transaction');
      }
      const intelObjectId = created[0]!.objectId;

      return { intelObjectId, digest: result.Transaction.digest };
    },
    [account, dAppKit],
  );

  /** TX2: Update encrypted key + list in one PTB. */
  const updateKeyAndList = useCallback(
    async (params: {
      intelObjectId: string;
      encryptedKey: Uint8Array;
      priceBaseUnits: bigint;
    }): Promise<string> => {
      if (!account) throw new Error('Wallet not connected');

      const tx = new Transaction();

      // Step 1: Update encrypted key (mutable borrow)
      tx.moveCall({
        target: `${PACKAGE_ID}::intel_object::update_encrypted_key`,
        arguments: [
          tx.object(params.intelObjectId),
          tx.pure.vector('u8', Array.from(params.encryptedKey)),
        ],
      });

      // Step 2: List on marketplace (consumes IntelObject by value)
      tx.moveCall({
        target: `${PACKAGE_ID}::marketplace::list`,
        arguments: [
          tx.object(params.intelObjectId),
          tx.pure.u64(params.priceBaseUnits),
        ],
      });

      const result = await dAppKit.signAndExecuteTransaction({
        transaction: tx,
      });
      if (result.$kind === 'FailedTransaction') {
        throw new Error('Update key and list transaction failed');
      }
      return result.Transaction.digest;
    },
    [account, dAppKit],
  );

  /** Purchase a listing — spends EVE coin objects, not gas. */
  const purchase = useCallback(
    async (listingId: string, priceBaseUnits: bigint): Promise<string> => {
      if (!account) throw new Error('Wallet not connected');

      const rpcClient = suiClient as unknown as SuiJsonRpcClient;
      const eveCoins = await fetchEveCoins(rpcClient, account.address);
      if (eveCoins.length === 0) {
        throw new Error('No EVE coins found. You need EVE to purchase intel.');
      }

      const totalEve = eveCoins.reduce((s, c) => s + BigInt(c.balance), 0n);
      if (totalEve < priceBaseUnits) {
        throw new Error(
          `Insufficient EVE balance. Need ${priceBaseUnits} base units but have ${totalEve}.`,
        );
      }

      const tx = new Transaction();

      // Build a single EVE coin with sufficient balance
      const primaryCoin = tx.object(eveCoins[0]!.coinObjectId);
      if (eveCoins.length > 1) {
        tx.mergeCoins(
          primaryCoin,
          eveCoins.slice(1).map((c) => tx.object(c.coinObjectId)),
        );
      }

      // Split exact payment amount from the merged EVE coin
      const [payment] = tx.splitCoins(primaryCoin, [tx.pure.u64(priceBaseUnits)]);

      const [intel] = tx.moveCall({
        target: `${PACKAGE_ID}::marketplace::purchase`,
        typeArguments: [SETTLEMENT_COIN_TYPE],
        arguments: [tx.object(listingId), payment!],
      });
      tx.transferObjects([intel!], tx.pure.address(account.address));

      const result = await dAppKit.signAndExecuteTransaction({
        transaction: tx,
      });
      if (result.$kind === 'FailedTransaction') {
        throw new Error('Purchase transaction failed');
      }
      return result.Transaction.digest;
    },
    [account, dAppKit, suiClient],
  );

  /** Query active listings (shared Listing objects with intel still present). */
  const getListings = useCallback(async () => {
    const rpcClient = suiClient as unknown as SuiJsonRpcClient;
    return queryActiveListings(rpcClient);
  }, [suiClient]);

  /** Query IntelObjects owned by the current wallet. */
  const getOwnedIntel = useCallback(async () => {
    if (!account) return [];
    const rpcClient = suiClient as unknown as SuiJsonRpcClient;
    const result = await rpcClient.getOwnedObjects({
      owner: account.address,
      filter: { StructType: `${PACKAGE_ID}::intel_object::IntelObject` },
      options: { showContent: true },
    });
    return result.data
      .map((item) => {
        const content = item.data?.content;
        if (!content || content.dataType !== 'moveObject') return null;
        const fields = (content as { dataType: string; fields: Record<string, unknown> }).fields;
        return {
          id: item.data!.objectId,
          blobId: fields['blob_id'] as string,
          encryptedKey: fields['encrypted_key'] as number[],
          fileType: fields['file_type'] as string,
          durationSeconds: Number(fields['duration_seconds']),
          fileSizeBytes: Number(fields['file_size_bytes']),
          description: fields['description'] as string,
          creator: fields['creator'] as string,
          teaserBlobId: parseOptionString(fields['teaser_blob_id']),
        };
      })
      .filter(Boolean) as IntelObjectData[];
  }, [account, suiClient]);

  return { mintIntel, updateKeyAndList, purchase, getListings, getOwnedIntel };
}

export interface IntelObjectData {
  id: string;
  blobId: string;
  encryptedKey: number[];
  fileType: string;
  durationSeconds: number;
  fileSizeBytes: number;
  description: string;
  creator: string;
  teaserBlobId: string | null;
}

export interface ListingData {
  id: string;
  price: bigint;
  seller: string;
  intel: IntelObjectData | null;
}

/** Query active listings by fetching ListingCreatedEvents then loading objects. */
async function queryActiveListings(
  rpcClient: SuiJsonRpcClient,
): Promise<ListingData[]> {
  const events = await rpcClient.queryEvents({
    query: { MoveEventType: `${PACKAGE_ID}::marketplace::ListingCreatedEvent` },
    order: 'descending',
    limit: 50,
  });

  const listings: ListingData[] = [];
  for (const ev of events.data) {
    const parsed = ev.parsedJson as { listing_id: string };
    const listingId = parsed.listing_id;
    try {
      const obj = await rpcClient.getObject({
        id: listingId,
        options: { showContent: true },
      });
      if (!obj.data?.content || obj.data.content.dataType !== 'moveObject') continue;
      const fields = obj.data.content.fields as Record<string, unknown>;
      const intelField = fields['intel'] as { fields?: Record<string, unknown> } | null;

      // Skip sold listings
      if (!intelField?.fields) continue;

      const intelFields = intelField.fields;
      listings.push({
        id: listingId,
        price: BigInt(fields['price'] as string),
        seller: fields['seller'] as string,
        intel: {
          id: (intelFields['id'] as { id: string })?.id ?? '',
          blobId: intelFields['blob_id'] as string,
          encryptedKey: intelFields['encrypted_key'] as number[],
          fileType: intelFields['file_type'] as string,
          durationSeconds: Number(intelFields['duration_seconds']),
          fileSizeBytes: Number(intelFields['file_size_bytes']),
          description: intelFields['description'] as string,
          creator: intelFields['creator'] as string,
          teaserBlobId: parseOptionString(intelFields['teaser_blob_id']),
        },
      });
    } catch {
      // Skip objects that can't be fetched (deleted, etc.)
    }
  }
  return listings;
}
