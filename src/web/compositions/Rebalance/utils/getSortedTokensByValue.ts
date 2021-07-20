import { TokenInfoWithValue } from "../Rebalance.types"

export const getSortedTokensByValue = (tokens: TokenInfoWithValue[]) => {
    const sortedTokens = tokens.sort((a, b) => b.tokenValue - a.tokenValue)

    return sortedTokens
}