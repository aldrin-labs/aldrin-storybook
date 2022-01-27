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

export type InputField = 'input' | 'output'

export type UseJupiterSwapRouteResponse = {
  jupiter: Jupiter | null
  route: RouteInfo | null
  inputAmount: number | string
  outputAmount: number | string
  lastUsedInput: InputField
  setInputsAmounts: (
    newOutputAmount: number | string,
    enteredField: InputField,
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

  const [lastUsedInput, setLastUsedInput] = useState<InputField>('input')

  // separate to another hook

  const setInputsAmounts = async (
    newAmount: string | number,
    enteredField: InputField,
    inputMintFromArgs?: string,
    outputMintFromArgs?: string
  ) => {
    console.log('start setInputsAmounts', {
      newAmount,
      lastUsedInput,
    })
    const isEneteredInputField = enteredField === 'input'

    const inputMintForRoute = isEneteredInputField
      ? inputMintFromArgs ?? inputMint
      : outputMintFromArgs ?? outputMint

    const outputMintForRoute = isEneteredInputField
      ? outputMintFromArgs ?? outputMint
      : inputMintFromArgs ?? inputMint

    if (jupiter && inputMintForRoute && outputMintForRoute) {
      setLastUsedInput(enteredField)
      if (isEneteredInputField) {
        setInputAmount(newAmount)
      } else {
        setOutputAmount(newAmount)
      }

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

      console.log({
        swapRoute,
        isEneteredInputField,
        newAmount,
      })

      if (swapRoute) {
        const swapAmountOut = removeDecimals(
          swapRoute.outAmount,
          outputMintDecimalsForRoute
        )

        // do not set 0, leave 0 placeholder
        if (swapAmountOut === 0) {
          if (isEneteredInputField) {
            setOutputAmount('')
          } else {
            setInputAmount('')
          }
          return
        }

        console.log('end setInputsAmounts, set', {
          swapAmountOut,
          newAmount,
          lastUsedInput,
        })

        const strippedSwapAmountOut = stripDigitPlaces(swapAmountOut, 8)
        setRoute(swapRoute)
        if (isEneteredInputField) {
          setOutputAmount(strippedSwapAmountOut)
        } else {
          setInputAmount(strippedSwapAmountOut)
        }
      }
    }
  }

  const refreshArgsRef = useRef({
    lastUsedInput,
    inputAmount,
    outputAmount,
  })

  useEffect(() => {
    refreshArgsRef.current = {
      lastUsedInput,
      inputAmount,
      outputAmount,
    }
  }, [lastUsedInput, inputAmount, outputAmount])

  const refresh = async () => {
    if (refreshArgsRef.current.lastUsedInput === 'input') {
      await setInputsAmounts(refreshArgsRef.current.inputAmount, 'input')
    } else {
      await setInputsAmounts(refreshArgsRef.current.outputAmount, 'output')
    }
  }

  const reverseTokenAmounts = async () => {
    // const amountToUse = lastUsedInput === 'input' ? inputAmount : outputAmount
    // const reversedInputField = lastUsedInput === 'input' ? 'output' : 'input'

    await setInputsAmounts(outputAmount, 'input', outputMint, inputMint)
  }

  return {
    jupiter,
    route,
    inputAmount,
    outputAmount,
    lastUsedInput,
    refresh,
    reverseTokenAmounts,
    setInputsAmounts,
  }
}
