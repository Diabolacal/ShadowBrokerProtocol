import { shortenAddress, formatPrice } from '../utils/format';
import type { ListingData } from '../hooks/useMarketplace';

interface ListingCardProps {
  listing: ListingData;
  sellerName: string | null;
  onPlayTeaser: (blobId: string) => void;
  onPurchase: (listingId: string, price: bigint) => void;
  teaserPlaying: boolean;
  teaserLoading: boolean;
  purchasing: boolean;
  isSelf: boolean;
}

export function ListingCard({
  listing,
  sellerName,
  onPlayTeaser,
  onPurchase,
  teaserPlaying,
  teaserLoading,
  purchasing,
  isSelf,
}: ListingCardProps) {
  const intel = listing.intel;
  if (!intel) return null;

  const hasTeaser = !!intel.teaserBlobId;
  const isActive = teaserPlaying || teaserLoading;

  return (
    <div
      className={`bg-broker-panel border rounded-lg overflow-hidden flex flex-col transition-colors ${
        isActive ? 'border-broker-accent/40 glow-accent' : 'border-broker-border'
      }`}
    >
      {/* Body */}
      <div className="px-5 pt-5 pb-4 flex flex-col gap-3 flex-1">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-sm font-medium text-gray-200 leading-snug flex-1">
            {intel.description || 'Classified Intel'}
          </h3>
          <div className="text-right shrink-0">
            <span className="text-broker-accent font-mono font-bold text-sm">
              {formatPrice(listing.price).lux}
            </span>
            <span className="block text-[10px] font-mono text-broker-muted">
              {formatPrice(listing.price).eve}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-[11px] font-mono text-broker-muted">
          <span>{intel.durationSeconds}s</span>
          <span className="text-broker-border">·</span>
          <span>{(intel.fileSizeBytes / 1024).toFixed(0)} KB</span>
          <span className="text-broker-border">·</span>
          <span>{intel.fileType.split('/')[1]?.toUpperCase() ?? intel.fileType}</span>
          <span className="ml-auto truncate max-w-[120px]" title={listing.seller}>
            {sellerName || shortenAddress(listing.seller)}
          </span>
        </div>

        {/* Teaser preview */}
        {hasTeaser && (
          <button
            onClick={() => onPlayTeaser(intel.teaserBlobId!)}
            disabled={teaserLoading}
            className={`w-full flex items-center justify-center gap-2 py-2 rounded text-xs font-mono transition-all ${
              teaserPlaying
                ? 'bg-broker-accent-subtle border border-broker-accent/30 text-broker-accent'
                : 'border border-broker-border text-broker-muted-light hover:border-broker-border-light hover:text-gray-200'
            } disabled:opacity-50`}
          >
            {teaserLoading ? (
              <span>Buffering…</span>
            ) : teaserPlaying ? (
              <>
                <span className="inline-flex gap-[2px] items-end">
                  {[1, 2, 3, 4].map((i) => (
                    <span
                      key={i}
                      className="inline-block w-[2px] bg-broker-accent rounded-full animate-pulse"
                      style={{ height: `${6 + (i % 3) * 3}px`, animationDelay: `${i * 0.12}s` }}
                    />
                  ))}
                </span>
                <span>Playing Preview</span>
              </>
            ) : (
              <>
                <span>▶</span>
                <span>Play Preview</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Footer */}
      <div className="px-5 py-3 border-t border-broker-border flex items-center justify-end">
        {!isSelf && (
          <button
            onClick={() => onPurchase(listing.id, listing.price)}
            disabled={purchasing}
            className="bg-broker-accent hover:bg-broker-accent-dim text-white text-xs font-bold font-mono tracking-wider py-2 px-5 rounded transition-colors disabled:opacity-50"
          >
            {purchasing ? 'Processing…' : 'Purchase'}
          </button>
        )}
        {isSelf && (
          <span className="label-muted">Your Listing</span>
        )}
      </div>
    </div>
  );
}
