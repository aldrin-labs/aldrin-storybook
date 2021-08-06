import { TokenInfoWithValue } from '../Rebalance.types'

export const getSortedTokensByValue = (tokens: TokenInfoWithValue[]) => {
  const sortedTokens = tokens.sort((a, b) => {
    if (b.tokenValue === 0 && a.tokenValue === 0)
      return a.symbol.localeCompare(b.symbol)

    return b.tokenValue - a.tokenValue
  })

  return sortedTokens
}
