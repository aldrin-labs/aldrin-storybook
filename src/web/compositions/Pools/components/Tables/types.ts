import { ReactNode } from 'react'

import { DataHeadColumn, DataCellValue } from '@sb/components/DataTable'

import { DexTokensPrices, PoolInfo } from '../../index.types'

export interface PoolsTableProps {
  pools: PoolInfo[]
  tokenPrices: Map<string, DexTokensPrices>
  addColumns: DataHeadColumn[]
  searchValue?: string
  prepareCell: (pool: PoolInfo) => { [c: string]: DataCellValue }
  suffix: string
  noDataText?: ReactNode
}
