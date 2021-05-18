import { PoolInfo } from '../Rebalance.types'
import { REBALANCE_CONFIG } from '../Rebalance.config'

export const getAvailableTokensForRebalance = (
  poolsInfo: PoolInfo[],
  tokens: {
    symbol: string
    decimals: number
    amount: number
    price: number | null
    mint: string
    tokenValue: number
  }[],
) => {

  const availablePools = Array.from(new Set(poolsInfo.reduce((acc: string[], el) => {
    acc.push(el.tokenA)
    acc.push(el.tokenB)

    return acc
  }, [])))

  // Finding the bigges liquidity for coin in all pools
  const tokensInPoolByLiquidity = poolsInfo.reduce((acc: any, el) => {
    const tokenA = {
      symbol: el.tokenA,
      liquidity: el.tvl.tokenA,
    }

    const tokenB = {
      symbol: el.tokenB,
      liquidity: el.tvl.tokenB,
    }

    acc[tokenA.symbol] = acc[tokenA.symbol] ? Math.max(...[acc[tokenA.symbol], tokenA.liquidity]) : tokenA.liquidity
    acc[tokenB.symbol] = acc[tokenB.symbol] ? Math.max(...[acc[tokenB.symbol], tokenB.liquidity]) : tokenB.liquidity


    return acc
  }, {})

  console.log('tokensInPoolByLiquidity: ', tokensInPoolByLiquidity)

  const tokensWithPoolsAndLiquidity = tokens.map(el => {
    const isTokenHasPrice = el.price !== null
    const isTokenHasPool = availablePools.includes(el.symbol)
    const isTokenHasPoolWithLiquidity = tokensInPoolByLiquidity[el.symbol] > el.amount * REBALANCE_CONFIG.MULTIPLIER_FOR_ENOUGH_LIQUIDITY

    return {
      ...el,
      ...(isTokenHasPoolWithLiquidity ? { poolWithLiquidityExists: true } : {
        disabled: true,
        disabledReason: "no liquidity in pool"
      }),
      ...(isTokenHasPool ? { poolExists: true } : {
        disabled: true,
        disabledReason: "no pool"
      }),
      ...(isTokenHasPrice ? {} : {
        disabled: true,
        disabledReason: "no price"
      }),
    }
  })

  return tokensWithPoolsAndLiquidity

}
