import { TransactionFeeInfo } from '@jup-ag/core'
import { useEffect, useRef, useState } from 'react'

import { PoolInfo } from '@sb/compositions/Pools/index.types'
import { useOpenOrdersFromMarkets } from '@sb/compositions/Rebalance/utils/useOpenOrdersFromMarkets'
import { getMarketsMintsEdges } from '@sb/dexUtils/common/getMarketsMintsEdges'
import { useConnection } from '@sb/dexUtils/connection'
import { useAllMarketsList } from '@sb/dexUtils/markets'
import { useUserTokenAccounts } from '@sb/dexUtils/token/hooks'
import { AsyncSendSignedTransactionResult } from '@sb/dexUtils/types'
import { useWallet } from '@sb/dexUtils/wallet'

import { stripDigitPlaces } from '@core/utils/PortfolioTableUtils'

import { getPoolsMintsEdges } from '../getPoolsMintsEdges'
import { useAllMarketsOrderbooks } from '../hooks/useAllMarketsOrderbooks'
import { usePoolsBalances } from '../hooks/usePoolsBalances'
import { getMarketsInSwapPaths } from './getMarketsInSwapPaths'
import { getSwapRoute, SwapRoute } from './getSwapRoute'
import { multiSwap } from './multiSwap'

type UseSwapRouteProps = {
  pools: PoolInfo[]
  inputMint: string
  outputMint: string
  slippage: number
  selectedBaseTokenAddressFromSeveral?: string
  selectedQuoteTokenAddressFromSeveral?: string
}

type UseSwapRouteResponse = {
  price: number
  swapRoute: SwapRoute
  loading: boolean
  inputAmount: string | number
  outputAmount: string | number
  depositAndFee: null
  mints: string[]
  refresh: () => void
  setFieldAmount: (
    newAmount: string | number,
    field: 'input' | 'output',
    inputMintFromArgs?: string,
    outputMintFromArgs?: string
  ) => void
  exchange: () => AsyncSendSignedTransactionResult
}

export const useSwapRoute = ({
  pools = [],
  inputMint,
  outputMint,
  slippage = 0,
  selectedBaseTokenAddressFromSeveral,
  selectedQuoteTokenAddressFromSeveral,
}: UseSwapRouteProps): UseSwapRouteResponse => {
  const { wallet } = useWallet()
  const connection = useConnection()

  const allMarketsMap = useAllMarketsList()

  const [lastEnteredField, setLastEnteredField] = useState<'input' | 'output'>(
    'input'
  )
  const [swapRoute, setSwapRoute] = useState<SwapRoute>([])
  const [depositAndFee, setDepositAndFee] = useState<
    TransactionFeeInfo | undefined | null
  >(null)

  const [openOrdersMap, refreshOpenOrdersMap, isLoadingOpenOrdersMap] =
    useOpenOrdersFromMarkets()

  const [allTokensData, refreshAllTokensData] = useUserTokenAccounts()

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
    pools: swapRoute
      ?.filter((step) => step.ammLabel === 'Aldrin')
      .map((step) => step.pool),
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

  const refreshArgsRef = useRef({
    inputAmount,
    outputAmount,
    inputMint,
    outputMint,
    lastEnteredField,
    loading,
    marketsWithOrderbookMap,
  })

  const setFieldAmount = (
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

      const updateSwapRoute = () => {
        if (lastEnteredAmountTimeRef.current.timestamp > startTime) {
          return
        }

        setLastEnteredField(field)

        console.log('getSwapRoute', {
          poolsBalancesMap,
          marketsWithOrderbookMap,
        })

        const result = getSwapRoute({
          pools,
          field,
          slippage,
          allMarketsMap,
          baseTokenMint: inputMintForRoute,
          quoteTokenMint: outputMintForRoute,
          amountIn: +newAmount,
          poolsBalancesMap,
          marketsWithOrderbookMap:
            refreshArgsRef.current.marketsWithOrderbookMap,
        })

        if (!result) {
          if (typeof result !== 'object') {
            console.log('not object hmmmmmmmm', result)
          }

          setLoading(false)
          return
        }

        const [newSwapRoute, swapAmountOut] = result

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
    poolsBalancesMap,
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
    refreshArgsRef.current = {
      ...refreshArgsRef.current,
      inputAmount,
      outputAmount,
      lastEnteredField,
      loading,
      marketsWithOrderbookMap,
    }
  }, [
    inputAmount,
    outputAmount,
    lastEnteredField,
    loading,
    marketsWithOrderbookMap,
  ])

  const refresh = async () => {
    if (refreshArgsRef.current.loading) {
      console.log('loading the path already')
      return
    }

    setLoading(true)

    try {
      await refreshPoolsBalances()
      await refreshMarketsWithOrderbook()

      const amountToUse =
        refreshArgsRef.current.lastEnteredField === 'input'
          ? refreshArgsRef.current.inputAmount
          : refreshArgsRef.current.outputAmount

      await setFieldAmount(
        amountToUse,
        refreshArgsRef.current.lastEnteredField,
        refreshArgsRef.current.inputMint,
        refreshArgsRef.current.outputMint
      )
    } catch (e) {
      setLoading(false)
    }
  }

  useEffect(() => {
    refreshArgsRef.current = {
      ...refreshArgsRef.current,
      inputMint,
      outputMint,
    }

    console.log({
      isAllMarketsInSwapPathLoaded,
      marketsWithOrderbookMap,
    })

    refresh()
  }, [inputMint, outputMint, wallet.publicKey, slippage])

  const exchange = async () => {
    const result = await multiSwap({
      wallet,
      connection,
      allTokensData,
      swapRoute,
      openOrdersMap,
      selectedInputTokenAddressFromSeveral: selectedBaseTokenAddressFromSeveral,
      selectedOutputTokenAddressFromSeveral:
        selectedQuoteTokenAddressFromSeveral,
    })

    refreshOpenOrdersMap()

    return result
  }

  return {
    price,
    swapRoute,
    loading:
      loading ||
      !isAllMarketsInSwapPathLoaded ||
      (isLoadingOpenOrdersMap && marketsInSwapPaths.length > 0),
    inputAmount,
    outputAmount,
    depositAndFee,
    mints,
    refresh,
    exchange,
    setFieldAmount,
  }
}
