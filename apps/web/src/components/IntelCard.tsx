import type { IntelObjectData } from '../hooks/useMarketplace';

function shortenAddress(addr: string): string {
  if (addr.length <= 12) return addr;
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

interface IntelCardProps {
  intel: IntelObjectData;
  onDecrypt: (intel: IntelObjectData) => void;
  decrypting: boolean;
  creatorName?: string | null;
  onDismiss?: (intelId: string) => void;
}

export function IntelCard({ intel, onDecrypt, decrypting, creatorName, onDismiss }: IntelCardProps) {
  const hasKey = intel.encryptedKey.length > 0;
  const sourceLabel = creatorName || shortenAddress(intel.creator);

  return (
    <div className="bg-broker-panel border border-broker-border rounded-lg overflow-hidden flex flex-col">
      <div className="px-5 pt-5 pb-4 flex flex-col gap-3 flex-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-sm font-medium text-gray-200 leading-snug flex-1">
            {intel.description || 'Classified Intel'}
          </h3>
          <span className="label-muted shrink-0">
            {hasKey ? 'Acquired' : 'Pending'}
          </span>
        </div>

        <div className="flex items-center gap-2 text-[11px] font-mono text-broker-muted">
          <span className="truncate max-w-[120px]" title={intel.creator}>
            Source: {sourceLabel}
          </span>
        </div>

        <div className="flex items-center gap-2 text-[11px] font-mono text-broker-muted">
          <span>{intel.durationSeconds}s</span>
          <span className="text-broker-border">·</span>
          <span>{(intel.fileSizeBytes / 1024).toFixed(0)} KB</span>
          <span className="text-broker-border">·</span>
          <span>{intel.fileType.split('/')[1]?.toUpperCase() ?? intel.fileType}</span>
        </div>
      </div>

      <div className="px-5 py-4 border-t border-broker-border flex gap-2">
        <button
          onClick={() => onDecrypt(intel)}
          disabled={decrypting || !hasKey}
          className="flex-1 bg-broker-accent hover:bg-broker-accent-dim text-white text-xs font-bold font-mono tracking-wider py-2.5 rounded transition-colors disabled:opacity-40"
        >
          {decrypting ? 'Decrypting…' : 'Decrypt & Play'}
        </button>
        {onDismiss && (
          <button
            onClick={() => onDismiss(intel.id)}
            title="Hide from view"
            className="px-3 py-2.5 text-broker-muted hover:text-red-400 text-xs font-mono rounded border border-broker-border hover:border-red-400/30 transition-colors"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
}
