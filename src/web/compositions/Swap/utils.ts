import { Jupiter, RouteInfo } from '@jup-ag/core'
import { TokenInfo } from '@solana/spl-token-registry'
import { PublicKey } from '@solana/web3.js'

import { removeDecimals } from '@core/utils/helpers'

const AMMS_TO_USE = ['Aldrin', 'Serum']

export const getSwapRoute = async ({
  jupiter,
  inputMint,
  inputMintDecimals,
  outputMint,
  inputAmount,
  slippage,
}: {
  jupiter: Jupiter
  inputMint?: PublicKey
  inputMintDecimals?: number
  outputMint?: PublicKey
  inputAmount: number
  slippage: number
}) => {
  try {
    if (!jupiter || !inputMint || !outputMint) {
      return null
    }

    const inputAmountInSmallestUnits = inputMintDecimals
      ? Math.round(inputAmount * 10 ** inputMintDecimals)
      : 0
    const routes =
      inputMint && outputMint
        ? await jupiter.computeRoutes(
            new PublicKey(inputMint),
            new PublicKey(outputMint),
            inputAmountInSmallestUnits, // raw input amount of tokens
            slippage,
            true
          )
        : null

    const filteredRoutes =
      routes && routes.routesInfos
        ? routes.routesInfos.filter((route) =>
            route.marketInfos.every((marketInfo) =>
              AMMS_TO_USE.includes(marketInfo.marketMeta.amm.label)
            )
          )
        : []

    return filteredRoutes[0]
  } catch (error) {
    console.log('error', error)
    throw error
  }
}

export const getSwapButtonText = ({
  isTokenABalanceInsufficient,
  isLoadingSwapRoute,
  baseSymbol,
  minInputAmount,
  isTooSmallInputAmount,
  isSwapRouteExists,
  needEnterAmount,
}: {
  isTokenABalanceInsufficient: boolean
  isLoadingSwapRoute: boolean
  baseSymbol: string
  minInputAmount: number
  isTooSmallInputAmount: boolean
  isSwapRouteExists: boolean
  needEnterAmount: boolean
}) => {
  if (needEnterAmount) {
    return 'Enter amount'
  }

  if (isTooSmallInputAmount) {
    return `Min. input amount: ${minInputAmount} ${baseSymbol}`
  }

  if (isLoadingSwapRoute) {
    return 'Searching the best route...'
  }

  if (isTokenABalanceInsufficient) {
    return `Insufficient ${baseSymbol} Balance`
  }

  if (!isSwapRouteExists) {
    return 'No route for swap'
  }

  return 'Swap'
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
