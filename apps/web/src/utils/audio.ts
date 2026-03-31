/** Audio teaser extraction — crop first 2 seconds and encode as WAV. */

const TEASER_DURATION = 2; // seconds

/** Extract first 2 seconds of audio as a WAV Uint8Array. */
export async function extractTeaser(file: File): Promise<Uint8Array> {
  const arrayBuffer = await file.arrayBuffer();
  const audioCtx = new AudioContext();
  const decoded = await audioCtx.decodeAudioData(arrayBuffer);

  const sampleRate = decoded.sampleRate;
  const channels = decoded.numberOfChannels;
  const teaserLength = Math.min(
    Math.floor(sampleRate * TEASER_DURATION),
    decoded.length,
  );

  const teaserBuffer = audioCtx.createBuffer(channels, teaserLength, sampleRate);
  for (let ch = 0; ch < channels; ch++) {
    const src = decoded.getChannelData(ch);
    const dst = teaserBuffer.getChannelData(ch);
    for (let i = 0; i < teaserLength; i++) {
      dst[i] = src[i]!;
    }
  }

  await audioCtx.close();
  return encodeWav(teaserBuffer);
}

/** Get audio duration in seconds from a File. */
export async function getAudioDuration(file: File): Promise<number> {
  const arrayBuffer = await file.arrayBuffer();
  const audioCtx = new AudioContext();
  const decoded = await audioCtx.decodeAudioData(arrayBuffer);
  const duration = decoded.duration;
  await audioCtx.close();
  return Math.round(duration);
}

/** Encode an AudioBuffer to WAV format. */
function encodeWav(buffer: AudioBuffer): Uint8Array {
  const numChannels = buffer.numberOfChannels;
  const sampleRate = buffer.sampleRate;
  const bitsPerSample = 16;
  const bytesPerSample = bitsPerSample / 8;
  const blockAlign = numChannels * bytesPerSample;
  const dataLength = buffer.length * blockAlign;
  const headerLength = 44;
  const totalLength = headerLength + dataLength;

  const out = new ArrayBuffer(totalLength);
  const view = new DataView(out);

  // RIFF header
  writeString(view, 0, 'RIFF');
  view.setUint32(4, totalLength - 8, true);
  writeString(view, 8, 'WAVE');

  // fmt chunk
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true); // chunk size
  view.setUint16(20, 1, true); // PCM
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * blockAlign, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitsPerSample, true);

  // data chunk
  writeString(view, 36, 'data');
  view.setUint32(40, dataLength, true);

  // Interleave channel data
  const channels: Float32Array[] = [];
  for (let ch = 0; ch < numChannels; ch++) {
    channels.push(buffer.getChannelData(ch));
  }

  let offset = headerLength;
  for (let i = 0; i < buffer.length; i++) {
    for (let ch = 0; ch < numChannels; ch++) {
      const sample = Math.max(-1, Math.min(1, channels[ch]![i]!));
      view.setInt16(offset, sample * 0x7fff, true);
      offset += 2;
    }
  }

  return new Uint8Array(out);
}

function writeString(view: DataView, offset: number, str: string): void {
  for (let i = 0; i < str.length; i++) {
    view.setUint8(offset + i, str.charCodeAt(i));
  }
}
