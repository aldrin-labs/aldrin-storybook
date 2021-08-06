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
    if (el.targetPercentage !== undefined) {
        acc[el.symbol] = {
            ...el,
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
