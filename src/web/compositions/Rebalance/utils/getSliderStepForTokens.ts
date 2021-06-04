import { TokenType } from '../Rebalance.types'
import { getDecimalCount } from '@sb/dexUtils/utils'
import { stripDigitPlaces } from '@core/utils/PortfolioTableUtils'



export const getSliderStepForTokens = (tokens: any[], totalTokenValue: number) => {
    const tokensWithSliderStep = tokens.map(el => {

        let decimalCount, stepInAmountToken, stepInValueToken, stepInPercentageToken

            // TODO: Fetch decimal count from blockchain 
            decimalCount = getDecimalCount(el.amount)
            stepInAmountToken = stripDigitPlaces(1 / Math.pow(10, decimalCount), decimalCount)
            stepInValueToken = stepInAmountToken * el.price
            stepInPercentageToken = stepInAmountToken * 100 / (totalTokenValue / el.price)

        return { ...el, stepInAmountToken, stepInValueToken, stepInPercentageToken, decimalCount }
    })

    // console.log('tokensWithSliderStep: ', tokensWithSliderStep)

    return tokensWithSliderStep
}