import { DexTokensPrices, PoolInfo } from '@sb/compositions/Pools/index.types'

import { getTokenNameByMintAddress } from '../markets'

export const calculatePoolTokenPrice = ({
  pool,
  dexTokensPricesMap,
}: {
  pool: PoolInfo
  dexTokensPricesMap: Map<string, DexTokensPrices>
}) => {
  const {
    supply,
    tokenA,
    tokenB,
    tvl: { tokenA: baseTokensLocked, tokenB: quoteTokensLocked },
  } = pool
  const baseTokenAmountForPoolToken = baseTokensLocked / supply
  const quoteTokenAmountForPoolToken = quoteTokensLocked / supply

  const base = getTokenNameByMintAddress(tokenA)
  const quote = getTokenNameByMintAddress(tokenB)

  const baseTokenPrice = dexTokensPricesMap.get(base)?.price || 0
  const quoteTokenPrice = dexTokensPricesMap.get(quote)?.price || 0

  return (
    baseTokenAmountForPoolToken * baseTokenPrice +
    quoteTokenAmountForPoolToken * quoteTokenPrice
  )
}
