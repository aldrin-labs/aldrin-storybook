import { PoolInfo } from '@sb/compositions/Pools/index.types'
import { getTokenNameByMintAddress } from '@sb/dexUtils/markets'

import { checkIsPoolStable } from '../checkIsPoolStable'

const getDefaultBaseToken = (isStableSwapTabActive: boolean) =>
  isStableSwapTabActive ? 'USDC' : 'SOL'

const getDefaultQuoteToken = (isStableSwapTabActive: boolean) =>
  isStableSwapTabActive ? 'USDT' : 'RIN'

const getPoolsForSwapActiveTab = ({
  pools,
  isStableSwapTabActive,
}: {
  pools: PoolInfo[]
  isStableSwapTabActive: boolean
}) => {
  if (isStableSwapTabActive) {
    return pools.filter(checkIsPoolStable)
  }

  return pools
}

const getSelectedPoolForSwap = ({
  pools,
  baseTokenMintAddress,
  quoteTokenMintAddress,
}: {
  pools: PoolInfo[]
  baseTokenMintAddress: string
  quoteTokenMintAddress: string
}) => {
  return pools
    .filter(
      (pool) =>
        (pool?.tokenA === baseTokenMintAddress ||
          pool?.tokenA === quoteTokenMintAddress) &&
        (pool?.tokenB === baseTokenMintAddress ||
          pool?.tokenB === quoteTokenMintAddress)
    )
    .sort((a, b) => b.tvl.tokenA - a.tvl.tokenA)[0]
}

const getMarketForSwap = ({
  marketsMap,
  baseTokenMintAddress,
  quoteTokenMintAddress,
}: {
  marketsMap: Map<string, any>
  baseTokenMintAddress: string
  quoteTokenMintAddress: string
}): [any, boolean | null] => {
  const baseSymbol = getTokenNameByMintAddress(baseTokenMintAddress)
  const quoteSymbol = getTokenNameByMintAddress(quoteTokenMintAddress)

  const marketName = `${baseSymbol}_${quoteSymbol}`
  const reversedMarketName = `${quoteSymbol}_${baseSymbol}`

  if (marketsMap.has(marketName)) {
    return [marketsMap.get(marketName), true]
  }

  if (marketsMap.has(reversedMarketName)) {
    return [marketsMap.get(marketName), false]
  }

  return [null, null]
}

export {
  getDefaultBaseToken,
  getDefaultQuoteToken,
  getPoolsForSwapActiveTab,
  getSelectedPoolForSwap,
  getMarketForSwap,
}
