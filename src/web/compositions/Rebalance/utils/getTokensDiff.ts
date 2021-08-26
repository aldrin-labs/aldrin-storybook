import { TokensDiff, TokensMapType } from '../Rebalance.types'

export const getTokensDiff = (tokensMap: TokensMapType) => {
  const tokensDiff: TokensDiff = Object.values(tokensMap)
    .map((el) => ({
      symbol: el.symbol,
      amountDiff: +(el.targetAmount - el.amount).toFixed(el.decimals),
      decimalCount: el.decimals,
      price: el.price || 0,
    }))
    .filter((el) => el.amountDiff !== 0)

  return tokensDiff
}
