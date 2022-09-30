import { PublicKey } from '@solana/web3.js'
import BN from 'bn.js'

export type Pool = {
  publicKey: PublicKey
  account: {
    mint: PublicKey
    admin: PublicKey
    curve: {
      constProd: {}
    }
    dimension: BN
    programTollWallet: PublicKey
    reserves: { tokens: { amount: BN }; mint: PublicKey; vault: PublicKey }[]
    signer: PublicKey
    swapFee: { permillion: BN }
  }
}
