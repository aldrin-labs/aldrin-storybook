import { TokenInfoWithPrice, TokenInfoWithValue } from '../Rebalance.types'

export const getTokenValuesForTokens = (
  tokens: TokenInfoWithPrice[]
): TokenInfoWithValue[] => {
  const tokenWithValues = tokens.map((el) => ({
    ...el,
    tokenValue: (el.price || 0) * el.amount,
  }))

  return tokenWithValues
}
