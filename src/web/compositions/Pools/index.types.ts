import { FarmingState } from '@sb/dexUtils/common/types'

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
  farming?: FarmingState[]
  tvl: {
    tokenA: number
    tokenB: number
  }
  apy24h: number // %
  supply: number
  curve?: string
  amp?: number
  fees: PoolFees
}

export type PoolFees = {
  tradeFeeNumerator: number
  ownerTradeFeeNumerator: number
  tradeFeeDenominator: number
  ownerTradeFeeDenominator: number
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
