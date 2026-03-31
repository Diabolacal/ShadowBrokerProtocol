import { Signer } from '@mysten/sui/cryptography';
import type { PublicKey, SignatureScheme } from '@mysten/sui/cryptography';

/**
 * Walrus-compatible signer that bypasses the broken getPublicKey() chain
 * in CurrentAccountSigner. Returns the wallet address directly for
 * toSuiAddress() and delegates transaction execution to dAppKit.
 */
export class WalrusSigner extends Signer {
  #address: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  #signAndExecute: (args: any) => Promise<any>;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(address: string, signAndExecute: (args: any) => Promise<any>) {
    super();
    this.#address = address;
    this.#signAndExecute = signAndExecute;
  }

  override toSuiAddress(): string {
    return this.#address;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  override async signAndExecuteTransaction(args: any): Promise<any> {
    return this.#signAndExecute(args);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async sign(_bytes: Uint8Array): Promise<any> {
    throw new Error('WalrusSigner: raw sign() not supported');
  }

  getKeyScheme(): SignatureScheme {
    throw new Error('WalrusSigner: getKeyScheme() not supported');
  }

  getPublicKey(): PublicKey {
    throw new Error('WalrusSigner: getPublicKey() not supported');
  }
}
