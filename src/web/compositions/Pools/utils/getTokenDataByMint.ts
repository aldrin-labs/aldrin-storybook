import { TokenInfo } from '@sb/compositions/Rebalance/Rebalance.types'

export const getTokenDataByMint = (
  allTokensData: TokenInfo[],
  mint: string
): TokenInfo | undefined => {
  return allTokensData.find((tokenData) => tokenData.mint === mint)
}
