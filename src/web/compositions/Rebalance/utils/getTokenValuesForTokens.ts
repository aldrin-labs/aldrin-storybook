
export const getTokenValuesForTokens = (tokens: {symbol: string, decimals: number, amount: number, price: number | null, mint: string}[]) => {
    const tokenWithValues = tokens.map(el => ({ 
        ...el,
        tokenValue: (el.price || 0) * el.amount
    }))

    return tokenWithValues
} 