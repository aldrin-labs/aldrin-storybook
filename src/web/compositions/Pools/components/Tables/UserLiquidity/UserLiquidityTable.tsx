import React, { useState } from 'react'
import { TableWithSort } from '@sb/components'

import { Theme } from '@material-ui/core'

import { onCheckBoxClick } from '@core/utils/PortfolioTableUtils'
import {
  DataSection,
  DexTokensPrices,
  FeesEarned,
  PoolInfo,
  PoolWithOperation,
} from '@sb/compositions/Pools/index.types'
import {
  combineUserLiquidityData,
  userLiquidityTableColumnsNames,
} from './UserLiquidity.utils'
import { TableContainer } from '../index.styles'
import { TokenInfo } from '@sb/compositions/Rebalance/Rebalance.types'
import { getUserPoolsFromAll } from '@sb/compositions/Pools/utils/getUserPoolsFromAll'
import { FarmingTicket } from '@sb/dexUtils/pools/endFarming'

const UserLiquidityTableComponent = ({
  theme,
  searchValue,
  allTokensData,
  poolsInfo,
  poolWaitingForUpdateAfterOperation,
  dexTokensPricesMap,
  farmingTicketsMap,
  earnedFeesInPoolForUserMap,
  selectPool,
  refreshTokensWithFarmingTickets,
  setPoolWaitingForUpdateAfterOperation,
  setIsWithdrawalPopupOpen,
  setIsAddLiquidityPopupOpen,
  setIsStakePopupOpen,
  setIsUnstakePopupOpen,
  setIsClaimRewardsPopupOpen,
}: {
  theme: Theme
  searchValue: string
  poolsInfo: PoolInfo[]
  poolWaitingForUpdateAfterOperation: PoolWithOperation
  allTokensData: TokenInfo[]
  dexTokensPricesMap: Map<string, DexTokensPrices>
  farmingTicketsMap: Map<string, FarmingTicket[]>
  earnedFeesInPoolForUserMap: Map<string, FeesEarned>
  selectPool: (pool: PoolInfo) => void
  refreshTokensWithFarmingTickets: () => void
  setPoolWaitingForUpdateAfterOperation: (data: PoolWithOperation) => void
  setIsWithdrawalPopupOpen: (value: boolean) => void
  setIsAddLiquidityPopupOpen: (value: boolean) => void
  setIsStakePopupOpen: (value: boolean) => void
  setIsUnstakePopupOpen: (value: boolean) => void
  setIsClaimRewardsPopupOpen: (value: boolean) => void
}) => {
  const [expandedRows, expandRows] = useState([])

  const setExpandedRows = (id: string) => {
    expandRows(onCheckBoxClick(expandedRows, id))
  }

  const usersPools = getUserPoolsFromAll({
    poolsInfo,
    allTokensData,
    farmingTicketsMap,
  })

  const userLiquidityData = combineUserLiquidityData({
    theme,
    searchValue,
    usersPools,
    expandedRows,
    poolWaitingForUpdateAfterOperation,
    allTokensData,
    dexTokensPricesMap,
    farmingTicketsMap,
    earnedFeesInPoolForUserMap,
    selectPool,
    refreshTokensWithFarmingTickets,
    setIsWithdrawalPopupOpen,
    setIsAddLiquidityPopupOpen,
    setIsStakePopupOpen,
    setIsUnstakePopupOpen,
    setIsClaimRewardsPopupOpen,
    setPoolWaitingForUpdateAfterOperation,
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
          sortColumn: 'tvl',
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
        data={{ body: userLiquidityData }}
        columnNames={userLiquidityTableColumnsNames}
      />
    </TableContainer>
  )
}

export default UserLiquidityTableComponent
