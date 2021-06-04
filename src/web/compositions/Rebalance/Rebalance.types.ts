import { Account, PublicKey, Transaction, Connection } from '@solana/web3.js'
import { WalletAdapter } from '@sb/dexUtils/types'

export type PoolTVL = {
    tokenA: number
    tokenB: number
    USD: number
}
  
export type PoolTotalFeesPaid = {
    tokenA: number
    tokenB: number
    USD: number
}
  
export type PoolInfo = {
    name: string
    swapToken: string
    poolTokenMint: string
    tokenA: string
    tokenB: string
    apy24h: number
    tvl: PoolTVL
    totalFeesPaid: PoolTotalFeesPaid
}

export interface TokenInfo {
    symbol: string
    amount: number
    decimals: number
    mint: string
    address: string   
}

export interface TokenType extends TokenInfo {
    price: number | null
    percentage: number
    tokenValue: number,
    targetTokenValue: number,
    targetAmount: number,
    targetPercentage: number,
    disabled?: true | false
    disabledReason?: string
    poolWithLiquidityExists?: true | false
    poolExists?: true | false  
    decimalCount: number
}

export type TokensMapType = { [cacheKey: string]: TokenType }

export type TransactionType = PoolInfoElement & { amount: number, total: number, side: 'sell' | 'buy', feeUSD: number }

export type PoolInfoElement = {
  symbol: string
  slippage: number
  price: number
  tokenSwapPublicKey: string
  tokenA: number
  tokenB: number
}

export type SwapsType = {
    wallet: WalletAdapter
    connection: Connection
    swapAmountIn: number
    swapAmountOut: number
    tokenSwapPublicKey: PublicKey
    userTokenAccountA: PublicKey
    userTokenAccountB: PublicKey
    baseSwapToken: 'tokenA' | 'tokenB'
}