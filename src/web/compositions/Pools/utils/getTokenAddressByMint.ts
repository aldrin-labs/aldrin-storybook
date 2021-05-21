import { TokenInfo } from '@sb/compositions/Rebalance/Rebalance.types'

export const getTokenAddressByMint = (
  allTokensData: TokenInfo[],
  mint: string
): string | undefined => {
  return allTokensData.find((tokenData) => tokenData.mint === mint)?.address
}
