import { PublicKey } from '@solana/web3.js'
import BN from 'bn.js'

export interface Vesting {
  beneficiary: PublicKey
  mint: PublicKey
  vault: PublicKey
  grantor: PublicKey
  outstanding: BN
  startBalance: BN
  createdTs: number
  startTs: number
  endTs: number
  periodCount: number
  whitelistOwned: number
  nonce: number
  realizor?: {
    program: PublicKey
    metadata: PublicKey
  }
}

export interface VestingWithPk extends Vesting {
  vesting: PublicKey
}
