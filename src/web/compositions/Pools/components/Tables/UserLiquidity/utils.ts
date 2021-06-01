import { PoolInfo, PoolsPrices } from "@sb/compositions/Pools/index.types"
import { getTokenNameByMintAddress } from "@sb/dexUtils/markets"

export const getTotalUserLiquidity = ({
  usersPools,
  poolsPrices,
}: {
  usersPools: PoolInfo[]
  poolsPrices: PoolsPrices[]
}): number => {
  return usersPools.reduce((acc: number, pool: PoolInfo) => {
    const baseSymbol = getTokenNameByMintAddress(pool.tokenA)
    const quoteSymbol = getTokenNameByMintAddress(pool.tokenB)

    const baseTokenPrice =
      poolsPrices.find((tokenInfo) => tokenInfo.symbol === baseSymbol)?.price ||
      10

    const quoteTokenPrice =
      poolsPrices.find((tokenInfo) => tokenInfo.symbol === quoteSymbol)
        ?.price || 10

    const tvlUSDForPool =
      baseTokenPrice * pool.tvl.tokenA + quoteTokenPrice * pool.tvl.tokenB

    return acc + tvlUSDForPool
  }, 0)
}
