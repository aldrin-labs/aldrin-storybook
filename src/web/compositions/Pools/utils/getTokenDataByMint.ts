import { TokenInfo } from '@sb/compositions/Rebalance/Rebalance.types'
import { WRAPPED_SOL_MINT } from '@sb/dexUtils/wallet'

export const getTokenDataByMint = (
  allTokensData: TokenInfo[],
  mint: string,
  address?: string
): TokenInfo => {
  return (
    allTokensData.find(
      (tokenData) =>
        tokenData.mint === mint &&
        (!!address ? address === tokenData.address : true)
    ) || {
      amount: 0,
      decimals: 0,
      mint: '',
      symbol: 'Empty',
      address: '',
    }
  )
}
