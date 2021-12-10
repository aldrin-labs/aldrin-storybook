import { PoolInfo } from '@sb/compositions/Pools/index.types'
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
  return pools.find(
    (pool) =>
      (pool?.tokenA === baseTokenMintAddress ||
        pool?.tokenA === quoteTokenMintAddress) &&
      (pool?.tokenB === baseTokenMintAddress ||
        pool?.tokenB === quoteTokenMintAddress)
  )
}

export {
  getDefaultBaseToken,
  getDefaultQuoteToken,
  getPoolsForSwapActiveTab,
  getSelectedPoolForSwap,
}
