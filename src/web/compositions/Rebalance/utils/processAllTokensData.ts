import { getAvailableTokensForRebalance } from "./getAvailableTokensForRebalance"
import { getPercentageAllocationForTokens } from "./getPercentageAllocationForTokens"
import { getSliderStepForTokens } from "./getSliderStepForTokens"
import { getSortedTokensByValue } from "./getSortedTokensByValue"
import { getTokensMap } from "./getTokensMap"
import { getTokenValuesForTokens } from "./getTokenValuesForTokens"
import { getTotalTokenValue } from "./getTotalTokenValue"

export const processAllTokensData = ({
  tokensWithPrices,
  poolsInfo
}: {
  tokensWithPrices
  poolsInfo,
}) => {
  const tokensWithTokenValue = getTokenValuesForTokens(tokensWithPrices)
  const sortedTokensByTokenValue = getSortedTokensByValue(
    tokensWithTokenValue
  )

  const totalTokenValue = getTotalTokenValue(sortedTokensByTokenValue)

  const tokensWithPercentages = getPercentageAllocationForTokens(
    sortedTokensByTokenValue,
    totalTokenValue
  )

  const tokensWithSliderSteps = getSliderStepForTokens(
    tokensWithPercentages,
    totalTokenValue
  )

  // TODO: Can be splitted and move up
  const availableTokensForRebalance = getAvailableTokensForRebalance(
    // getPoolsInfoMockData,
    poolsInfo,
    tokensWithSliderSteps
  )
  const availableTokensForRebalanceMap = getTokensMap({
    tokens: availableTokensForRebalance
  })

  return availableTokensForRebalanceMap
}
