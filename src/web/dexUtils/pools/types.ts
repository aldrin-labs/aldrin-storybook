import { PublicKey, Transaction } from '@solana/web3.js'
import BN from 'bn.js'
import MultiEndpointsConnection from '../MultiEndpointsConnection'
import { WalletAdapter } from '../types'
import { InitializeFarmingBase } from './actions/initializeFarming'

export interface CreatePoolDeposit {
  baseTokenAmount: BN
  quoteTokenAmount: BN
  userBaseTokenAccount: PublicKey
  userQuoteTokenAccount: PublicKey
  vestingPeriod?: BN // seconds
}

export interface CreatePoolParams {
  wallet: WalletAdapter
  connection: MultiEndpointsConnection
  baseTokenMint: PublicKey
  quoteTokenMint: PublicKey
  firstDeposit: CreatePoolDeposit
  curveType?: CURVE
  farming?: InitializeFarmingBase
}

export interface PoolLike {
  baseTokenMint: PublicKey
  quoteTokenMint: PublicKey
}

export enum AUTHORITY_TYPE {
  MINT = 0,
  FREEZE = 1,
  OWNER = 2,
  CLOSE = 3,
}

export enum CURVE {
  PRODUCT = 0,
  STABLE = 1,
}

export interface CreatePoolTransactionsResponse {
  transactions: {
    createAccounts: Transaction
    setAuthorities: Transaction
    createPool: Transaction
    firstDeposit: Transaction
    farming?: Transaction
  }
  pool: PublicKey
}
