import { TokensMapType } from '../Rebalance.types'

export const resetTargetAllocation = (tokensMap: TokensMapType) => {
  const resettedTokensArray = Object.entries(tokensMap).map(([name, token]) => {
    console.log('token', name, token)
    return [
      name,
      {
        ...token,
        targetTokenValue: token.tokenValue,
        targetAmount: token.amount,
        targetPercentage: token.percentage,
      },
    ]
  })

  const resettedTokensMap = Object.fromEntries(resettedTokensArray)

  return resettedTokensMap
}
