import { TokensMapType } from '../Rebalance.types'
import { getTokensDiff } from './getTokensDiff'

export const getTokensToSell = (tokensMap: TokensMapType) => {
  const tokensDiff = getTokensDiff(tokensMap)

  return tokensDiff
    .filter((el) => el.amountDiff < 0)
    .map((el) => ({
      ...el,
      tokenValue: +(el.price * Math.abs(el.amountDiff)).toFixed(
        el.decimalCount
      ),
      isSold: false,
    }))
    .sort((a, b) => a.tokenValue - b.tokenValue)
}
