import { RouteInfo, TransactionFeeInfo } from '@jup-ag/core'
import { TokenInfo } from '@solana/spl-token-registry'
import { LAMPORTS_PER_SOL } from '@solana/web3.js'
import { COLORS } from '@variables/variables'
import React from 'react'

import { Loading } from '@sb/components'
import { TRANSACTION_COMMON_SOL_FEE } from '@sb/components/TraidingTerminal/utils'

import { removeDecimals } from '@core/utils/helpers'

export const getSwapButtonText = ({
  isTokenABalanceInsufficient,
  isLoadingSwapRoute,
  baseSymbol,
  minInputAmount,
  isTooSmallInputAmount,
  isSwapRouteExists,
  needEnterAmount,
  isSwapInProgress,
}: {
  isTokenABalanceInsufficient: boolean
  isLoadingSwapRoute: boolean
  baseSymbol: string
  minInputAmount: number
  isTooSmallInputAmount: boolean
  isSwapRouteExists: boolean
  needEnterAmount: boolean
  isSwapInProgress: boolean
}) => {
  if (isSwapInProgress) {
    return (
      <>
        <Loading
          size="1em"
          color={COLORS.white}
          margin="0 0.6em 0 0"
          style={{ display: 'flex' }}
        />{' '}
        <span>Swapping</span>
      </>
    )
  }

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
      depositAndFee.ataDeposit * depositAndFee.ataDepositLength +
      depositAndFee.openOrdersDeposits.reduce((acc, n) => acc + n, 0) +
      depositAndFee.signatureFee / LAMPORTS_PER_SOL
    )
  }

  return swapRoute?.marketInfos.length * TRANSACTION_COMMON_SOL_FEE
}
