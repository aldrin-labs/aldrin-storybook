import { TokensMapType, TokenType } from '../Rebalance.types'

export const getTokensMap = (tokens: TokenType[]) => {
    const tokensMap = tokens.reduce((acc: TokensMapType, el) => {
        acc[el.symbol] = el

        return acc
    }, {})

    return tokensMap
}