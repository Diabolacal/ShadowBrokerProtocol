/** AES-256-GCM encryption/decryption utilities for browser. */

const IV_LENGTH = 12;
const KEY_LENGTH = 32;

function toArrayBuffer(data: Uint8Array): ArrayBuffer {
  return data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength) as ArrayBuffer;
}

/** Generate a random 256-bit AES key. */
export async function generateAesKey(): Promise<Uint8Array> {
  return crypto.getRandomValues(new Uint8Array(KEY_LENGTH));
}

/** AES-GCM encrypt: returns [12-byte IV | ciphertext]. */
export async function aesEncrypt(
  plaintext: Uint8Array,
  rawKey: Uint8Array,
): Promise<Uint8Array> {
  const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH));
  const key = await crypto.subtle.importKey('raw', toArrayBuffer(rawKey), 'AES-GCM', false, ['encrypt']);
  const ciphertext = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, toArrayBuffer(plaintext));
  const combined = new Uint8Array(IV_LENGTH + ciphertext.byteLength);
  combined.set(iv, 0);
  combined.set(new Uint8Array(ciphertext), IV_LENGTH);
  return combined;
}

/** AES-GCM decrypt: expects [12-byte IV | ciphertext]. */
export async function aesDecrypt(
  combined: Uint8Array,
  rawKey: Uint8Array,
): Promise<Uint8Array> {
  const iv = combined.slice(0, IV_LENGTH);
  const ciphertext = combined.slice(IV_LENGTH);
  const key = await crypto.subtle.importKey('raw', toArrayBuffer(rawKey), 'AES-GCM', false, ['decrypt']);
  const plaintext = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, ciphertext);
  return new Uint8Array(plaintext);
}
