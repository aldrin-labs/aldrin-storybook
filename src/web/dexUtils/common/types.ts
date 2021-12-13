import { AccountInfo, PublicKey } from '@solana/web3.js'
import BN from 'bn.js'

export type FarmingTicket = {
  tokensFrozen: number
  endTime: string
  startTime: string
  pool: string
  farmingTicket: string
  userKey: string
  amountsToClaim: AmountToClaim[]
  statesAttached: StateAttached[]
}

export type PoolAddress = string

export type AmountToClaim = { amount: number; farmingState: string }

export type StateAttached = {
  farmingState: string
  lastVestedWithdrawTime: number
  lastWithdrawTime: number
}

export type FarmingState = {
  farmingState: string
  farmingTokenVault: string
  farmingTokenMint: string
  farmingTokenMintDecimals: number
  farmingSnapshots: string
  tokensUnlocked: number
  tokensTotal: number
  startTime: number
  currentTime: number | null
  tokensPerPeriod: number
  periodLength: number
  vestingPeriod: number
  feesDistributed: boolean
}

export type Snapshot = {
  isInitialized: boolean
  tokensFrozen: number
  tokensTotal: number
  time: number
}

export type SnapshotQueue = {
  publicKey: string
  nextIndex: number
  snapshots: Snapshot[]
}

export interface GetProgramAccountsResultItem {
  pubkey: PublicKey
  account: AccountInfo<Buffer>
}

export type GetProgramAccountsResult = Array<GetProgramAccountsResultItem>
export type AsyncGetProgramAccountsResult = Promise<GetProgramAccountsResult>

interface PoolFees {
  tradeFeeNumerator: BN
  tradeFeeDenominator: BN
  ownerTradeFeeNumerator: BN
  ownerTradeFeeDenominator: BN
  ownerWithdrawFeeDenominator: BN
}

export interface Pool {
  lpTokenFreezeVault: PublicKey
  poolMint: PublicKey
  baseTokenVault: PublicKey
  baseTokenMint: PublicKey
  quoteTokenMint: PublicKey
  poolSigner: PublicKey
  poolSignerNonce: BN
  authority: PublicKey
  initializerAccount: PublicKey
  feeBaseAccount: PublicKey
  feeQuoteAccount: PublicKey
  feePoolTokenAccount: PublicKey
  fees: PoolFees
}


export interface PoolV2 extends Pool {
  curveType: BN
  curve: PublicKey
}