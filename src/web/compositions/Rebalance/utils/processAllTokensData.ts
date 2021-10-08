import { MarketsMap } from '@sb/dexUtils/markets'
import { TokenInfoWithPrice } from '../Rebalance.types'
import { getAvailableTokensForRebalance } from './getAvailableTokensForRebalance'
import { getPercentageAllocationForTokens } from './getPercentageAllocationForTokens'
import { getSliderStepForTokens } from './getSliderStepForTokens'
import { getSortedTokensByValue } from './getSortedTokensByValue'
import { getTokensMap } from './getTokensMap'
import { getTokenValuesForTokens } from './getTokenValuesForTokens'
import { getTotalTokenValue } from './getTotalTokenValue'

export const processAllTokensData = ({
  tokensWithPrices,
  allMarketsMap,
}: {
  tokensWithPrices: TokenInfoWithPrice[]
  allMarketsMap: MarketsMap
}) => {
  const tokensWithTokenValue = getTokenValuesForTokens(tokensWithPrices)
  const sortedTokensByTokenValue = getSortedTokensByValue(tokensWithTokenValue)

  const totalTokenValue = getTotalTokenValue(sortedTokensByTokenValue)

  const tokensWithPercentages = getPercentageAllocationForTokens(
    sortedTokensByTokenValue,
    totalTokenValue
  )

  const tokensWithSliderSteps = getSliderStepForTokens(
    tokensWithPercentages,
    totalTokenValue
  )

  const availableTokensForRebalance = getAvailableTokensForRebalance(
    allMarketsMap,
    tokensWithSliderSteps
  )
  const availableTokensForRebalanceMap = getTokensMap({
    tokens: availableTokensForRebalance,
    total: totalTokenValue,
  })

  return availableTokensForRebalanceMap
}
