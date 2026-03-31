import { useCallback, useEffect, useMemo, useState } from 'react';
import { useCurrentAccount } from '@mysten/dapp-kit-react';
import { useMarketplace, type IntelObjectData } from '../hooks/useMarketplace';
import { useSeal } from '../hooks/useSeal';
import { useWalrus } from '../hooks/useWalrus';
import { useAudioPlayer } from '../hooks/useAudioPlayer';
import { aesDecrypt } from '../utils/crypto';
import { IntelCard } from '../components/IntelCard';
import { useSellerNames } from '../hooks/usePlayerIdentity';

const DISMISSED_KEY = 'sb_dismissed_intel';

function getDismissedIds(): Set<string> {
  try {
    const raw = localStorage.getItem(DISMISSED_KEY);
    return raw ? new Set(JSON.parse(raw) as string[]) : new Set();
  } catch {
    return new Set();
  }
}

function persistDismissedIds(ids: Set<string>) {
  localStorage.setItem(DISMISSED_KEY, JSON.stringify([...ids]));
}

export function MyIntelPage() {
  const account = useCurrentAccount();
  const { getOwnedIntel } = useMarketplace();
  const { decryptKey } = useSeal();
  const { download } = useWalrus();
  const { playBytes, playing } = useAudioPlayer();

  const [items, setItems] = useState<IntelObjectData[]>([]);
  const [loading, setLoading] = useState(false);
  const [decrypting, setDecrypting] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Resolve creator addresses to player names
  const creatorAddresses = useMemo(
    () => items.map((i) => i.creator).filter(Boolean),
    [items],
  );
  const creatorNames = useSellerNames(creatorAddresses);

  // Client-side dismiss for demo cleanup (localStorage-backed)
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(() => getDismissedIds());
  const [showDismissed, setShowDismissed] = useState(false);

  const visibleItems = useMemo(() => {
    if (showDismissed) return items;
    return items.filter((i) => !dismissedIds.has(i.id));
  }, [items, dismissedIds, showDismissed]);

  const dismissedCount = useMemo(
    () => items.filter((i) => dismissedIds.has(i.id)).length,
    [items, dismissedIds],
  );

  const handleDismiss = useCallback((intelId: string) => {
    setDismissedIds((prev) => {
      const next = new Set(prev);
      next.add(intelId);
      persistDismissedIds(next);
      return next;
    });
  }, []);

  const handleRestoreAll = useCallback(() => {
    setDismissedIds(new Set());
    persistDismissedIds(new Set());
    setShowDismissed(false);
  }, []);

  const refresh = useCallback(async () => {
    if (!account) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getOwnedIntel();
      setItems(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load intel');
    } finally {
      setLoading(false);
    }
  }, [account, getOwnedIntel]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const handleDecrypt = useCallback(
    async (intel: IntelObjectData) => {
      setDecrypting(intel.id);
      setError(null);
      try {
        // 1. Seal decrypt the AES key
        const encryptedKey = new Uint8Array(intel.encryptedKey);
        let aesKey: Uint8Array;
        try {
          aesKey = await decryptKey(encryptedKey, intel.id);
        } catch (e) {
          throw new Error(`Seal key decryption failed: ${e instanceof Error ? e.message : e}`);
        }

        // 2. Download encrypted blob from Walrus
        let encryptedBlob: Uint8Array;
        try {
          encryptedBlob = await download(intel.blobId);
        } catch (e) {
          throw new Error(`Walrus blob download failed: ${e instanceof Error ? e.message : e}`);
        }

        // 3. AES decrypt the audio
        let audioBytes: Uint8Array;
        try {
          audioBytes = await aesDecrypt(encryptedBlob, aesKey);
        } catch (e) {
          throw new Error(`AES audio decryption failed: ${e instanceof Error ? e.message : e}`);
        }

        // 4. Play the audio
        playBytes(audioBytes, intel.fileType);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Decryption failed');
      } finally {
        setDecrypting(null);
      }
    },
    [decryptKey, download, playBytes],
  );

  if (!account) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-8">
        <h1 className="text-base font-mono font-bold text-gray-100 mb-4">My Intel</h1>
        <p className="text-broker-muted text-sm font-mono">Connect your wallet to view your intel.</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-baseline gap-3">
          <h1 className="text-base font-mono font-bold text-gray-100">My Intel</h1>
          {visibleItems.length > 0 && (
            <span className="text-[11px] font-mono text-broker-muted">{visibleItems.length} items</span>
          )}
        </div>
        <div className="flex items-center gap-3">
          {dismissedCount > 0 && (
            <>
              <button
                onClick={() => setShowDismissed((v) => !v)}
                className="text-[11px] font-mono text-broker-muted-light hover:text-gray-200 transition-colors"
              >
                {showDismissed ? 'Hide dismissed' : `${dismissedCount} hidden`}
              </button>
              <button
                onClick={handleRestoreAll}
                className="text-[11px] font-mono text-broker-muted-light hover:text-gray-200 transition-colors"
              >
                Restore all
              </button>
            </>
          )}
          <button
            onClick={refresh}
            disabled={loading}
            className="text-[11px] font-mono text-broker-muted-light hover:text-gray-200 transition-colors"
          >
            {loading ? 'Scanning…' : 'Refresh'}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-broker-danger/10 border border-broker-danger/30 text-red-400 text-xs font-mono p-3 rounded mb-5">
          {error}
        </div>
      )}

      {playing && (
        <div className="bg-broker-accent-subtle border border-broker-accent/20 text-broker-accent text-xs font-mono p-3 rounded mb-5 flex items-center gap-2">
          <span className="inline-flex gap-[2px]">
            {[1, 2, 3].map((i) => (
              <span
                key={i}
                className="inline-block w-[2px] bg-broker-accent rounded-full animate-pulse"
                style={{ height: `${6 + (i % 3) * 3}px`, animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </span>
          Audio playing…
        </div>
      )}

      {visibleItems.length === 0 && !loading && (
        <p className="text-broker-muted text-sm font-mono">
          No intel found. Purchase intel from the marketplace or upload your own.
        </p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {visibleItems.map((intel) => (
          <IntelCard
            key={intel.id}
            intel={intel}
            onDecrypt={handleDecrypt}
            decrypting={decrypting === intel.id}
            creatorName={creatorNames[intel.creator] ?? null}
            onDismiss={handleDismiss}
          />
        ))}
      </div>
    </div>
  );
}
