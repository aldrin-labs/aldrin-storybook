import { TokenType } from '../Rebalance.types'
import { getDecimalCount } from '@sb/dexUtils/utils'
import { stripDigitPlaces } from '@core/utils/PortfolioTableUtils'



export const getSliderStepForTokens = (tokens: any[], totalTokenValue) => {
    const tokensWithSliderStep = tokens.map(el => {

        const decimalCount: number = getDecimalCount(el.amount)
        // const stepInAmount = 1 / Math.pow(10, decimalCount -4)
        // const stepInValue = el.tokenValue * stepInAmount / el.amount

        // const stepInPercentage = (el.percentage * stepInAmount) / el.amount

        // const stepInAmountTokenRaw = el.amount * 0.01 / el.tokenValue
        // const stepInAmountToken = +stripDigitPlaces(stepInAmountTokenRaw, decimalCount)
        //  + 1 / Math.pow(10, decimalCount)
        // const stepInValue = +(stepInAmountToken * el.tokenValue / el.amount).toFixed(2)
        // const stepInPercentage = +(stepInAmountToken * el.percentage / el.amount).toFixed(2)


        // const stepInAmountToken = +stripDigitPlaces(el.amount * 0.1 / el.tokenValue, el.decimalCount)
        const stepInAmountToken = stripDigitPlaces(el.amount * 0.1 / el.tokenValue, decimalCount)
        // const stepInAmountToken = stripDigitPlaces(1 / Math.pow(10, decimalCount), decimalCount)

        const stepInValueToken = stepInAmountToken * el.tokenValue / el.amount
        const stepInPercentageToken = el.percentage * stepInAmountToken / el.amount



        return { ...el, stepInAmountToken, stepInValueToken, stepInPercentageToken, decimalCount }
    })

    console.log('tokensWithSliderStep: ', tokensWithSliderStep)

    return tokensWithSliderStep
}