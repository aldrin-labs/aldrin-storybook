import { Connection, PublicKey } from '@solana/web3.js'
import BN from 'bn.js'

import { AldrinConnection } from '@core/solana'

import { WalletAdapter } from '../types'

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

export interface CreateVestingParams {
  vestingPeriod: BN // seconds
  depositorAccount: PublicKey
  wallet: WalletAdapter
  depositAmount: BN
  connection: AldrinConnection
  tokenMint: PublicKey
  accountLamports?: number
}

export interface WithdrawVestingParams {
  vesting: VestingWithPk
  withdrawAccount?: PublicKey
  connection: Connection
  wallet: WalletAdapter
  amount?: BN
}
