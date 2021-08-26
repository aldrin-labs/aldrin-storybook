import { TokenInfoWithPercentage, TokenInfoWithValue } from "../Rebalance.types"

export const getPercentageAllocationForTokens = (
  tokens: TokenInfoWithValue[],
  totalTokensValue: number
): TokenInfoWithPercentage[] => {
  const tokensWithPercentageAllocations = tokens.map((el) => ({
    ...el,
    percentage: (el.tokenValue * 100) / totalTokensValue,
  }))

  return tokensWithPercentageAllocations
}