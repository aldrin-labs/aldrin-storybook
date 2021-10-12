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
  TradingVolume,
} from '@sb/compositions/Pools/index.types'
import { compose } from 'recompose'
import { getFeesEarnedByPool } from '@core/graphql/queries/pools/getFeesEarnedByPool'
import { queryRendererHoc } from '@core/components/QueryRenderer'
import {
  dayDuration,
  endOfDayTimestamp,
} from '@sb/compositions/AnalyticsRoute/components/utils'
import { TableContainer } from '../index.styles'
import { useWallet } from '@sb/dexUtils/wallet'
import { TokenInfo } from '@sb/compositions/Rebalance/Rebalance.types'
import { FarmingTicket } from '@sb/dexUtils/pools/endFarming'
import { getTradingVolumeForAllPools } from '@core/graphql/queries/pools/getTradingVolumeForAllPools'

const AllPoolsTableComponent = ({
  theme,
  searchValue,
  dexTokensPricesMap,
  poolsInfo,
  getFeesEarnedByPoolQuery,
  getDailyTradingVolumeForAllPoolsQuery,
  getWeeklyTradingVolumeForAllPoolsQuery,
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
  getDailyTradingVolumeForAllPoolsQuery: {
    getTradingVolumeForAllPools: TradingVolume[]
  }
  getWeeklyTradingVolumeForAllPoolsQuery: {
    getTradingVolumeForAllPools: TradingVolume[]
  }
  dexTokensPricesMap: Map<string, DexTokensPrices>
  allTokensDataMap: Map<string, TokenInfo>
  farmingTicketsMap: Map<string, FarmingTicket[]>
  earnedFeesInPoolForUserMap: Map<string, FeesEarned>
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
    (acc, feeEarnedByPool) => acc.set(feeEarnedByPool.pool, feeEarnedByPool),
    new Map()
  )

  const dailyTradingVolumesMap = getDailyTradingVolumeForAllPoolsQuery.getTradingVolumeForAllPools.reduce(
    (acc, tradingVolume) =>
      acc.set(tradingVolume.pool, tradingVolume.tradingVolume),
    new Map()
  )

  const tradingVolumesMap = getWeeklyTradingVolumeForAllPoolsQuery.getTradingVolumeForAllPools.reduce(
    (acc, weeklyTradingVolume) => {
      const dailyVolume =
        dailyTradingVolumesMap.get(weeklyTradingVolume.pool) || 0

      return acc.set(weeklyTradingVolume.pool, {
        weekly: weeklyTradingVolume.tradingVolume,
        daily: dailyVolume,
      })
    },
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
    tradingVolumesMap,
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
    pollInterval: 60000 * 5,
  }),
  queryRendererHoc({
    name: 'getDailyTradingVolumeForAllPoolsQuery',
    query: getTradingVolumeForAllPools,
    fetchPolicy: 'cache-and-network',
    withoutLoading: true,
    pollInterval: 60000 * 5,
    variables: {
      timestampFrom: endOfDayTimestamp() - dayDuration,
      timestampTo: endOfDayTimestamp(),
    },
  }),
  queryRendererHoc({
    name: 'getWeeklyTradingVolumeForAllPoolsQuery',
    query: getTradingVolumeForAllPools,
    fetchPolicy: 'cache-and-network',
    withoutLoading: true,
    pollInterval: 60000 * 5,
    variables: {
      timestampFrom: endOfDayTimestamp() - dayDuration * 7,
      timestampTo: endOfDayTimestamp(),
    },
  })
)(AllPoolsTableComponent)
