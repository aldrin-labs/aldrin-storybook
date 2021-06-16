import { TokenInfo } from '@sb/compositions/Rebalance/Rebalance.types'

export const getTokenDataByMint = (
  allTokensData: TokenInfo[],
  mint: string
): TokenInfo => {
  return (
    allTokensData.find((tokenData) => tokenData.mint === mint) || {
      amount: 0,
      decimals: 0,
      mint: '',
      symbol: 'Empty',
      address: '',
    }
  )
}
