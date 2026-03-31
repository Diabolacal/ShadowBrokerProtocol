import { useCallback, useRef, useState } from 'react';
import { WalrusClient, TESTNET_WALRUS_PACKAGE_CONFIG } from '@mysten/walrus';
import { useCurrentClient } from '@mysten/dapp-kit-react';
import { WALRUS_NETWORK } from '../utils/config';

/** Hook for uploading/downloading blobs to/from Walrus. */
export function useWalrus() {
  const suiClient = useCurrentClient();
  const [uploading, setUploading] = useState(false);
  const walrusRef = useRef<WalrusClient | null>(null);

  function getWalrus(): WalrusClient {
    if (!walrusRef.current) {
      walrusRef.current = new WalrusClient({
        network: WALRUS_NETWORK,
        suiClient,
        packageConfig: TESTNET_WALRUS_PACKAGE_CONFIG,
      });
    }
    return walrusRef.current;
  }

  const upload = useCallback(
    async (data: Uint8Array, signer: unknown): Promise<string> => {
      setUploading(true);
      try {
        const walrus = getWalrus();
        const result = await walrus.writeBlob({
          blob: data,
          deletable: true,
          epochs: 5,
          signer: signer as Parameters<WalrusClient['writeBlob']>[0]['signer'],
        });
        return result.blobId;
      } finally {
        setUploading(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [suiClient],
  );

  const download = useCallback(
    async (blobId: string): Promise<Uint8Array> => {
      const walrus = getWalrus();
      const blob = await walrus.readBlob({ blobId });
      return new Uint8Array(blob);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [suiClient],
  );

  return { upload, download, uploading };
}
