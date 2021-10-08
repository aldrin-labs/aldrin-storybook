import { TokenInfoWithValue } from '../Rebalance.types'

export const getTotalTokenValue = (tokens: TokenInfoWithValue[]) => {
  const totalTokensValue = tokens.reduce((acc, el) => {
    return acc + el.tokenValue
  }, 0)

  return totalTokensValue
}
