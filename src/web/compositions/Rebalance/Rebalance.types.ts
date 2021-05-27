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

export type TokenType = {
    symbol: string
    decimals: number
    amount: number
    price: number | null
    percentage: number
    mint: string
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