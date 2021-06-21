import { TokensMapType, TokenType } from '../Rebalance.types'

export const getTokensMap = (tokens: TokenType[]): TokensMapType => {
    const tokensMap = tokens.reduce((acc: TokensMapType, el) => {
        acc[el.symbol] = { ...el, targetTokenValue: el.tokenValue, targetAmount: el.amount, targetPercentage: el.percentage }

        return acc
    }, {})

    return tokensMap
}