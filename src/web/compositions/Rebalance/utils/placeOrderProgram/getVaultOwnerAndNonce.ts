import { DEX_PID } from "@sb/dexUtils/config";
import { PublicKey } from "@solana/web3.js";
import BN from "bn.js";

export async function getVaultOwnerAndNonce(marketPublicKey: PublicKey, dexProgramId = DEX_PID) {
  const nonce = new BN(0);
  while (nonce.toNumber() < 255) {
    try {
      const vaultOwner = await PublicKey.createProgramAddress(
        [marketPublicKey.toBuffer(), nonce.toArrayLike(Buffer, "le", 8)],
        dexProgramId
      );
      return [vaultOwner, nonce];
    } catch (e) {
      nonce.iaddn(1);
    }
  }
  throw new Error("Unable to find nonce");
}
