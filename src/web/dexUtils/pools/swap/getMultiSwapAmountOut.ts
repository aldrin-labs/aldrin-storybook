import { TokenInfo } from '@solana/spl-token-registry'
import BN from 'bn.js'

import { PoolInfo } from '@sb/compositions/Pools/index.types'

import { Graph } from '@core/utils/graph/Graph'

import { getSelectedPoolForSwap } from '.'
import { PoolBalances } from '../hooks'
import { getMinimumReceivedAmountFromSwap } from './getMinimumReceivedAmountFromSwap'

type Step = {
  pool: PoolInfo
  isSwapBaseToQuote: boolean
  swapAmountIn: number
  swapAmountOut: number
}

export type Route = Step[]

const getMultiSwapAmountOut = ({
  pools,
  tokensMap,
  amountIn,
  baseTokenMint,
  quoteTokenMint,
  slippage,
}: {
  pools: PoolInfo[]
  amountIn: number
  tokensMap: Map<string, TokenInfo>
  baseTokenMint: string
  quoteTokenMint: string
  slippage: number
}): [number, Route] => {
  const graph = new Graph()

  pools.forEach((pool) => {
    graph.addEdge(pool.tokenA, pool.tokenB)
  })

  const allPaths = graph.getAllPaths(baseTokenMint, quoteTokenMint)
  const shortPaths = allPaths.filter((path) => path.length <= 4)

  const routes: [number, Route][] = shortPaths.map((path) => {
    const route: Route = []

    let baseMint = ''
    let quoteMint = ''

    let tempSwapAmountIn = amountIn
    let multiSwapAmountOut = 0

    path.forEach((mint, index) => {
      const symbol = tokensMap.get(mint)?.symbol

      if (!symbol) {
        return
      }

      // determine pool & side
      if (index === 0) {
        baseMint = mint
        return
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

      console.log('data', {
        pool,
        baseMint,
        isSwapBaseToQuote,
      })

      const poolBalances: PoolBalances = {
        baseTokenAmount: pool.tvl.tokenA,
        quoteTokenAmount: pool.tvl.tokenB,
        baseTokenAmountBN: new BN(pool.tvl.tokenA * 10 ** pool.tokenADecimals),
        quoteTokenAmountBN: new BN(pool.tvl.tokenB * 10 ** pool.tokenBDecimals),
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
    })

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
