import React from 'react'

import { DataCellValue } from '@sb/components/DataTable'
import { Text } from '@sb/components/Typography'
import { getStakedTokensForPool } from '@sb/dexUtils/common/getStakedTokensForPool'
import { getTokenNameByMintAddress } from '@sb/dexUtils/markets'
import { calculateWithdrawAmount } from '@sb/dexUtils/pools'

import { stripByAmountAndFormat } from '@core/utils/chartPageUtils'

import { getTokenDataByMint } from '../../../../utils'
import { PrepareCellParams } from '../types'

export const prepareCell = (
  params: PrepareCellParams
): { [c: string]: DataCellValue } => {
  const { pool, tokenPrices, allTokensData, farmingTicketsMap, feesByPool } =
    params

  const baseSymbol = getTokenNameByMintAddress(pool.tokenA)
  const quoteSymbol = getTokenNameByMintAddress(pool.tokenB)

  const baseTokenPrice = tokenPrices.get(baseSymbol)?.price || 0
  const quoteTokenPrice = tokenPrices.get(quoteSymbol)?.price || 0

  const { amount: poolTokenRawAmount, decimals: poolTokenDecimals } =
    getTokenDataByMint(allTokensData, pool.poolTokenMint)

  const farmingTickets = farmingTicketsMap.get(pool.swapToken) || []

  const stakedTokens = getStakedTokensForPool(farmingTickets)

  const poolTokenAmount = poolTokenRawAmount * 10 ** poolTokenDecimals

  const [userAmountTokenA, userAmountTokenB] = calculateWithdrawAmount({
    selectedPool: pool,
    poolTokenAmount: poolTokenAmount + stakedTokens,
  })

  const userLiquidityUSD =
    baseTokenPrice * userAmountTokenA + quoteTokenPrice * userAmountTokenB

  const feesEarnedByUserForPool = feesByPool.get(pool.swapToken) || {
    totalBaseTokenFee: 0,
    totalQuoteTokenFee: 0,
  }

  const feesUsd =
    feesEarnedByUserForPool.totalBaseTokenFee * baseTokenPrice +
    feesEarnedByUserForPool.totalQuoteTokenFee * quoteTokenPrice

  const feesTotal = userLiquidityUSD + feesUsd

  return {
    userLiquidity: {
      rendered: (
        <>
          <Text size="sm">
            {feesTotal > 0 ? `$${stripByAmountAndFormat(feesTotal, 4)}` : '-'}
          </Text>
          <Text color="hint" size="sm" margin="10px 0">
            {stripByAmountAndFormat(
              userAmountTokenA + feesEarnedByUserForPool.totalBaseTokenFee
            )}{' '}
            {getTokenNameByMintAddress(pool.tokenA)} /{' '}
            {stripByAmountAndFormat(
              userAmountTokenB + feesEarnedByUserForPool.totalQuoteTokenFee
            )}{' '}
            {getTokenNameByMintAddress(pool.tokenB)}
          </Text>
        </>
      ),
      rawValue: userLiquidityUSD + feesUsd,
    },
    feesEarned: {
      rendered: (
        <Text size="sm">
          {feesUsd > 0 ? `$${stripByAmountAndFormat(feesUsd, 4)}` : '-'}
        </Text>
      ),

      rawValue: feesUsd,
    },
  }
}
