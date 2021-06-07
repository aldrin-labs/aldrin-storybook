import { TokenType } from '../Rebalance.types'
import { stripDigitPlaces } from '@core/utils/PortfolioTableUtils'

export const getSliderStepForTokens = (tokens: TokenType[], totalTokenValue: number) => {
    const tokensWithSliderStep = tokens.map(el => {
        let decimalCount, stepInAmountToken, stepInValueToken, stepInPercentageToken

            decimalCount = el.decimals
            stepInAmountToken = stripDigitPlaces(1 / Math.pow(10, decimalCount), decimalCount)
            stepInValueToken = stepInAmountToken * el.price
            stepInPercentageToken = stepInAmountToken * 100 / (totalTokenValue / el.price)

        return { ...el, stepInAmountToken, stepInValueToken, stepInPercentageToken, decimalCount }
    })

    return tokensWithSliderStep
}