import { Theme } from '@material-ui/core'
import { TableWithSort } from '@sb/components'
import {
  DexTokensPrices,
  FeesEarned,
  PoolInfo
} from '@sb/compositions/Pools/index.types'
import { getUserPoolsFromAll } from '@sb/compositions/Pools/utils/getUserPoolsFromAll'
import { TokenInfo } from '@sb/compositions/Rebalance/Rebalance.types'
import { FarmingTicket } from '@sb/dexUtils/common/types'


import { useHistory } from 'react-router-dom'

import React from 'react'
import { TableContainer } from '../index.styles'
import {
  combineUserLiquidityData,
  userLiquidityTableColumnsNames
} from './UserLiquidity.utils'


interface LiquidityTableProps {
  theme: Theme
  searchValue: string
  poolsInfo: PoolInfo[]
  includePermissionless: boolean
  allTokensData: TokenInfo[]
  dexTokensPricesMap: Map<string, DexTokensPrices>
  farmingTicketsMap: Map<string, FarmingTicket[]>
  earnedFeesInPoolForUserMap: Map<string, FeesEarned>
}

const UserLiquidityTableComponent: React.FC<LiquidityTableProps> = (props) => {

  const history = useHistory()

  const {
    theme,
    searchValue,
    allTokensData,
    poolsInfo,
    dexTokensPricesMap,
    farmingTicketsMap,
    earnedFeesInPoolForUserMap,
    includePermissionless,
  } = props

  const usersPools = getUserPoolsFromAll({
    poolsInfo,
    allTokensData,
    farmingTicketsMap,
  })

  const userLiquidityData = combineUserLiquidityData({
    theme,
    searchValue,
    usersPools,
    allTokensData,
    dexTokensPricesMap,
    farmingTicketsMap,
    earnedFeesInPoolForUserMap,
    includePermissionless,
  })

  return (
    <TableContainer>
      <TableWithSort
        hideCommonCheckbox={true}
        hideRowsCheckboxes={true}
        onTrClick={(row) => history.push(`/pools/${row.pool.contentToSort}`)}
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
