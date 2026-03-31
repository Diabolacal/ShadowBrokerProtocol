import { useCallback, useMemo } from 'react';
import { SealClient, SessionKey } from '@mysten/seal';
import { useCurrentClient, useCurrentAccount, useDAppKit } from '@mysten/dapp-kit-react';
import { Transaction } from '@mysten/sui/transactions';
import { normalizeSuiAddress } from '@mysten/sui/utils';
import { PACKAGE_ID, SEAL_KEY_SERVERS } from '../utils/config';

/** Hook for Seal encrypt/decrypt operations. */
export function useSeal() {
  const suiClient = useCurrentClient();
  const account = useCurrentAccount();
  const dAppKit = useDAppKit();

  const sealClient = useMemo(
    () =>
      new SealClient({
        suiClient,
        serverConfigs: SEAL_KEY_SERVERS,
        verifyKeyServers: false,
      }),
    [suiClient],
  );

  /** Seal-encrypt an AES key using the IntelObject ID as policy anchor. */
  const encryptKey = useCallback(
    async (aesKey: Uint8Array, intelObjectId: string): Promise<Uint8Array> => {
      // Seal expects the ID as hex bytes without 0x prefix
      const idHex = intelObjectId.startsWith('0x')
        ? intelObjectId.slice(2)
        : intelObjectId;

      const { encryptedObject } = await sealClient.encrypt({
        threshold: 2,
        packageId: PACKAGE_ID,
        id: idHex,
        data: aesKey,
      });
      return encryptedObject;
    },
    [sealClient],
  );

  /** Seal-decrypt an encrypted AES key. Caller must own the IntelObject. */
  const decryptKey = useCallback(
    async (encryptedKey: Uint8Array, intelObjectId: string): Promise<Uint8Array> => {
      if (!account) throw new Error('Wallet not connected');

      // Build the seal_approve PTB for key server verification
      const tx = new Transaction();
      const idHex = intelObjectId.startsWith('0x')
        ? intelObjectId.slice(2)
        : intelObjectId;
      const idBytes = Array.from(hexToBytes(idHex));

      tx.moveCall({
        target: `${PACKAGE_ID}::intel_object::seal_approve`,
        arguments: [
          tx.pure.vector('u8', idBytes),
          tx.object(intelObjectId),
        ],
      });

      // CRITICAL: must use onlyTransactionKind: true per validation evidence
      const txBytes = await tx.build({
        client: suiClient,
        onlyTransactionKind: true,
      });

      // Normalize address for consistent comparison during signature verification.
      // Seal's verifyPersonalMessageSignature uses strict === against the address
      // derived from the public key (or zkLogin identifier).
      const normalizedAddress = normalizeSuiAddress(account.address);

      // Create session key (without signer — we use the manual signing path
      // which supports all wallet types including zkLogin/EveVault)
      const sessionKey = await SessionKey.create({
        address: normalizedAddress,
        packageId: PACKAGE_ID,
        ttlMin: 10,
        suiClient,
      });

      // Sign the session key personal message with the connected wallet
      const personalMessage = sessionKey.getPersonalMessage();
      let signature: string;
      try {
        const result = await dAppKit.signPersonalMessage({
          message: personalMessage,
        });
        signature = result.signature;
      } catch (e) {
        throw new Error(`Wallet refused to sign Seal session key: ${e instanceof Error ? e.message : e}`);
      }

      // Try the standard setPersonalMessageSignature first (works for Ed25519/Secp wallets).
      // Falls back to export/import bypass for zkLogin wallets, where the client-side
      // verifyPersonalMessageSignature RPC check fails but the Seal key servers can
      // verify the signature independently.
      let activeSessionKey = sessionKey;
      let usedBypass = false;
      try {
        await sessionKey.setPersonalMessageSignature(signature);
      } catch {
        // Bypass client-side verification via export/import.
        // SessionKey.import() sets #personalMessageSignature directly without
        // calling verifyPersonalMessageSignature.
        usedBypass = true;
        const exported = sessionKey.export();
        exported.personalMessageSignature = signature;
        activeSessionKey = SessionKey.import(exported, suiClient);
      }

      console.log('[useSeal] decrypt config:', {
        address: normalizedAddress,
        usedBypass,
        packageId: PACKAGE_ID,
        intelObjectId,
      });

      try {
        return await sealClient.decrypt({
          data: encryptedKey,
          sessionKey: activeSessionKey,
          txBytes,
        });
      } catch (e: unknown) {
        const errName = (e as { constructor?: { name?: string } })?.constructor?.name ?? 'Unknown';
        const errMsg = e instanceof Error ? e.message : String(e);
        const requestId = (e as { requestId?: string })?.requestId;
        const status = (e as { status?: number })?.status;
        console.error('[useSeal] Seal decrypt error:', { type: errName, message: errMsg, requestId, status, usedBypass }, e);
        throw new Error(`Seal decrypt [${errName}]: ${errMsg}`);
      }
    },
    [account, dAppKit, sealClient, suiClient],
  );

  return { sealClient, encryptKey, decryptKey };
}

function hexToBytes(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16);
  }
  return bytes;
}
