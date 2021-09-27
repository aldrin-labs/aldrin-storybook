import React, { useState } from 'react'
import { TableWithSort } from '@sb/components'

import { useConnection } from '@sb/dexUtils/connection'
import { useWallet } from '@sb/dexUtils/wallet'

import { notify } from '@sb/dexUtils/notifications'
import { Theme } from '@material-ui/core'
import { TokenAccount } from '@sb/dexUtils/markets'
import {
  allPoolsTableColumnsNames,
  combineAllPoolsData,
} from './AllPoolsTable.utils'
import { onCheckBoxClick } from '@core/utils/PortfolioTableUtils'

export const mock = [
  {
    name:
      'E5ndSkaB17Dm7CsD22dvcjfrYSDLCxFcMd6z8ddCk5wp_EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
    parsedName: 'RIN_USDC',
    tokenA: 'E5ndSkaB17Dm7CsD22dvcjfrYSDLCxFcMd6z8ddCk5wp',
    tokenB: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
    swapToken: '55',
    poolTokenMint: 'E5ndSkaB17Dm7CsD22dvcjfrYSDLCxFcMd6z8ddCk5wp',
    tvl: {
      tokenA: 0.44,
      tokenB: 0.765,
    },
    apy24h: 0.21, //%
    supply: 120000,
  },
  {
    name:
      'E5ndSkaB17Dm7CsD22dvcjfrYSDLCxFcMd6z8ddCk5wp_EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
    parsedName: 'RIN_USDC',
    tokenA: 'E5ndSkaB17Dm7CsD22dvcjfrYSDLCxFcMd6z8ddCk5wp',
    tokenB: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
    swapToken: '55',
    poolTokenMint: 'E5ndSkaB17Dm7CsD22dvcjfrYSDLoxFcMd6z8ddCk5wp',
    tvl: {
      tokenA: 0.44,
      tokenB: 0.765,
    },
    apy24h: 0.21, //%
    supply: 120000,
  },
  {
    name:
      'E5ndSkaB17Dm7CsD22dvcjfrYSDLCxFcMd6z8ddCk5wp_EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
    parsedName: 'RIN_USDC',
    tokenA: 'E5ndSkaB17Dm7CsD22dvcjfrYSDLCxFcMd6z8ddCk5wp',
    tokenB: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
    swapToken: '55',
    poolTokenMint: 'E5ndSkaB17Dm7CsD22dvcjfrYkDLCxFcMd6z8ddCk5wp',
    tvl: {
      tokenA: 0.44,
      tokenB: 0.765,
    },
    apy24h: 0.21, //%
    supply: 120000,
  },
]

const AllPoolsTableComponent = ({
  theme,
  dexTokensPrices,
  feesPerPoolMap,
}: {
  theme: Theme
  dexTokensPrices: any
  feesPerPoolMap: any
}) => {
  const [expandedRows, expandRows] = useState([])

  const setExpandedRows = (id: string) => {
    console.log('here', expandedRows)

    expandRows(onCheckBoxClick(expandedRows, id))
  }

  const allPoolsData = combineAllPoolsData({
    theme,
    dexTokensPrices,
    feesPerPoolMap,
  })
  return (
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
      emptyTableText={'You have no pools.'}
      data={{ body: allPoolsData }}
      columnNames={allPoolsTableColumnsNames}
    />
  )
  // }
}

export default AllPoolsTableComponent
