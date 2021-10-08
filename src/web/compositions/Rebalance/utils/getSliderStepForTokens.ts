import { stripDigitPlaces } from '@core/utils/PortfolioTableUtils'
import {
  TokenInfoWithPercentage,
  TokenInfoWithSliderStep,
} from '../Rebalance.types'

export const getSliderStepForTokens = (
  tokens: TokenInfoWithPercentage[],
  totalTokenValue: number
): TokenInfoWithSliderStep[] => {
  const tokensWithSliderStep = tokens.map((el) => {
    const decimalCount = el.decimals
    const tokenPrice = el.price || 0
    const stepInAmountToken = +stripDigitPlaces(
      1 / Math.pow(10, decimalCount),
      decimalCount
    )
    const stepInValueToken = stepInAmountToken * tokenPrice
    const stepInPercentageToken =
      (stepInAmountToken * 100) / (totalTokenValue / tokenPrice)

    return {
      ...el,
      stepInAmountToken,
      stepInValueToken,
      stepInPercentageToken,
      decimalCount,
    }
  })

  return tokensWithSliderStep
}
