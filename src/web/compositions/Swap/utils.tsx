import { RouteInfo, TransactionFeeInfo } from '@jup-ag/core'
import { TokenInfo } from '@solana/spl-token-registry'
import { LAMPORTS_PER_SOL } from '@solana/web3.js'

import { TRANSACTION_COMMON_SOL_FEE } from '@sb/components/TraidingTerminal/utils'
import { AmmLabel, SwapRoute } from '@sb/dexUtils/pools/swap/getSwapRoute'

import { removeDecimals } from '@core/utils/helpers'

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

export const getFeeFromSwapRoute = ({
  route,
  tokenInfos,
  pricesMap,
}: {
  route?: RouteInfo | null
  tokenInfos: Map<string, TokenInfo>
  pricesMap: Map<string, number>
}) => {
  if (!route) {
    return 0
  }

  return route.marketInfos.reduce((totalFeeUSD, marketInfo) => {
    const { label } = marketInfo.marketMeta.amm

    if (label === 'Serum') {
      // charge extra fees
    }

    const { mint, amount } = marketInfo.lpFee
    const { decimals, symbol } = tokenInfos.get(mint) || {
      decimals: 0,
      symbol: '',
    }

    const price = pricesMap.get(symbol) || 0

    const amountWithoutDecimals = removeDecimals(amount, decimals)
    const amountUSD = amountWithoutDecimals * price

    return totalFeeUSD + amountUSD
  }, 0)
}

export const getRouteMintsPath = (swapRoute: RouteInfo | null) => {
  if (!swapRoute || !swapRoute.marketInfos) return []
  return swapRoute.marketInfos.reduce<string[]>((acc, marketInfo, index) => {
    if (index === 0) {
      acc.push(
        marketInfo.inputMint.toString(),
        marketInfo.outputMint.toString()
      )
    } else {
      acc.push(marketInfo.outputMint.toString())
    }

    return acc
  }, [])
}

export const getSwapNetworkFee = ({
  swapRoute,
  depositAndFee,
}: {
  swapRoute: RouteInfo | null
  depositAndFee: TransactionFeeInfo | null | undefined
}) => {
  if (!swapRoute) {
    return 0
  }

  if (depositAndFee) {
    return (
      (depositAndFee.ataDeposit * depositAndFee.ataDepositLength +
        depositAndFee.openOrdersDeposits.reduce((acc, n) => acc + n, 0) +
        depositAndFee.signatureFee) /
      LAMPORTS_PER_SOL
    )
  }

  return swapRoute?.marketInfos.length * TRANSACTION_COMMON_SOL_FEE
}

const marketTypeFromAmm: { [key in AmmLabel]: number } = {
  Serum: 0,
  Aldrin: 2,
}

export const getOHLCVMarketTypeFromSwapRoute = (swapRoute: SwapRoute) => {
  if (swapRoute.length > 0) {
    return marketTypeFromAmm[swapRoute[0].ammLabel]
  }

  // as default
  return marketTypeFromAmm.Aldrin
}

export const getOHLCVSymbols = (swapRoute: SwapRoute) => {
  if (swapRoute.length === 1) {
    const { isSwapBaseToQuote, inputMint, outputMint } = swapRoute[0]
    return isSwapBaseToQuote ? [inputMint, outputMint] : [outputMint, inputMint]
  }

  return [null, null]
}
