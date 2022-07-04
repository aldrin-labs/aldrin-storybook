import React from 'react'

import { ConnectWalletWrapper } from '@sb/components/ConnectWalletWrapper'
import { DataHeadColumn, NoDataBlock } from '@sb/components/DataTable'
import { useTokenInfos } from '@sb/dexUtils/tokenRegistry'

import { PoolsTable } from '../PoolsTable'
import { LiquidityTableProps } from './types'
import { prepareCell } from './utils/prepareCell'

const COLUMNS: DataHeadColumn[] = [
  {
    key: 'userLiquidity',
    title: 'Your liquidity (Including Fees)',
    sortable: true,
  },
  { key: 'feesEarned', title: 'Fees Earned', sortable: true },
]

export const UserLiquidityTable: React.FC<LiquidityTableProps> = (props) => {
  const {
    searchValue,
    dexTokensPricesMap,
    pools,
    feesByPoolForUser,
    allTokensData,
    farmingTicketsMap,
  } = props

  const tokensMap = useTokenInfos()
  return (
    <PoolsTable
      addColumns={COLUMNS}
      pools={pools}
      tokenPrices={dexTokensPricesMap}
      searchValue={searchValue}
      farmingTicketsMap={farmingTicketsMap}
      prepareCell={(pool) =>
        prepareCell({
          pool,
          feesByPool: feesByPoolForUser,
          tokenPrices: dexTokensPricesMap,
          allTokensData,
          farmingTicketsMap,
          tokensMap,
        })
      }
      noDataText={
        <ConnectWalletWrapper>
          <NoDataBlock justifyContent="center">No pools available</NoDataBlock>
        </ConnectWalletWrapper>
      }
      suffix="user"
    />
  )
}
