import { AmmLabel, SwapRoute, SwapStep } from '@likbes_/swap-hook'
import React from 'react'

import { SvgIcon } from '@sb/components'
import { Text } from '@sb/components/Typography'
import { Row } from '@sb/compositions/AnalyticsRoute/index.styles'

import SwapArrowsIcon from '@icons/swap-arrows.svg'

export const getSwapButtonText = ({
  isTokenABalanceInsufficient,
  isLoadingSwapRoute,
  baseSymbol,
  isSwapRouteExists,
  isEmptyInputAmount,
  pricesDiffPct,
  swapStatus,
}: {
  isTokenABalanceInsufficient: boolean
  isLoadingSwapRoute: boolean
  baseSymbol: string
  isSwapRouteExists: boolean
  isEmptyInputAmount: boolean
  isSwapInProgress: boolean
  pricesDiffPct: number
  swapStatus: string | null
}) => {
  if (swapStatus === 'initializing-transaction') {
    return 'Initializing transaction...'
  }
  if (swapStatus === 'pending-confirmation') {
    return 'Transaction pending confirmation in the wallet...'
  }
  if (swapStatus === 'initialize') {
    return 'Swapping...'
  }

  switch (true) {
    case isEmptyInputAmount:
      return 'Enter amount'
    case isLoadingSwapRoute:
      return 'Searching the best route...'
    case isTokenABalanceInsufficient:
      return `Insufficient ${baseSymbol} Balance`
    case !isSwapRouteExists:
      return 'No route for swap'
    default:
      return pricesDiffPct < -1 ? (
        <Row direction="column">
          <Text margin="0" weight={600} size="es" color="red1">
            {Math.abs(pricesDiffPct)}% more expensive than CoinGecko price
          </Text>
          <Text margin="0" weight={600} size="md" color="red1">
            Swap Anyway
          </Text>
        </Row>
      ) : (
        <Row align="center">
          <SvgIcon src={SwapArrowsIcon} width="1em" height="1em" />
          <Row margin="0 0 0 0.3em">Swap</Row>
        </Row>
      )
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
