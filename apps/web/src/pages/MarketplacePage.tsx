import { useCallback, useEffect, useState } from 'react';
import { useCurrentAccount } from '@mysten/dapp-kit-react';
import { useMarketplace, type ListingData } from '../hooks/useMarketplace';
import { useSellerNames } from '../hooks/usePlayerIdentity';
import { useAudioPlayer } from '../hooks/useAudioPlayer';
import { ListingCard } from '../components/ListingCard';

export function MarketplacePage() {
  const account = useCurrentAccount();
  const { getListings, purchase } = useMarketplace();
  const { playBlob, stop, playing, loading: teaserLoading } = useAudioPlayer();
  const [listings, setListings] = useState<ListingData[]>([]);
  const [loadingListings, setLoadingListings] = useState(false);
  const [purchasing, setPurchasing] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTeaserId, setActiveTeaserId] = useState<string | null>(null);

  const sellerNames = useSellerNames(listings.map((l) => l.seller));

  const refresh = useCallback(async () => {
    setLoadingListings(true);
    setError(null);
    try {
      const data = await getListings();
      setListings(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load listings');
    } finally {
      setLoadingListings(false);
    }
  }, [getListings]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const handlePlayTeaser = useCallback(
    async (blobId: string) => {
      if (playing && activeTeaserId === blobId) {
        stop();
        setActiveTeaserId(null);
        return;
      }
      setActiveTeaserId(blobId);
      await playBlob(blobId, 'audio/wav');
    },
    [playBlob, stop, playing, activeTeaserId],
  );

  const handlePurchase = useCallback(
    async (listingId: string, price: bigint) => {
      if (!account) {
        setError('Connect your wallet first');
        return;
      }
      setPurchasing(listingId);
      setError(null);
      try {
        const digest = await purchase(listingId, price);
        alert(`Purchase successful! TX: ${digest}`);
        await refresh();
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Purchase failed');
      } finally {
        setPurchasing(null);
      }
    },
    [account, purchase, refresh],
  );

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-baseline gap-3">
          <h1 className="text-base font-mono font-bold text-gray-100">
            Marketplace
          </h1>
          {listings.length > 0 && (
            <span className="text-[11px] font-mono text-broker-muted">
              {listings.length} listing{listings.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>
        <button
          onClick={refresh}
          disabled={loadingListings}
          className="text-[11px] font-mono text-broker-muted-light hover:text-gray-200 transition-colors"
        >
          {loadingListings ? 'Loading…' : 'Refresh'}
        </button>
      </div>

      {error && (
        <div className="bg-broker-danger/10 border border-broker-danger/30 text-red-400 text-xs font-mono p-3 rounded mb-6">
          {error}
        </div>
      )}

      {!account && (
        <p className="text-broker-muted text-sm font-mono">Connect your wallet to browse and purchase intel.</p>
      )}

      {listings.length === 0 && !loadingListings && (
        <p className="text-broker-muted text-sm font-mono">No active listings.</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {listings.map((listing) => (
          <ListingCard
            key={listing.id}
            listing={listing}
            sellerName={sellerNames[listing.seller] ?? null}
            onPlayTeaser={handlePlayTeaser}
            onPurchase={handlePurchase}
            teaserPlaying={playing && activeTeaserId === listing.intel?.teaserBlobId}
            teaserLoading={teaserLoading && activeTeaserId === listing.intel?.teaserBlobId}
            purchasing={purchasing === listing.id}
            isSelf={account?.address === listing.seller}
          />
        ))}
      </div>
    </div>
  );
}
