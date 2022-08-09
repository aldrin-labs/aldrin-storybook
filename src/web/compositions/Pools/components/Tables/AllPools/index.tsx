import React from 'react'

import { DataHeadColumn } from '@sb/components/DataTable'
import { InlineText } from '@sb/components/Typography'

import { HIDE_POOLS } from '@core/config/dex'

import { PoolsTable } from '../PoolsTable'
import { AllPoolsProps } from './types'
import { prepareCell } from './utils'

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

export const AllPoolsTable: React.FC<AllPoolsProps> = (props) => {
  const {
    farmingTicketsMap,
    searchValue,
    dexTokensPricesMap,
    pools,
    feesByPool,
    tradingVolumes,
    farms,
  } = props
  return (
    <PoolsTable
      addColumns={COLUMNS}
      pools={pools.filter((pool) => !HIDE_POOLS.includes(pool.poolTokenMint))}
      farmingTicketsMap={farmingTicketsMap}
      tokenPrices={dexTokensPricesMap}
      searchValue={searchValue}
      farms={farms}
      prepareCell={(pool) =>
        prepareCell(pool, dexTokensPricesMap, feesByPool, tradingVolumes)
      }
      suffix="all"
    />
  )
}
