import { PublicKey } from '@solana/web3.js'
import BN from 'bn.js'

export interface U192 {
  u192: [BN, BN, BN]
}

export interface Reserve<S> {
  empty?: {}
  collateral?: {
    inner: {
      depositReserve: PublicKey
      depositedAmount: BN
      marketValue: S
    }
  }
  liquidity?: {
    inner: {
      borrowReserve: PublicKey
      cumulativeBorrowRate: S
      borrowedAmount: S
      marketValue: S
    }
  }
}

export interface ObligationBase<S> {
  allowedBorrowValue: S
  borrowedValue: S
  depositedValue: S
  lastUpdate: {
    slot: BN
    stale: boolean
  }
  lendingMarket: PublicKey
  owner: PublicKey
  reserves: Reserve<S>[]
  unhealthyBorrowValue: S
}

export type ObligationInner = ObligationBase<U192>
export type Obligation = ObligationBase<BN> & {
  obligation: PublicKey
}
