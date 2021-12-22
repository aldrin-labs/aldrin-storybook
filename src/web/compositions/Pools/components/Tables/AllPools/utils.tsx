import React from 'react'

import { DataCellValue } from '@sb/components/DataTable'
import { Text } from '@sb/components/Typography'
import {
  FeesMap,
  PoolInfo,
  TokenPricesMap,
  VolumesMap,
} from '@sb/compositions/Pools/index.types'
import { getTokenNameByMintAddress } from '@sb/dexUtils/markets'

import { stripByAmountAndFormat } from '@core/utils/chartPageUtils'

export const prepareCell = (
  pool: PoolInfo,
  tokenPrices: TokenPricesMap,
  feesByPool: FeesMap,
  tradingVolumes: VolumesMap
): { [c: string]: DataCellValue } => {
  const baseSymbol = getTokenNameByMintAddress(pool.tokenA)
  const quoteSymbol = getTokenNameByMintAddress(pool.tokenB)

  const baseTokenPrice = tokenPrices.get(baseSymbol)?.price || 0
  const quoteTokenPrice = tokenPrices.get(quoteSymbol)?.price || 0

  const feesEarnedByPool = feesByPool.get(pool.swapToken) || {
    totalBaseTokenFee: 0,
    totalQuoteTokenFee: 0,
  }

  const feesInUSD =
    feesEarnedByPool.totalBaseTokenFee * baseTokenPrice +
    feesEarnedByPool.totalQuoteTokenFee * quoteTokenPrice

  const volume = tradingVolumes.get(pool.swapToken) || {
    dailyTradingVolume: 0,
    weeklyTradingVolume: 0,
  }

  return {
    vol24h: {
      rendered: (
        <Text size="sm">
          {volume.dailyTradingVolume > 0
            ? `$${stripByAmountAndFormat(volume.dailyTradingVolume, 2)}`
            : '-'}
        </Text>
      ),
      rawValue: volume.dailyTradingVolume,
    },
    vol7d: {
      rendered: (
        <Text size="sm">
          {volume.weeklyTradingVolume > 0
            ? `$${stripByAmountAndFormat(volume.weeklyTradingVolume, 2)}`
            : '-'}
        </Text>
      ),
      rawValue: volume.dailyTradingVolume,
    },
    fees: {
      rendered: (
        <Text size="sm">
          {volume.weeklyTradingVolume > 0
            ? `$${stripByAmountAndFormat(feesInUSD, 2)}`
            : '-'}
        </Text>
      ),
      rawValue: feesInUSD,
    },
  }
}
