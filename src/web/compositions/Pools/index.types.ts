import { FarmingState, FarmingTicket } from '@sb/dexUtils/common/types'

export type PoolInfo = {
  name: string
  parsedName: string
  tokenA: string
  tokenB: string
  curveType: number
  poolTokenAccountA: string
  poolTokenAccountB: string
  swapToken: string
  poolTokenMint: string
  lpTokenFreezeVaultBalance: number;
  farming: FarmingState[] | null
  tvl: {
    tokenA: number
    tokenB: number
  }
  apy24h: number // %
  supply: number
}

export type DexTokensPrices = {
  symbol: string
  price: number
}

export type FeesEarned = {
  pool: string // an address of pool or 'all'
  poolSymbol: string
  totalBaseTokenFee: number
  totalQuoteTokenFee: number
}

export interface TradingVolumeStats {
  weeklyTradingVolume: number
  dailyTradingVolume: number
  pool: string
}

export type TradingVolume = {
  pool: string
  tradingVolume: number
}

export type PoolWithOperation = {
  pool: string
  operation: 'deposit' | 'withdraw' | 'stake' | 'unstake' | 'claim' | ''
}


export type TokenPricesMap = Map<string, DexTokensPrices>
export type FeesMap = Map<string, FeesEarned>
export type VolumesMap = Map<string, TradingVolumeStats>
export type FarmingTicketsMap = Map<string, FarmingTicket[]>
