import { PublicKey } from '@solana/web3.js'
import BN from 'bn.js'

import { DEX_PID } from '@core/config/dex'

export function getVaultOwnerAndNonce(
  marketPublicKey: PublicKey,
  dexProgramId = DEX_PID
): [PublicKey, BN] {
  const nonce = new BN(0)
  while (nonce.toNumber() < 255) {
    try {
      // not actually async - https://github.com/solana-labs/solana-web3.js/blob/03268b698a180ecb14c9a4b5c255d8f1c434e69b/src/publickey.ts#L146
      const vaultOwner = PublicKey.createProgramAddress(
        [marketPublicKey.toBuffer(), nonce.toArrayLike(Buffer, 'le', 8)],
        dexProgramId
      )
      // @ts-ignore
      return [vaultOwner, nonce]
    } catch (e) {
      nonce.iaddn(1)
    }
  }
  throw new Error('Unable to find nonce')
}
