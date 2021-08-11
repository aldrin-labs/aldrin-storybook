import { TokensMapType } from '../Rebalance.types'
import { getTokensDiff } from './getTokensDiff'

export const getTokensToBuy = (tokensMap: TokensMapType) => {
  const tokensDiff = getTokensDiff(tokensMap)

  return tokensDiff
    .filter((el) => el.amountDiff > 0)
    .map((el) => ({
      ...el,
      tokenValue: +(el.price * el.amountDiff).toFixed(el.decimalCount),
    }))
    .sort((a, b) => b.tokenValue - a.tokenValue)
}
