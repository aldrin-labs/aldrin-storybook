import { stripDigitPlaces } from '@core/utils/PortfolioTableUtils'
import { TokenInfoWithDisableReason, TokenInfoWithTargetData, TokensMapType } from '../Rebalance.types'

export const getTokensMap = ({
    total = 0,
    tokens
}: {
    total?: number,
    tokens: TokenInfoWithDisableReason[] | TokenInfoWithTargetData[]
}): TokensMapType => {
  const tokensMap = tokens.reduce((acc: TokensMapType, el) => {
    if (el.targetPercentage) {
        const targetTokenValue = total / 100 * el.targetPercentage
        const targetAmount = targetTokenValue / el.price

        acc[el.symbol] = {
            ...el,
            targetTokenValue: +stripDigitPlaces(targetTokenValue, 8),
            targetAmount: +stripDigitPlaces(targetAmount, 8),
        }
    } else {
        acc[el.symbol] = {
            ...el,
            targetTokenValue: el.tokenValue,
            targetAmount: el.amount,
            targetPercentage: el.percentage,
        }
    }

    return acc
  }, {})

  return tokensMap
}
