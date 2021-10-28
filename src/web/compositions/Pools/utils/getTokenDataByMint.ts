import { TokenInfo } from '@sb/compositions/Rebalance/Rebalance.types'

export const getTokenDataByMint = (
  allTokensData: TokenInfo[],
  mint: string,
  address?: string
): TokenInfo => {
  const emptyResponse = {
    amount: 0,
    decimals: 0,
    mint: '',
    symbol: 'Empty',
    address: '',
  }

  if (address) {
    return (
      allTokensData.find(
        (tokenData) => tokenData.mint === mint && address === tokenData.address
      ) || emptyResponse
    )
  } else {
    const tokensByMint = allTokensData.filter(
      (tokenData) => tokenData.mint === mint
    )

    if (tokensByMint.length > 1) {
      return tokensByMint.sort((a, b) => b.amount - a.amount)[0]
    } else {
      return tokensByMint[0] || emptyResponse
    }
  }
}
