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
import { TokenInfo } from '@sb/compositions/Rebalance/Rebalance.types'
import { FarmingTicket } from '@sb/dexUtils/pools/endFarming'

const AllPoolsTableComponent = ({
  theme,
  searchValue,
  dexTokensPricesMap,
  poolsInfo,
  getFeesEarnedByPoolQuery,
  allTokensDataMap,
  farmingTicketsMap,
  earnedFeesInPoolForUserMap,
  selectPool,
  refreshAllTokensData,
  setIsAddLiquidityPopupOpen,
  setIsWithdrawalPopupOpen,
  setIsStakePopupOpen,
  setIsUnstakePopupOpen,
}: {
  theme: Theme
  searchValue: string
  poolsInfo: PoolInfo[]
  getFeesEarnedByPoolQuery: { getFeesEarnedByPool: FeesEarned[] }
  dexTokensPricesMap: Map<string, DexTokensPrices>
  allTokensDataMap: Map<string, TokenInfo>
  farmingTicketsMap: Map<string, FarmingTicket[]>
  earnedFeesInPoolForUserMap: Map<string, number>
  selectPool: (pool: PoolInfo) => void
  refreshAllTokensData: () => void
  setIsAddLiquidityPopupOpen: (value: boolean) => void
  setIsWithdrawalPopupOpen: (value: boolean) => void
  setIsStakePopupOpen: (value: boolean) => void
  setIsUnstakePopupOpen: (value: boolean) => void
}) => {
  const [expandedRows, expandRows] = useState<string[]>([])

  const setExpandedRows = (id: string) => {
    expandRows(onCheckBoxClick(expandedRows, id))
  }

  const { wallet } = useWallet()

  const { getFeesEarnedByPool = [] } = getFeesEarnedByPoolQuery || {
    getFeesEarnedByPool: [],
  }

  const feesPerPoolMap = getFeesEarnedByPool.reduce(
    (acc, feeEarnedByPool) =>
      acc.set(feeEarnedByPool.pool, feeEarnedByPool.earnedUSD),
    new Map()
  )

  const allPoolsData = combineAllPoolsData({
    theme,
    wallet,
    poolsInfo,
    searchValue,
    dexTokensPricesMap,
    feesPerPoolMap,
    expandedRows,
    allTokensDataMap,
    farmingTicketsMap,
    earnedFeesInPoolForUserMap,
    selectPool,
    refreshAllTokensData,
    setIsAddLiquidityPopupOpen,
    setIsWithdrawalPopupOpen,
    setIsStakePopupOpen,
    setIsUnstakePopupOpen,
  })

  return (
    <TableContainer>
      {/* @ts-ignore */}
      <TableWithSort
        hideCommonCheckbox={true}
        hideRowsCheckboxes={true}
        expandableRows={true}
        expandedRows={expandedRows}
        onChange={setExpandedRows}
        style={{
          overflowX: 'hidden',
          height: '100%',
          background: 'inherit',
          borderRadius: '1.6rem',
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
