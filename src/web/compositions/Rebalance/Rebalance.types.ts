import { Account, PublicKey, Transaction, Connection } from '@solana/web3.js'
import { WalletAdapter } from '@sb/dexUtils/types'
import { Market } from '@project-serum/serum'

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

export type MarketData = {
    name: string
    address: PublicKey
    programId: PublicKey
    deprecated: boolean
    tokenA: string
    tokenB: string
}

export interface TokenInfo {
    symbol: string
    amount: number
    decimals: number
    mint: string
    address: string   
}

export interface TokenInfoWithPrice extends TokenInfo {
    price: number | null
}

export interface TokenInfoWithValue extends TokenInfoWithPrice {
    tokenValue: number
}

export interface TokenInfoWithPercentage extends TokenInfoWithValue {
    percentage: number
}

export interface TokenInfoWithSliderStep extends TokenInfoWithPercentage {
    stepInAmountToken: number
    stepInValueToken: number
    stepInPercentageToken: number
    decimalCount: number
}

export interface TokenInfoWithDisableReason extends TokenInfoWithSliderStep {
    disabled?: true | false
    disabledReason?: string
    poolWithLiquidityExists?: true | false
    poolExists?: true | false  
}

export interface TokenInfoWithTargetData extends TokenInfoWithDisableReason {
    targetTokenValue: number
    targetAmount: number
    targetPercentage: number
}

export type Colors = { [ symbol: string]: string }

export type TokensMapType = { [cacheKey: string]: TokenInfoWithTargetData }

export type TransactionMainData = {
    side: 'sell' | 'buy'
    symbol: string
    amount: number
}

export type TransactionType = MarketDataProcessed & TransactionMainData & { 
    price: number, 
    total: number, 
    feeUSD: number 
    slippage: number
    loadedMarket: Market
}

export interface MarketDataProcessed extends MarketData {
  symbol: string
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

export type RebalancePopupStep = 'initial' | 'pending' | 'done' | 'failed'

export type Orderbook = { asks: [number, number][], bids: [number, number][] }
export type Orderbooks = { [key: string]: Orderbook }

export type TokensDiff = {
    symbol: string
    amountDiff: number
    decimalCount: number
    price: number
}[]