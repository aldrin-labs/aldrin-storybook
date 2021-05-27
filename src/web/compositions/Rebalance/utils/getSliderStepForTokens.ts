import { TokenType } from '../Rebalance.types'
import { getDecimalCount } from '@sb/dexUtils/utils'
import { stripDigitPlaces } from '@core/utils/PortfolioTableUtils'



export const getSliderStepForTokens = (tokens: any[], totalTokenValue) => {
    const tokensWithSliderStep = tokens.map(el => {

        let decimalCount, stepInAmountToken, stepInValueToken, stepInPercentageToken
        
        // with if else we are handling case with zero amount
        if (el.amount === 0) {
            decimalCount = 4
            stepInAmountToken = stripDigitPlaces(1 / Math.pow(10, decimalCount), decimalCount)

            // with if else we are handling case with zero amount
            stepInValueToken = stepInAmountToken * el.price 
            stepInPercentageToken = stepInValueToken

        } else {
            decimalCount = getDecimalCount(el.amount)
            // const stepInAmountToken = stripDigitPlaces(el.amount * 0.1 / el.tokenValue, decimalCount)
            stepInAmountToken = stripDigitPlaces(1 / Math.pow(10, decimalCount), decimalCount)
            stepInValueToken = stepInAmountToken * el.tokenValue / el.amount
            stepInPercentageToken = el.percentage * stepInAmountToken / el.amount
        }


        return { ...el, stepInAmountToken, stepInValueToken, stepInPercentageToken, decimalCount }
    })

    console.log('tokensWithSliderStep: ', tokensWithSliderStep)

    return tokensWithSliderStep
}