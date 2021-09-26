export type PoolInfo = {
  name: string
  parsedName: string
  tokenA: string
  tokenB: string
  swapToken: string
  poolTokenMint: string
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
  earnedUSD: number
}
