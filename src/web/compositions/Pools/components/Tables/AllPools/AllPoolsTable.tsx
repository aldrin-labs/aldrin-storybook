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
  PoolWithOperation,
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
import { getTradingVolumeForAllPools } from '@core/graphql/queries/pools/getTradingVolumeForAllPools'
import { FarmingTicket } from '@sb/dexUtils/common/types'
import { endOfHourTimestamp } from '@core/utils/dateUtils'
import { getRandomInt } from '@core/utils/helpers'
import { getWeeklyAndDailyTradingVolumesForPools } from '@core/graphql/queries/pools/getWeeklyAndDailyTradingVolumesForPools'

const AllPoolsTableComponent = ({
  theme,
  searchValue,
  dexTokensPricesMap,
  poolsInfo,
  poolWaitingForUpdateAfterOperation,
  getFeesEarnedByPoolQuery,
  getWeeklyAndDailyTradingVolumesForPoolsQuery,
  allTokensData,
  farmingTicketsMap,
  earnedFeesInPoolForUserMap,
  selectPool,
  refreshTokensWithFarmingTickets,
  setPoolWaitingForUpdateAfterOperation,
  setIsAddLiquidityPopupOpen,
  setIsWithdrawalPopupOpen,
  setIsStakePopupOpen,
  setIsUnstakePopupOpen,
}: {
  theme: Theme
  searchValue: string
  poolsInfo: PoolInfo[]
  poolWaitingForUpdateAfterOperation: PoolWithOperation
  getFeesEarnedByPoolQuery: { getFeesEarnedByPool: FeesEarned[] }
  getWeeklyAndDailyTradingVolumesForPoolsQuery: {
    getWeeklyAndDailyTradingVolumesForPools: any
  }
  dexTokensPricesMap: Map<string, DexTokensPrices>
  allTokensData: TokenInfo[]
  farmingTicketsMap: Map<string, FarmingTicket[]>
  earnedFeesInPoolForUserMap: Map<string, FeesEarned>
  selectPool: (pool: PoolInfo) => void
  refreshTokensWithFarmingTickets: () => void
  setPoolWaitingForUpdateAfterOperation: (data: PoolWithOperation) => void
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

  const weeklyAndDailyTradingVolumes =
    getWeeklyAndDailyTradingVolumesForPoolsQuery.getWeeklyAndDailyTradingVolumesForPools

  const allPoolsData = combineAllPoolsData({
    theme,
    wallet,
    poolsInfo,
    poolWaitingForUpdateAfterOperation,
    searchValue,
    dexTokensPricesMap,
    feesPerPoolMap,
    expandedRows,
    allTokensData,
    farmingTicketsMap,
    weeklyAndDailyTradingVolumes,
    earnedFeesInPoolForUserMap,
    selectPool,
    refreshTokensWithFarmingTickets,
    setPoolWaitingForUpdateAfterOperation,
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
          sortColumn: 'apy',
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
            paddingTop: '2.5rem',
            paddingBottom: '2.5rem',
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
    pollInterval: 60000 * getRandomInt(5, 10),
  }),
  queryRendererHoc({
    name: 'getWeeklyAndDailyTradingVolumesForPoolsQuery',
    query: getWeeklyAndDailyTradingVolumesForPools,
    fetchPolicy: 'cache-and-network',
    withoutLoading: true,
    pollInterval: 60000 * getRandomInt(5, 10),
    variables: () => ({
      dailyTimestampTo: endOfHourTimestamp(),
      dailyTimestampFrom: endOfHourTimestamp() - dayDuration,
      weeklyTimestampTo: endOfHourTimestamp(),
      weeklyTimestampFrom: endOfHourTimestamp() - dayDuration * 7,
    }),
  })
)(AllPoolsTableComponent)
