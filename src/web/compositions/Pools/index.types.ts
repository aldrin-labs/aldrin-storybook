export type FarmingState = {
  farmingState: string
  farmingTokenVault: string
  farmingTokenMint: string
  farmingTokenMintDecimals: number
  farmingSnapshots: string
  tokensUnlocked: number
  tokensTotal: number
  tokensPerPeriod: number
  periodLength: number
  vestingPeriod: number
}

export type PoolInfo = {
  name: string
  parsedName: string
  tokenA: string
  tokenB: string
  poolTokenAccountA: string
  poolTokenAccountB: string
  swapToken: string
  poolTokenMint: string
  lpTokenFreezeVaultBalance: number;
  farming: FarmingState[]
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
  totalBaseTokenFee: number
  totalQuoteTokenFee: number
}

export type TradingVolume = {
  pool: string
  tradingVolume: number
}

export type PoolWithOperation = {
  pool: string
  operation: 'deposit' | 'withdraw' | 'stake' | 'unstake' | 'claim' | ''
}
