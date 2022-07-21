import { AmmLabel, SwapRoute, SwapStep } from '@likbes_/swap-hook'

export const getSwapButtonText = ({
  isTokenABalanceInsufficient,
  isLoadingSwapRoute,
  baseSymbol,
  minInputAmount,
  isTooSmallInputAmount,
  isSwapRouteExists,
  isEmptyInputAmount,
  isSwapInProgress,
}: {
  isTokenABalanceInsufficient: boolean
  isLoadingSwapRoute: boolean
  baseSymbol: string
  minInputAmount: number
  isTooSmallInputAmount: boolean
  isSwapRouteExists: boolean
  isEmptyInputAmount: boolean
  isSwapInProgress: boolean
}) => {
  switch (true) {
    case isSwapInProgress:
      return 'Swapping...'
    case isEmptyInputAmount:
      return 'Enter amount'
    case isTooSmallInputAmount:
      return `Min. input amount: ${minInputAmount} ${baseSymbol}`
    case isLoadingSwapRoute:
      return 'Searching the best route...'
    case isTokenABalanceInsufficient:
      return `Insufficient ${baseSymbol} Balance`
    case !isSwapRouteExists:
      return 'No route for swap'
    default:
      return 'Swap'
  }
}

export const getEstimatedPrice = ({
  inputAmount,
  outputAmount,
  inputPrice,
  outputPrice,
  field = 'input',
}: {
  inputAmount?: number
  outputAmount?: number
  inputPrice: number
  outputPrice: number
  field: 'input' | 'output'
}) => {
  const isInputPriceToCalculate = field === 'input'

  if (inputAmount && outputAmount) {
    if (isInputPriceToCalculate) {
      return outputAmount / inputAmount
    }
    return inputAmount / outputAmount
  }

  if (inputPrice && outputPrice) {
    if (isInputPriceToCalculate) {
      return inputPrice / outputPrice
    }
    return outputPrice / inputPrice
  }

  return 0
}

const marketTypeFromAmm: { [key in AmmLabel]: number } = {
  Serum: 0,
  Aldrin: 2,
}

export const getOHLCVMarketTypeFromSwapRoute = (swapRoute: SwapRoute) => {
  if (swapRoute.steps.length > 0) {
    return marketTypeFromAmm[swapRoute.steps[0].ammLabel]
  }

  // as default
  return marketTypeFromAmm.Aldrin
}

export const getOHLCVSymbols = (swapSteps: SwapStep[]) => {
  if (swapSteps.length > 1) {
    return [swapSteps[0].inputMint, swapSteps[swapSteps.length - 1].outputMint]
  }

  if (swapSteps.length === 1) {
    const { isSwapBaseToQuote, inputMint, outputMint } = swapSteps[0]
    return isSwapBaseToQuote ? [inputMint, outputMint] : [outputMint, inputMint]
  }

  return [null, null]
}
