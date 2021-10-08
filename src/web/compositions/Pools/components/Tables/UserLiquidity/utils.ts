import { PoolInfo, DexTokensPrices } from '@sb/compositions/Pools/index.types'
import { getTokenNameByMintAddress } from '@sb/dexUtils/markets'

export const getTotalUserLiquidity = ({
  usersPools,
  dexTokensPrices,
}: {
  usersPools: PoolInfo[]
  dexTokensPrices: DexTokensPrices[]
}): number => {
  return usersPools.reduce((acc: number, pool: PoolInfo) => {
    const baseSymbol = getTokenNameByMintAddress(pool.tokenA)
    const quoteSymbol = getTokenNameByMintAddress(pool.tokenB)

    const baseTokenPrice =
      dexTokensPrices.find((tokenInfo) => tokenInfo.symbol === baseSymbol)
        ?.price || 10

    const quoteTokenPrice =
      dexTokensPrices.find((tokenInfo) => tokenInfo.symbol === quoteSymbol)
        ?.price || 10

    const tvlUSDForPool =
      baseTokenPrice * pool.tvl.tokenA + quoteTokenPrice * pool.tvl.tokenB

    return acc + tvlUSDForPool
  }, 0)
}
