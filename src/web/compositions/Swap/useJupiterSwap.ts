import { Jupiter, RouteInfo } from '@jup-ag/core'
import { PublicKey } from '@solana/web3.js'
import { useEffect, useRef, useState } from 'react'

import { useTokenInfos } from '@sb/dexUtils/tokenRegistry'

import { removeDecimals } from '@core/utils/helpers'
import { stripDigitPlaces } from '@core/utils/PortfolioTableUtils'

import { useJupiter } from './useJupiter'
import { getSwapRoute } from './utils'

export type UseJupiterSwapRouteProps = {
  inputMint?: string
  outputMint?: string
  slippage?: number
  inputMintDecimals?: number
  inputAmount?: number
}

export type UseJupiterSwapRouteResponse = {
  jupiter: Jupiter | null
  route: RouteInfo | null
  loading: boolean
  inputAmount: number | string
  outputAmount: number | string
  setInputsAmounts: (
    newOutputAmount: number | string,
    inputMintFromArgs?: string,
    outputMintFromArgs?: string
  ) => void
  refresh: () => Promise<void>
  reverseTokenAmounts: () => Promise<void>
}

export const useJupiterSwap = ({
  inputMint,
  outputMint,
  slippage = 0,
}: UseJupiterSwapRouteProps): UseJupiterSwapRouteResponse => {
  const jupiter = useJupiter()
  const tokenInfos = useTokenInfos()

  const [route, setRoute] = useState<RouteInfo | null>(null)

  const [inputAmount, setInputAmount] = useState<string | number>('')
  const [outputAmount, setOutputAmount] = useState<string | number>('')

  const [loading, setLoading] = useState(false)

  const lastEnteredAmountTimeRef = useRef({
    timestamp: Date.now(),
  })

  const setInputsAmounts = async (
    newAmount: string | number,
    inputMintFromArgs?: string,
    outputMintFromArgs?: string
  ) => {
    const startTime = Date.now()
    console.log('startTime', startTime)

    const inputMintForRoute = inputMintFromArgs ?? inputMint
    const outputMintForRoute = outputMintFromArgs ?? outputMint

    if (jupiter && inputMintForRoute && outputMintForRoute) {
      setLoading(true)
      setInputAmount(newAmount)

      const { decimals: inputMintDecimalsForRoute } = tokenInfos.get(
        inputMintForRoute
      ) || {
        decimals: 0,
      }

      const { decimals: outputMintDecimalsForRoute } = tokenInfos.get(
        outputMintForRoute
      ) || {
        decimals: 0,
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
        if (lastEnteredAmountTimeRef.current.timestamp > startTime) {
          return
        }

        lastEnteredAmountTimeRef.current.timestamp = startTime

        const swapAmountOut = removeDecimals(
          swapRoute.outAmount,
          outputMintDecimalsForRoute
        )

        // do not set 0, leave 0 placeholder
        if (swapAmountOut === 0) {
          setOutputAmount('')

          return
        }

        const strippedSwapAmountOut = stripDigitPlaces(swapAmountOut, 8)
        setRoute(swapRoute)
        setOutputAmount(strippedSwapAmountOut)
        setLoading(false)
      }
    }
  }

  useEffect(() => {
    setInputsAmounts(inputAmount, inputMint, outputMint)
  }, [inputMint, outputMint])

  const refreshArgsRef = useRef({
    inputAmount,
    outputAmount,
  })

  useEffect(() => {
    refreshArgsRef.current = {
      inputAmount,
      outputAmount,
    }
  }, [inputAmount, outputAmount])

  const refresh = async () => {
    await setInputsAmounts(refreshArgsRef.current.inputAmount)
  }

  const reverseTokenAmounts = async () => {
    await setInputsAmounts(outputAmount, outputMint, inputMint)
  }

  return {
    jupiter,
    route,
    loading,
    inputAmount,
    outputAmount,
    refresh,
    reverseTokenAmounts,
    setInputsAmounts,
  }
}
