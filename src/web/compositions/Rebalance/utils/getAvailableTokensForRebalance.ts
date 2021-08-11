import { TokenInfoWithDisableReason, TokenInfoWithSliderStep } from '../Rebalance.types'
import { MarketsMap } from '@sb/dexUtils/markets'

import { getMarketsData } from './getMarketsData'


export const getAvailableTokensForRebalance = (
  allMarketsMap: MarketsMap,
  tokens: TokenInfoWithSliderStep[],
): TokenInfoWithDisableReason[] => {
  const marketsData = getMarketsData(allMarketsMap)

  const availableTokens = Array.from(new Set(marketsData.reduce((acc: string[], el) => {
    acc.push(el.tokenA)
    acc.push(el.tokenB)

    return acc
  }, [])))

  const tokensWithPoolsAndLiquidity = tokens.map(el => {
    const isTokenHasPrice = el.price !== null
    const isTokenHasPool = availableTokens.includes(el.symbol)

    return {
      ...el,
      ...(isTokenHasPool ? { poolExists: true } : {
        disabled: true,
        disabledReason: "no market"
      }),
      ...(isTokenHasPrice ? {} : {
        disabled: true,
        disabledReason: "no price"
      }),
    }
  })

  return tokensWithPoolsAndLiquidity

}
