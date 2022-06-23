import { FarmingTicket } from '@sb/dexUtils/common/types'

import { PoolFees, PoolInfo } from '@core/types/pools.types'

export { PoolFees, PoolInfo }
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
