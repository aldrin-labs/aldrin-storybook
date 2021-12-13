import { stripByAmountAndFormat } from '@core/utils/chartPageUtils'
import { DataCellValue, DataHeadColumn } from '@sb/components/DataTable'
import { InlineText, Text } from '@sb/components/Typography'
import {
  FeesMap,
  PoolInfo,
  TokenPricesMap,
  VolumesMap,
  FarmingTicketsMap
} from '@sb/compositions/Pools/index.types'

import { getTokenNameByMintAddress } from '@sb/dexUtils/markets'
import React from 'react'
import { PoolsTable } from '../PoolsTable'

interface AllPoolsProps {
  searchValue: string
  pools: PoolInfo[]
  dexTokensPricesMap: TokenPricesMap
  feesByPool: FeesMap
  tradingVolumes: VolumesMap
  farmingTicketsMap: FarmingTicketsMap
}

const COLUMNS: DataHeadColumn[] = [
  {
    key: 'vol24h',
    title: (
      <InlineText>
        Volume <InlineText color="hint">24h</InlineText>
      </InlineText>
    ),
    sortable: true,
  },
  {
    key: 'vol7d',
    title: (
      <InlineText>
        Volume <InlineText color="hint">7d</InlineText>
      </InlineText>
    ),
    sortable: true,
  },
  {
    key: 'fees',
    title: (
      <InlineText>
        Fees <InlineText color="hint">24h</InlineText>
      </InlineText>
    ),
    sortable: true,
  },
]

const prepareCell = (
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
          ${stripByAmountAndFormat(volume.dailyTradingVolume, 2)}
        </Text>
      ),
      rawValue: volume.dailyTradingVolume,
    },
    vol7d: {
      rendered: (
        <Text size="sm">
          ${stripByAmountAndFormat(volume.weeklyTradingVolume, 2)}
        </Text>
      ),
      rawValue: volume.dailyTradingVolume,
    },
    fees: {
      rendered: <Text size="sm">${stripByAmountAndFormat(feesInUSD, 2)}</Text>,
      rawValue: feesInUSD,
    },
  }
}

export const AllPoolsTable: React.FC<AllPoolsProps> = (props) => {
  const { farmingTicketsMap, searchValue, dexTokensPricesMap, pools, feesByPool, tradingVolumes } =
    props

  return (
    <PoolsTable
      addColumns={COLUMNS}
      pools={pools}
      farmingTicketsMap={farmingTicketsMap}
      tokenPrices={dexTokensPricesMap}
      searchValue={searchValue}
      prepareCell={(pool) =>
        prepareCell(pool, dexTokensPricesMap, feesByPool, tradingVolumes)
      }
      suffix="all"
    />
  )
}
