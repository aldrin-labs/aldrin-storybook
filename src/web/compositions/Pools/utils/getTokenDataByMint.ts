import { TokenInfo } from '@sb/compositions/Rebalance/Rebalance.types'
import { WRAPPED_SOL_MINT } from '@sb/dexUtils/wallet'

export const getTokenDataByMint = (
  allTokensData: TokenInfo[],
  mint: string
): TokenInfo => {
  if (mint === WRAPPED_SOL_MINT.toString()) {
    const solTokens = allTokensData.filter(
      (tokenData) => tokenData.mint === mint
    ) || {
      amount: 0,
      decimals: 0,
      mint: '',
      symbol: 'Empty',
      address: '',
    }

    return solTokens[solTokens.length - 1]
  } else {
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
}
