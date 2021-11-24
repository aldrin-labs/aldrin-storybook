import { TokenInfo } from '@sb/compositions/Rebalance/Rebalance.types'

export const getTokenDataByMint = (
  allTokensData: TokenInfo[],
  mint: string,
  address?: string
): TokenInfo => {
  const emptyResponse: TokenInfo = {
    amount: 0,
    decimals: 0,
    mint: '',
    symbol: 'Empty',
    address: '',
  }

  if (address) {
    return (
      allTokensData.find((tokenData) => tokenData.mint === mint && address === tokenData.address) || emptyResponse
    )
  }

  return allTokensData
    .filter((tokenData) => tokenData.mint === mint)
    .sort((a, b) => b.amount - a.amount)[0] || emptyResponse

}
