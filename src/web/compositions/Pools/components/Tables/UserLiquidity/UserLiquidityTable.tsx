import React, { useState } from 'react'
import { TableWithSort } from '@sb/components'

import { Theme } from '@material-ui/core'

import { onCheckBoxClick } from '@core/utils/PortfolioTableUtils'
import {
  DexTokensPrices,
  FeesEarned,
  PoolInfo,
} from '@sb/compositions/Pools/index.types'
import {
  combineUserLiquidityData,
  userLiquidityTableColumnsNames,
} from './UserLiquidity.utils'
import { TableContainer } from '../index.styles'
import { WalletAdapter } from '@sb/dexUtils/types'
import { TokenInfo } from '@sb/compositions/Rebalance/Rebalance.types'
import { getUserPoolsFromAll } from '@sb/compositions/Pools/utils/getUserPoolsFromAll'
import { compose } from 'recompose'
import { getFeesEarnedByAccount } from '@core/graphql/queries/pools/getFeesEarnedByAccount'
import { queryRendererHoc } from '@core/components/QueryRenderer'

const UserLiquidityTableComponent = ({
  theme,
  wallet,
  allTokensDataMap,
  poolsInfo,
  dexTokensPricesMap,
  getFeesEarnedByAccountQuery,
  userStakingAmountsMap,
  selectPool,
  setIsWithdrawalPopupOpen,
  setIsAddLiquidityPopupOpen,
  setIsStakePopupOpen,
  setIsUnstakePopupOpen,
}: {
  theme: Theme
  wallet: WalletAdapter
  allTokensDataMap: Map<string, TokenInfo>
  poolsInfo: PoolInfo[]
  dexTokensPricesMap: Map<string, DexTokensPrices>
  getFeesEarnedByAccountQuery: { getFeesEarnedByAccount: FeesEarned[] }
  userStakingAmountsMap: Map<string, number>
  selectPool: (pool: PoolInfo) => void
  setIsWithdrawalPopupOpen: (value: boolean) => void
  setIsAddLiquidityPopupOpen: (value: boolean) => void
  setIsStakePopupOpen: (value: boolean) => void
  setIsUnstakePopupOpen: (value: boolean) => void
}) => {
  const [expandedRows, expandRows] = useState([])

  const setExpandedRows = (id: string) => {
    expandRows(onCheckBoxClick(expandedRows, id))
  }

  const usersPools = getUserPoolsFromAll({ poolsInfo, allTokensDataMap })

  const { getFeesEarnedByAccount = [] } = getFeesEarnedByAccountQuery || {
    getFeesEarnedByAccountQuery: {
      getFeesEarnedByAccount: [],
    },
  }

  const earnedFeesInPoolForUserMap = getFeesEarnedByAccount.reduce(
    (acc, feesEarned) => acc.set(feesEarned.pool, feesEarned.earnedUSD),
    new Map()
  )

  const userLiquidityData = combineUserLiquidityData({
    theme,
    dexTokensPricesMap,
    usersPools,
    expandedRows,
    allTokensDataMap,
    userStakingAmountsMap,
    earnedFeesInPoolForUserMap,
    expandedRows,
    selectPool,
    setIsWithdrawalPopupOpen,
    setIsAddLiquidityPopupOpen,
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
        data={{ body: userLiquidityData }}
        columnNames={userLiquidityTableColumnsNames}
      />
    </TableContainer>
  )
}

export default compose(
  queryRendererHoc({
    query: getFeesEarnedByAccount,
    name: 'getFeesEarnedByAccountQuery',
    variables: (props) => ({
      account: props.wallet.publicKey?.toString() || '',
    }),
    fetchPolicy: 'cache-and-network',
    withoutLoading: true,
  })
)(UserLiquidityTableComponent)
