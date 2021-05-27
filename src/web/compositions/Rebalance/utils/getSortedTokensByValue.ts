export const getSortedTokensByValue = (tokens: {symbol: string, decimals: number, amount: number, price: number | null, mint: string, tokenValue: number }[]) => {
    const sortedTokens = tokens.sort((a, b) => b.tokenValue - a.tokenValue)

    return sortedTokens
}