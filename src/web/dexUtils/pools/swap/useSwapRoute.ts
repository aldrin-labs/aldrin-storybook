import { TransactionFeeInfo } from '@jup-ag/core'
import { useEffect, useRef, useState } from 'react'

import { getMarketsMintsEdges } from '@sb/dexUtils/common/getMarketsMintsEdges'
import { useAllMarketsList } from '@sb/dexUtils/markets'
import { useTokenInfos } from '@sb/dexUtils/tokenRegistry'

import { stripDigitPlaces } from '@core/utils/PortfolioTableUtils'

import { getPoolsMintsEdges } from '../getPoolsMintsEdges'
import { useAllMarketsOrderbooks } from '../hooks/useAllMarketsOrderbooks'
import { usePoolsBalances } from '../hooks/usePoolsBalances'
import { getMarketsInSwapPaths } from './getMarketsInSwapPaths'
import { getSwapRoute, SwapRoute } from './getSwapRoute'
import { UseJupiterSwapRouteProps, UseJupiterSwapRouteResponse } from './types'

export const useSwapRoute = ({
  pools = [],
  inputMint,
  outputMint,
  slippage = 0,
}: UseJupiterSwapRouteProps): UseJupiterSwapRouteResponse => {
  const tokenInfos = useTokenInfos()
  const allMarketsMap = useAllMarketsList()

  const [lastEnteredField, setLastEnteredField] = useState<'input' | 'output'>(
    'input'
  )
  const [swapRoute, setSwapRoute] = useState<SwapRoute>([])
  const [depositAndFee, setDepositAndFee] = useState<
    TransactionFeeInfo | undefined | null
  >(null)

  const [inputAmount, setInputAmount] = useState<string | number>('')
  const [outputAmount, setOutputAmount] = useState<string | number>('')

  const [loading, setLoading] = useState(false)

  const lastEnteredAmountTimeRef = useRef({
    timestamp: Date.now(),
  })

  const marketsInSwapPaths = getMarketsInSwapPaths({
    pools,
    allMarketsMap,
    startNode: inputMint,
    endNode: outputMint,
  })

  console.log({
    marketsInSwapPaths,
  })

  const [poolsBalancesMap, refreshPoolsBalances] = usePoolsBalances({
    pools: swapRoute?.map((step) => step.pool),
  })

  const [marketsWithOrderbookMap, refreshMarketsWithOrderbook] =
    useAllMarketsOrderbooks({
      marketsNames: marketsInSwapPaths,
    })

  const isAllMarketsInSwapPathLoaded = marketsInSwapPaths.reduce(
    (checker, marketName) => {
      if (!checker || !marketsWithOrderbookMap.has(marketName)) {
        return false
      }

      return checker
    },
    true
  )

  console.log({
    isAllMarketsInSwapPathLoaded,
    marketsWithOrderbookMap,
  })

  const setFieldAmount = async (
    newAmount: string | number,
    field: 'input' | 'output',
    inputMintFromArgs?: string,
    outputMintFromArgs?: string
  ) => {
    const startTime = Date.now()
    const isInputFieldEntered = field === 'input'

    lastEnteredAmountTimeRef.current.timestamp = startTime

    const inputMintForRoute = inputMintFromArgs ?? inputMint
    const outputMintForRoute = outputMintFromArgs ?? outputMint

    if (inputMintForRoute && outputMintForRoute) {
      if (isInputFieldEntered) {
        setInputAmount(newAmount)
      } else {
        setOutputAmount(newAmount)
      }

      setLoading(true)

      const updateSwapRoute = async () => {
        if (lastEnteredAmountTimeRef.current.timestamp > startTime) {
          return
        }

        setLastEnteredField(field)

        const [newSwapRoute, swapAmountOut] = getSwapRoute({
          pools,
          field,
          allMarketsMap,
          baseTokenMint: inputMint,
          quoteTokenMint: outputMint,
          amountIn: +newAmount,
          poolsBalancesMap,
          marketsWithOrderbookMap,
        })
        const strippedSwapAmountOut =
          swapAmountOut === 0 ? '' : stripDigitPlaces(swapAmountOut, 8)
        // const routeDepositAndFee = await swapRoute.getDepositAndFee()

        setSwapRoute(newSwapRoute)
        // setDepositAndFee(routeDepositAndFee)

        // do not set 0, leave 0 placeholder
        if (isInputFieldEntered) {
          setOutputAmount(strippedSwapAmountOut)
        } else {
          setInputAmount(strippedSwapAmountOut)
        }

        setLoading(false)
      }

      setTimeout(updateSwapRoute, 250)
    }
  }

  const [_, price] = getSwapRoute({
    pools,
    allMarketsMap,
    baseTokenMint: inputMint,
    quoteTokenMint: outputMint,
    amountIn: 1,
    marketsWithOrderbookMap,
  })

  const mints = [
    ...new Set(
      [
        ...getPoolsMintsEdges(pools),
        ...getMarketsMintsEdges([...allMarketsMap.keys()]),
      ].flat()
    ),
  ]

  useEffect(() => {
    const amountToUse =
      lastEnteredField === 'input' ? inputAmount : outputAmount

    setFieldAmount(amountToUse, lastEnteredField, inputMint, outputMint)
  }, [inputMint, outputMint, slippage])

  const refreshArgsRef = useRef({
    inputAmount,
    outputAmount,
    inputMint,
    outputMint,
    lastEnteredField,
  })

  useEffect(() => {
    refreshArgsRef.current = {
      inputAmount,
      outputAmount,
      inputMint,
      outputMint,
      lastEnteredField,
    }
  }, [inputAmount, outputAmount, inputMint, outputMint, lastEnteredField])

  const refresh = async () => {
    const amountToUse =
      refreshArgsRef.current.lastEnteredField === 'input'
        ? refreshArgsRef.current.inputAmount
        : refreshArgsRef.current.outputAmount

    await refreshPoolsBalances()
    await refreshMarketsWithOrderbook()
    await setFieldAmount(
      amountToUse,
      refreshArgsRef.current.lastEnteredField,
      refreshArgsRef.current.inputMint,
      refreshArgsRef.current.outputMint
    )
  }

  return {
    price,
    swapRoute,
    loading: loading || !isAllMarketsInSwapPathLoaded,
    inputAmount,
    outputAmount,
    depositAndFee,
    mints,
    refresh,
    setFieldAmount,
  }
}
