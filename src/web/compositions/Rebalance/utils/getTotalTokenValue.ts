export const getTotalTokenValue = (tokens: {symbol: string, decimals: number, amount: number, price: number | null, mint: string, tokenValue: number}[]) => {
    const totalTokensValue = tokens.reduce((acc, el) => {
        return acc + el.tokenValue
    }, 0)

    return totalTokensValue
}