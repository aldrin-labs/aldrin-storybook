import { PublicKey } from '@solana/web3.js'
import BN from 'bn.js'

export interface U192 {
  u192: [BN, BN, BN]
}

export interface ObligationReserve<S> {
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

interface LastUpdate {
  slot: BN
  stale: boolean
}

export interface ObligationBase<S> {
  allowedBorrowValue: S
  borrowedValue: S
  depositedValue: S
  lastUpdate: LastUpdate
  lendingMarket: PublicKey
  owner: PublicKey
  reserves: ObligationReserve<S>[]
  unhealthyBorrowValue: S
}

export type ObligationInner = ObligationBase<U192>
export type Obligation = ObligationBase<BN> & {
  obligation: PublicKey
}

export interface IntPercent {
  percent: number
}

export interface ReserveBase<S> {
  collateral: {
    mint: PublicKey
    mintTotalSupply: BN
    supply: PublicKey
  }
  config: {
    fees: {
      borrowFee: S
      flashLoanFee: S
      hostFee: IntPercent
    }
    liquidationBonus: IntPercent
    liquidationThreshold: IntPercent
    loanToValueRatio: IntPercent
    maxBorrowRate: IntPercent
    minBorrowRate: IntPercent
    optimalBorrowRate: IntPercent
    optimalUtilizationRate: IntPercent
  }
  lastUpdate: LastUpdate
  lendingMarket: PublicKey
  liquidity: {
    availableAmount: BN
    borrowedAmount: S
    cumulativeBorrowRate: S
    feeReceiver: PublicKey
    marketPrice: S
    mint: PublicKey
    mintDecimals: number
    oracle: PublicKey
    supply: PublicKey
  }
}

export type ReserveDecoded = ReserveBase<U192>
export type Reserve = ReserveBase<BN> & {
  reserve: PublicKey
}
