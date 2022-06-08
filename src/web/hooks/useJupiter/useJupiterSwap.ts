import { RouteInfo, TransactionFeeInfo } from '@jup-ag/core'
import { PublicKey } from '@solana/web3.js'
import { useEffect, useRef, useState } from 'react'

import { useTokenInfos } from '@sb/dexUtils/tokenRegistry'

import { removeDecimals } from '@core/utils/helpers'
import { stripDigitPlaces } from '@core/utils/PortfolioTableUtils'

import { getSwapRoute } from './getSwapRoute'
import { UseJupiterSwapRouteProps, UseJupiterSwapRouteResponse } from './types'
import { useJupiter } from './useJupiter'

export const useJupiterSwap = ({
  inputMint,
  outputMint,
  slippage = 0,
}: UseJupiterSwapRouteProps): UseJupiterSwapRouteResponse => {
  const jupiter = useJupiter()
  const tokenInfos = useTokenInfos()

  const [route, setRoute] = useState<RouteInfo | null>(null)
  const [depositAndFee, setDepositAndFee] = useState<TransactionFeeInfo | undefined | null>(null)

  const [inputAmount, setRawInputAmount] = useState<string | number>('')
  const [outputAmount, setOutputAmount] = useState<string | number>('')

  const [loading, setLoading] = useState(false)

  const lastEnteredAmountTimeRef = useRef({
    timestamp: Date.now(),
  })

  const setInputAmount = async (
    newAmount: string | number,
    inputMintFromArgs?: string,
    outputMintFromArgs?: string
  ) => {
    const startTime = Date.now()
    lastEnteredAmountTimeRef.current.timestamp = startTime

    const inputMintForRoute = inputMintFromArgs ?? inputMint
    const outputMintForRoute = outputMintFromArgs ?? outputMint

    if (jupiter && inputMintForRoute && outputMintForRoute) {
      setRawInputAmount(newAmount)
      setLoading(true)

      const { decimals: inputMintDecimalsForRoute } = tokenInfos.get(inputMintForRoute) || {
        decimals: 0,
      }

      const { decimals: outputMintDecimalsForRoute } = tokenInfos.get(outputMintForRoute) || {
        decimals: 0,
      }

      const updateSwapRoute = async () => {
        if (lastEnteredAmountTimeRef.current.timestamp > startTime) {
          return
        }

        const swapRoute = await getSwapRoute({
          jupiter,
          slippage,
          inputAmount: +newAmount,
          inputMint: new PublicKey(inputMintForRoute),
          outputMint: new PublicKey(outputMintForRoute),
          inputMintDecimals: inputMintDecimalsForRoute,
        })

        if (swapRoute) {
          const swapAmountOut = removeDecimals(swapRoute.outAmount, outputMintDecimalsForRoute)

          const strippedSwapAmountOut = stripDigitPlaces(swapAmountOut, 8)
          const routeDepositAndFee = await swapRoute.getDepositAndFee()

          setRoute(swapRoute)
          setDepositAndFee(routeDepositAndFee)

          // do not set 0, leave 0 placeholder
          setOutputAmount(swapAmountOut === 0 ? '' : strippedSwapAmountOut)
          setLoading(false)
        }
      }

      setTimeout(updateSwapRoute, 250)
    }
  }

  // clearInterval if last entered time !== startTime in 250ms

  useEffect(() => {
    setInputAmount(inputAmount, inputMint, outputMint)
  }, [inputMint, outputMint, slippage])

  const refreshArgsRef = useRef({
    inputAmount,
    inputMint,
    outputMint,
  })

  useEffect(() => {
    refreshArgsRef.current = {
      inputAmount,
      inputMint,
      outputMint,
    }
  }, [inputAmount, inputMint, outputMint])

  const refresh = async () => {
    await setInputAmount(
      refreshArgsRef.current.inputAmount,
      refreshArgsRef.current.inputMint,
      refreshArgsRef.current.outputMint
    )
  }

  return {
    jupiter,
    route,
    loading,
    inputAmount,
    outputAmount,
    depositAndFee,
    refresh,
    setInputAmount,
  }
}
