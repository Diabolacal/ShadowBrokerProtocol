import { useState, useRef, useEffect, useCallback } from 'react';
import { ConnectButton, useCurrentAccount, useDAppKit } from '@mysten/dapp-kit-react';
import { usePlayerIdentity } from '../hooks/usePlayerIdentity';

function shortenAddress(addr: string): string {
  if (addr.length <= 10) return addr;
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

export function WalletControl() {
  const account = useCurrentAccount();
  const dAppKit = useDAppKit();
  const { characterName, isLoading } = usePlayerIdentity();
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onMouseDown(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', onMouseDown);
    return () => document.removeEventListener('mousedown', onMouseDown);
  }, []);

  const handleCopy = useCallback(async () => {
    if (!account?.address) return;
    await navigator.clipboard.writeText(account.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }, [account?.address]);

  const handleDisconnect = useCallback(async () => {
    setOpen(false);
    await dAppKit.disconnectWallet();
  }, [dAppKit]);

  if (!account) {
    return <ConnectButton />;
  }

  const displayName = isLoading
    ? '···'
    : characterName || shortenAddress(account.address);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 h-8 px-3 text-xs font-mono text-gray-300 bg-broker-panel border border-broker-border rounded hover:border-broker-border-light hover:text-gray-200 transition-colors"
      >
        <span className="tracking-wide max-w-[140px] truncate">{displayName}</span>
        <span
          className={`text-[8px] text-broker-muted transition-transform duration-150 ${open ? 'rotate-180' : ''}`}
        >
          ▾
        </span>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 w-52 bg-broker-panel border border-broker-border rounded shadow-lg z-50">
          {characterName && (
            <div className="px-3 py-2 border-b border-broker-border">
              <div className="text-[10px] font-mono text-broker-muted mb-0.5">Character</div>
              <div className="text-xs font-mono text-gray-200 truncate">{characterName}</div>
            </div>
          )}
          <div className="px-3 py-2 border-b border-broker-border">
            <div className="text-[10px] font-mono text-broker-muted mb-0.5">Wallet</div>
            <button
              onClick={handleCopy}
              className="flex items-center gap-2 text-xs font-mono text-broker-muted-light hover:text-gray-200 transition-colors w-full text-left"
            >
              <span className="truncate">{shortenAddress(account.address)}</span>
              <span className="text-[10px] shrink-0">{copied ? '✓' : '⎘'}</span>
            </button>
          </div>
          <button
            onClick={handleDisconnect}
            className="flex items-center gap-2 w-full px-3 py-2 text-xs font-mono text-broker-muted hover:text-gray-200 hover:bg-broker-bg transition-colors rounded-b"
          >
            <span className="text-[10px]">⏻</span>
            Disconnect
          </button>
        </div>
      )}
    </div>
  );
}
