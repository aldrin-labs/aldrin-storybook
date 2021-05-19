import { TokensMapType, TokenType } from '../Rebalance.types'

export const getTokensMap = (tokens: TokenType[]): TokensMapType => {
    const tokensMap = tokens.reduce((acc: TokensMapType, el) => {
        acc[el.symbol] = el

        return acc
    }, {})

    return tokensMap
}