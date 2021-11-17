import { TokenInfo } from "../Rebalance.types";

export const filterDuplicateTokensByAmount = (tokens: TokenInfo[]) => {
  const tokensMap: Map<string, TokenInfo> = new Map()

  tokens.forEach(token => {
    const tokenInMap = tokensMap.get(token.mint)

    if (tokenInMap) {
      if (tokenInMap.amount < token.amount) tokensMap.set(token.mint, token)
    } else {
      tokensMap.set(token.mint, token)
    }
  })

  return [...tokensMap.values()]
}
