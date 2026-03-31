import { useCallback, useRef, useState } from 'react';
import { useWalrus } from './useWalrus';

/** Hook for audio playback from Walrus blobs or decrypted bytes. */
export function useAudioPlayer() {
  const { download } = useWalrus();
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setPlaying(false);
  }, []);

  /** Play audio from a Walrus blob ID (e.g., teaser). */
  const playBlob = useCallback(
    async (blobId: string, mimeType = 'audio/wav') => {
      stop();
      setLoading(true);
      try {
        const bytes = await download(blobId);
        playBytes(bytes, mimeType);
      } finally {
        setLoading(false);
      }
    },
    [download, stop],
  );

  /** Play audio from raw bytes (e.g., decrypted full audio). */
  const playBytes = useCallback(
    (bytes: Uint8Array, mimeType = 'audio/wav') => {
      stop();
      const blob = new Blob([bytes as BlobPart], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audioRef.current = audio;
      setPlaying(true);
      audio.play();
      audio.onended = () => {
        URL.revokeObjectURL(url);
        setPlaying(false);
        audioRef.current = null;
      };
    },
    [stop],
  );

  return { playBlob, playBytes, stop, playing, loading };
}
