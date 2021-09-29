import React, { useState } from 'react'
import { TableWithSort } from '@sb/components'

import { Theme } from '@material-ui/core'
import {
  allPoolsTableColumnsNames,
  combineAllPoolsData,
} from './AllPoolsTable.utils'
import { onCheckBoxClick } from '@core/utils/PortfolioTableUtils'
import {
  DexTokensPrices,
  FeesEarned,
  PoolInfo,
} from '@sb/compositions/Pools/index.types'
import { compose } from 'recompose'
import { getFeesEarnedByPool } from '@core/graphql/queries/pools/getFeesEarnedByPool'
import { queryRendererHoc } from '@core/components/QueryRenderer'
import { TableContainer } from '../index.styles'
import { useWallet } from '@sb/dexUtils/wallet'

const AllPoolsTableComponent = ({
  theme,
  searchValue,
  dexTokensPricesMap,
  poolsInfo,
  getFeesEarnedByPoolQuery,
  selectPool,
  // setIsCreatePoolPopupOpen,
  setIsAddLiquidityPopupOpen,
  setIsWithdrawalPopupOpen,
}: {
  theme: Theme
  searchValue: string
  dexTokensPricesMap: Map<string, DexTokensPrices>
  poolsInfo: PoolInfo[]
  getFeesEarnedByPoolQuery: { getFeesEarnedByPool: FeesEarned[] }
  selectPool: (pool: PoolInfo) => void
  // setIsCreatePoolPopupOpen: (value: boolean) => void
  setIsAddLiquidityPopupOpen: (value: boolean) => void
  setIsWithdrawalPopupOpen: (value: boolean) => void
}) => {
  const [expandedRows, expandRows] = useState<string[]>([])

  const setExpandedRows = (id: string) => {
    expandRows(onCheckBoxClick(expandedRows, id))
  }

  const { wallet } = useWallet()

  const { getFeesEarnedByPool = [] } = getFeesEarnedByPoolQuery || {
    getFeesEarnedByPool: [],
  }

  const feesPerPoolMap = new Map()

  getFeesEarnedByPool.forEach((feeEarnedByPool) => {
    feesPerPoolMap.set(feeEarnedByPool.pool, feeEarnedByPool.earnedUSD)
  })

  const allPoolsData = combineAllPoolsData({
    theme,
    wallet,
    poolsInfo,
    searchValue,
    dexTokensPricesMap,
    feesPerPoolMap,
    selectPool,
    setIsAddLiquidityPopupOpen,
    setIsWithdrawalPopupOpen,
  })

  return (
    <TableContainer>
       {/* @ts-ignore */}
      <TableWithSort
        expandableRows={true}
        expandedRows={expandedRows}
        onChange={setExpandedRows}
        style={{
          overflowX: 'hidden',
          height: '100%',
          background: 'inherit',
        }}
        stylesForTable={{
          backgroundColor: '#222429',
        }}
        defaultSort={{
          sortColumn: 'date',
          sortDirection: 'desc',
        }}
        withCheckboxes={false}
        tableStyles={{
          cell: {
            color: theme.palette.dark.main,
            fontSize: '1rem',
            fontWeight: 'bold',
            letterSpacing: '.1rem',
            borderBottom: theme.palette.border.main,
            backgroundColor: 'inherit',
            boxShadow: 'none',
            paddingTop: '1rem',
            paddingBottom: '1rem',
            fontFamily: 'Avenir Next Medium',
          },
          heading: {
            borderTop: theme.palette.border.main,
            backgroundColor: '#222429',
            fontFamily: 'Avenir Next Thin',
            color: '#fbf2f2',
            fontSize: '1.3rem',
          },
          tab: {
            padding: 0,
            boxShadow: 'none',
          },
        }}
        emptyTableText={'No pools available.'}
        data={{ body: allPoolsData }}
        columnNames={allPoolsTableColumnsNames}
      />
    </TableContainer>
  )
}

export default compose(
  queryRendererHoc({
    name: 'getFeesEarnedByPoolQuery',
    query: getFeesEarnedByPool,
    fetchPolicy: 'cache-and-network',
    withoutLoading: true,
    pollInterval: 60000,
  })
)(AllPoolsTableComponent)
