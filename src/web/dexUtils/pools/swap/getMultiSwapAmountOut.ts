import { PoolInfo } from '@sb/compositions/Pools/index.types'

import { Graph } from '@core/utils/graph/Graph'
import { toBNWithDecimals } from '@core/utils/helpers'

import { getSelectedPoolForSwap } from '.'
import { PoolBalances } from '../hooks'
import { getMinimumReceivedAmountFromSwap } from './getMinimumReceivedAmountFromSwap'

type SwapStep = {
  pool: PoolInfo
  isSwapBaseToQuote: boolean
  swapAmountIn: number
  swapAmountOut: number
}

export type SwapRoute = SwapStep[]

const getMultiSwapAmountOut = ({
  pools,
  amountIn,
  baseTokenMint,
  quoteTokenMint,
  slippage,
}: {
  pools: PoolInfo[]
  amountIn: number
  baseTokenMint: string
  quoteTokenMint: string
  slippage?: number
}): [number, SwapRoute | null] => {
  const graph = new Graph()

  pools.forEach((pool) => {
    graph.addEdge(pool.tokenA, pool.tokenB)
  })

  const allPaths = graph.getAllPaths(baseTokenMint, quoteTokenMint)

  if (allPaths.length === 0) {
    return [0, null]
  }

  let shortPaths = allPaths.filter((path) => path.length <= 4)

  if (shortPaths.length === 0 && allPaths.length > 0) {
    shortPaths = allPaths
  }

  const routes: [number, SwapRoute][] = shortPaths.map((path) => {
    const route: SwapRoute = []

    let baseMint = ''
    let quoteMint = ''

    let tempSwapAmountIn = amountIn
    let multiSwapAmountOut = 0

    let index = 0

    for (const mint of path) {
      // determine pool & side
      if (index === 0) {
        baseMint = mint
        index += 1
        continue
      }

      if (index === 1) {
        quoteMint = mint
      } else {
        baseMint = quoteMint
        quoteMint = mint
      }

      const pool = getSelectedPoolForSwap({
        pools,
        baseTokenMintAddress: baseMint,
        quoteTokenMintAddress: quoteMint,
      })

      const isSwapBaseToQuote = pool.tokenA === baseMint

      const poolBalances: PoolBalances = {
        baseTokenAmount: pool.tvl.tokenA,
        quoteTokenAmount: pool.tvl.tokenB,
        baseTokenAmountBN: toBNWithDecimals(
          pool.tvl.tokenA,
          pool.tokenADecimals
        ),
        quoteTokenAmountBN: toBNWithDecimals(
          pool.tvl.tokenB,
          pool.tokenBDecimals
        ),
      }

      const swapAmountOut = getMinimumReceivedAmountFromSwap({
        pool,
        slippage,
        swapAmountIn: tempSwapAmountIn,
        isSwapBaseToQuote,
        poolBalances,
      })

      route.push({
        pool,
        swapAmountIn: tempSwapAmountIn,
        swapAmountOut,
        isSwapBaseToQuote,
      })

      tempSwapAmountIn = swapAmountOut
      multiSwapAmountOut = swapAmountOut

      index += 1
    }

    return [multiSwapAmountOut, route]
  })

  const bestRoute = routes.sort((a, b) => {
    const [swapAmountOutB] = b
    const [swapAmountOutA] = a

    return swapAmountOutB - swapAmountOutA
  })[0]

  return bestRoute
}

export { getMultiSwapAmountOut }
