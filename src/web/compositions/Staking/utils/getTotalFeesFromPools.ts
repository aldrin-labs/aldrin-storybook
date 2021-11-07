import { DexTokensPrices, FeesEarned } from '@sb/compositions/Pools/index.types'

export const getTotalFeesFromPools = ({
  poolsFeesData,
  dexTokensPricesMap,
}: {
  poolsFeesData: FeesEarned[]
  dexTokensPricesMap: Map<string, DexTokensPrices>
}) => {
  return poolsFeesData.reduce((acc, current) => {
    const [baseSymbol, quoteSymbol] = current.poolSymbol.split('_')

    const basePrice = dexTokensPricesMap.get(baseSymbol)?.price || 0
    const quotePrice = dexTokensPricesMap.get(quoteSymbol)?.price || 0

    const { totalBaseTokenFee, totalQuoteTokenFee } = current

    return acc + totalBaseTokenFee * basePrice + totalQuoteTokenFee * quotePrice
  }, 0)
}
