export const getPercentageAllocationForTokens = (tokens: {symbol: string, decimals: number, amount: number, price: number | null, mint: string, tokenValue: number}[], totalTokensValue: number) => {
    const tokensWithPercentageAllocations = tokens.map(el => ({...el, percentage: el.tokenValue * 100 / totalTokensValue }))

    return tokensWithPercentageAllocations
}

//
//