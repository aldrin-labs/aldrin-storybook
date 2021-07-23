import { MarketData, PoolInfo, TokenInfoWithDisableReason, TokenInfoWithSliderStep } from '../Rebalance.types'
import { REBALANCE_CONFIG } from '../Rebalance.config'
import { ALL_TOKENS_MINTS_MAP } from '@sb/dexUtils/markets'

import { MOCKED_MINTS_MAP } from '@sb/compositions/Rebalance/Rebalance.mock'


export const getAvailableTokensForRebalance = (
  marketsData: MarketData[],
  tokens: TokenInfoWithSliderStep[],
): TokenInfoWithDisableReason[] => {

  const availableTokens = Array.from(new Set(marketsData.reduce((acc: string[], el) => {
    acc.push(el.tokenA)
    acc.push(el.tokenB)

    return acc
  }, [])))

  // Finding the bigges liquidity for coin in all pools
  const tokensInPoolByLiquidity = marketsData.reduce((acc: any, el) => {
    // const tokenA = {
    //   symbol: ALL_TOKENS_MINTS_MAP[el.tokenA] || MOCKED_MINTS_MAP[el.tokenA] || el.tokenA,
    //   liquidity: el.tvl.tokenA,
    // }

    // const tokenB = {
    //   symbol: ALL_TOKENS_MINTS_MAP[el.tokenB] || MOCKED_MINTS_MAP[el.tokenB] || el.tokenB,
    //   liquidity: el.tvl.tokenB,
    // }

    // acc[tokenA.symbol] = acc[tokenA.symbol] ? Math.max(...[acc[tokenA.symbol], tokenA.liquidity]) : tokenA.liquidity
    // acc[tokenB.symbol] = acc[tokenB.symbol] ? Math.max(...[acc[tokenB.symbol], tokenB.liquidity]) : tokenB.liquidity


    return acc
  }, {})

  const tokensWithPoolsAndLiquidity = tokens.map(el => {
    const isTokenHasPrice = el.price !== null
    const isTokenHasPool = availableTokens.includes(el.symbol)
    const isTokenHasPoolWithLiquidity = tokensInPoolByLiquidity[el.symbol] > el.amount * REBALANCE_CONFIG.MULTIPLIER_FOR_ENOUGH_LIQUIDITY || true

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
