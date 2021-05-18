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
    mint: string
    tokenValue: number,
    disabled?: true | false
    disabledReason?: string
    poolWithLiquidityExists?: true | false
    poolExists?: true | false  
}

export type TokensMapType = { [cacheKey: string]: TokenType }