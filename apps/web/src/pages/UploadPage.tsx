import { useCallback, useState, type ChangeEvent } from 'react';
import { useCurrentAccount } from '@mysten/dapp-kit-react';
import { useMarketplace } from '../hooks/useMarketplace';
import { useWalrus } from '../hooks/useWalrus';
import { useSeal } from '../hooks/useSeal';
import { generateAesKey, aesEncrypt } from '../utils/crypto';
import { extractTeaser, getAudioDuration } from '../utils/audio';
import { luxToBaseUnits, luxToEve } from '../utils/format';
import { WalrusSigner } from '../utils/walrusSigner';
import { useDAppKit } from '@mysten/dapp-kit-react';

type UploadStep =
  | 'idle'
  | 'extracting'
  | 'encrypting'
  | 'uploading-teaser'
  | 'uploading-blob'
  | 'minting'
  | 'seal-encrypting'
  | 'listing'
  | 'done'
  | 'error';

export function UploadPage() {
  const account = useCurrentAccount();
  const dAppKit = useDAppKit();
  const { mintIntel, updateKeyAndList } = useMarketplace();
  const { upload } = useWalrus();
  const { encryptKey } = useSeal();

  const [file, setFile] = useState<File | null>(null);
  const [description, setDescription] = useState('');
  const [priceLux, setPriceLux] = useState('50');
  const [step, setStep] = useState<UploadStep>('idle');
  const [error, setError] = useState<string | null>(null);
  const [resultDigest, setResultDigest] = useState<string | null>(null);

  const handleFileChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] ?? null;
    setFile(selected);
    setStep('idle');
    setError(null);
    setResultDigest(null);
  }, []);

  const handleUpload = useCallback(async () => {
    if (!file || !account) return;

    setError(null);
    const signer = new WalrusSigner(
      account.address,
      (args) => dAppKit.signAndExecuteTransaction(args),
    );

    try {
      // 1. Extract teaser
      setStep('extracting');
      let teaserBytes: Uint8Array;
      let duration: number;
      let fileBytes: Uint8Array;
      try {
        teaserBytes = await extractTeaser(file);
        duration = await getAudioDuration(file);
        fileBytes = new Uint8Array(await file.arrayBuffer());
      } catch (e) {
        throw new Error(`Teaser extraction failed: ${e instanceof Error ? e.message : e}`);
      }

      // 2. AES encrypt full audio
      setStep('encrypting');
      let aesKey: Uint8Array;
      let encryptedAudio: Uint8Array;
      try {
        aesKey = await generateAesKey();
        encryptedAudio = await aesEncrypt(fileBytes, aesKey);
      } catch (e) {
        throw new Error(`AES encryption failed: ${e instanceof Error ? e.message : e}`);
      }

      // 3. Upload teaser to Walrus
      setStep('uploading-teaser');
      let teaserBlobId: string;
      try {
        teaserBlobId = await upload(teaserBytes, signer);
      } catch (e) {
        throw new Error(`Teaser upload failed: ${e instanceof Error ? e.message : e}`);
      }

      // 4. Upload encrypted blob to Walrus
      setStep('uploading-blob');
      let blobId: string;
      try {
        blobId = await upload(encryptedAudio, signer);
      } catch (e) {
        throw new Error(`Encrypted audio upload failed: ${e instanceof Error ? e.message : e}`);
      }

      // 5. TX1: Mint IntelObject
      setStep('minting');
      let intelObjectId: string;
      try {
        ({ intelObjectId } = await mintIntel({
          blobId,
          fileType: file.type || 'audio/mpeg',
          durationSeconds: duration,
          fileSizeBytes: fileBytes.length,
          description: description || 'Classified intelligence',
          teaserBlobId,
        }));
      } catch (e) {
        throw new Error(`Mint transaction failed: ${e instanceof Error ? e.message : e}`);
      }

      // 6. Seal encrypt AES key using IntelObject ID
      setStep('seal-encrypting');
      let encryptedSealKey: Uint8Array;
      try {
        encryptedSealKey = await encryptKey(aesKey, intelObjectId);
      } catch (e) {
        throw new Error(`Seal encryption failed: ${e instanceof Error ? e.message : e}`);
      }

      // 7. TX2: Update key + list
      setStep('listing');
      const priceBaseUnits = luxToBaseUnits(parseFloat(priceLux));
      let digest: string;
      try {
        digest = await updateKeyAndList({
          intelObjectId,
          encryptedKey: encryptedSealKey,
          priceBaseUnits,
        });
      } catch (e) {
        throw new Error(`List transaction failed: ${e instanceof Error ? e.message : e}`);
      }

      setResultDigest(digest);
      setStep('done');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Upload failed');
      setStep('error');
    }
  }, [file, account, dAppKit, description, priceLux, upload, mintIntel, encryptKey, updateKeyAndList]);

  if (!account) {
    return (
      <div className="max-w-lg mx-auto px-6 py-8">
        <h1 className="text-base font-mono font-bold text-gray-100 mb-4">Upload Intel</h1>
        <p className="text-broker-muted text-sm font-mono">Connect your wallet to upload intelligence.</p>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-6 py-8">
      <h1 className="text-base font-mono font-bold text-gray-100 mb-8">Upload Intel</h1>

      <div className="space-y-5">
        <div>
          <label className="block text-[11px] font-mono text-broker-muted mb-2">Audio File</label>
          <input
            type="file"
            accept="audio/*"
            onChange={handleFileChange}
            className="block w-full text-xs font-mono text-broker-muted-light file:mr-4 file:py-2 file:px-4 file:rounded file:border file:border-broker-border file:text-xs file:font-mono file:bg-broker-panel file:text-gray-300 hover:file:bg-broker-panel-light hover:file:border-broker-border-light file:cursor-pointer file:transition-colors"
          />
        </div>

        <div>
          <label className="block text-[11px] font-mono text-broker-muted mb-2">Description</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Fleet movements intercepted near J-1234"
            className="w-full bg-broker-bg border border-broker-border focus:border-broker-accent rounded px-3 py-2.5 text-sm font-mono text-gray-200 placeholder-broker-muted/50 outline-none transition-colors"
          />
        </div>

        <div>
          <label className="block text-[11px] font-mono text-broker-muted mb-2">Price</label>
          <div className="flex items-center gap-3">
            <input
              type="number"
              value={priceLux}
              onChange={(e) => setPriceLux(e.target.value)}
              step="1"
              min="1"
              className="flex-1 bg-broker-bg border border-broker-border focus:border-broker-accent rounded px-3 py-2.5 text-sm font-mono text-gray-200 outline-none transition-colors"
            />
            <span className="text-xs font-mono text-broker-muted">Lux</span>
          </div>
          {priceLux && parseFloat(priceLux) > 0 && (
            <p className="text-[11px] font-mono text-broker-muted mt-1.5">
              ≈ {luxToEve(parseFloat(priceLux)).toLocaleString(undefined, { maximumFractionDigits: 4 })} EVE
            </p>
          )}
        </div>

        <div className="pt-2">
          <button
            onClick={handleUpload}
            disabled={!file || step !== 'idle' && step !== 'error' && step !== 'done'}
            className="w-full bg-broker-accent hover:bg-broker-accent-dim text-white font-bold font-mono tracking-wider py-3 rounded transition-colors disabled:opacity-40"
          >
            {step === 'idle' || step === 'error' || step === 'done'
              ? 'Upload & List'
              : 'Processing…'}
          </button>
        </div>
      </div>

      {step !== 'idle' && (
        <div className="mt-8 space-y-1.5">
          <StepIndicator label="Extract teaser" done={stepIndex(step) > 0} active={step === 'extracting'} />
          <StepIndicator label="AES encrypt audio" done={stepIndex(step) > 1} active={step === 'encrypting'} />
          <StepIndicator label="Upload teaser to Walrus" done={stepIndex(step) > 2} active={step === 'uploading-teaser'} />
          <StepIndicator label="Upload encrypted audio" done={stepIndex(step) > 3} active={step === 'uploading-blob'} />
          <StepIndicator label="Mint IntelObject" done={stepIndex(step) > 4} active={step === 'minting'} />
          <StepIndicator label="Seal encrypt AES key" done={stepIndex(step) > 5} active={step === 'seal-encrypting'} />
          <StepIndicator label="List on marketplace" done={stepIndex(step) > 6} active={step === 'listing'} />
        </div>
      )}

      {error && (
        <div className="mt-6 bg-broker-danger/10 border border-broker-danger/30 text-red-400 text-xs font-mono p-3 rounded">
          {error}
        </div>
      )}

      {step === 'done' && resultDigest && (
        <div className="mt-6 bg-broker-accent-subtle border border-broker-accent/20 text-broker-accent text-xs font-mono p-3 rounded">
          Listed successfully! TX: <span className="text-[10px] text-broker-muted-light">{resultDigest}</span>
        </div>
      )}
    </div>
  );
}

function StepIndicator({ label, done, active }: { label: string; done: boolean; active: boolean }) {
  return (
    <div className={`flex items-center gap-2.5 text-xs font-mono ${active ? 'text-broker-accent' : done ? 'text-broker-muted-light' : 'text-broker-muted/40'}`}>
      <span className="w-3 text-center text-[10px]">{done ? '✓' : active ? '○' : '·'}</span>
      <span>{label}</span>
    </div>
  );
}

function stepIndex(step: UploadStep): number {
  const order: UploadStep[] = [
    'extracting', 'encrypting', 'uploading-teaser', 'uploading-blob',
    'minting', 'seal-encrypting', 'listing', 'done',
  ];
  const idx = order.indexOf(step);
  return idx === -1 ? -1 : idx;
}
