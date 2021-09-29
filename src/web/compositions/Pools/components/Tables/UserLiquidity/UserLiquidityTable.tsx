import React, { useState } from 'react'
import { TableWithSort } from '@sb/components'

import { useConnection } from '@sb/dexUtils/connection'
import { useWallet } from '@sb/dexUtils/wallet'

import { notify } from '@sb/dexUtils/notifications'
import { Theme } from '@material-ui/core'
import { TokenAccount } from '@sb/dexUtils/markets'

import { onCheckBoxClick } from '@core/utils/PortfolioTableUtils'
import { DexTokensPrices } from '@sb/compositions/Pools/index.types'
import {
  combineUserLiquidityData,
  userLiquidityTableColumnsNames,
} from './UserLiquidity.utils'

const UserLiquidityTableComponent = ({
  theme,
  dexTokensPricesMap,
  usersPools,
  allTokensData,
}: {
  theme: Theme
  dexTokensPricesMap: Map<string, DexTokensPrices>
  usersPools: any
  allTokensData: any
}) => {
  const [expandedRows, expandRows] = useState([])

  const setExpandedRows = (id: string) => {
    expandRows(onCheckBoxClick(expandedRows, id))
  }

  const userLiquidityData = combineUserLiquidityData({
    theme,
    dexTokensPricesMap,
    usersPools,
    allTokensData,
  })

  return (
    // @ts-ignore
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
  )
}

export default UserLiquidityTableComponent
