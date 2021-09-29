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
      tokenA: 45,
      tokenB: 2,
    },
    apy24h: 0.21, //%
    supply: 120000,
    liquidity: 9835570,
    locked: true,
    executed: false,
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
      tokenA: 44,
      tokenB: 765,
    },
    apy24h: 0.21, //%
    supply: 120000,
    liquidity: 0,
    locked: false,
    executed: true,
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
      tokenA: 44,
      tokenB: 765,
    },
    apy24h: 0.21, //%
    supply: 120000,
    liquidity: 935570,
    locked: true,
    executed: false,
  },
]

const AllPoolsTableComponent = ({
  theme,
  searchValue,
  dexTokensPricesMap,
  poolsInfo,
  getFeesEarnedByPoolQuery,
  selectPool,
  // setIsCreatePoolPopupOpen,
  setIsAddLiquidityPopupOpen,
}: {
  theme: Theme
  searchValue: string
  dexTokensPricesMap: Map<string, DexTokensPrices>
  poolsInfo: PoolInfo[]
  getFeesEarnedByPoolQuery: { getFeesEarnedByPool: FeesEarned[] }
  selectPool: (pool: PoolInfo) => void
  // setIsCreatePoolPopupOpen: (value: boolean) => void
  setIsAddLiquidityPopupOpen: (value: boolean) => void
}) => {
  const [expandedRows, expandRows] = useState<string[]>([])

  const setExpandedRows = (id: string) => {
    expandRows(onCheckBoxClick(expandedRows, id))
  }

  const { getFeesEarnedByPool = [] } = getFeesEarnedByPoolQuery || {
    getFeesEarnedByPool: [],
  }

  const feesPerPoolMap = new Map()

  getFeesEarnedByPool.forEach((feeEarnedByPool) => {
    feesPerPoolMap.set(feeEarnedByPool.pool, feeEarnedByPool.earnedUSD)
  })

  const allPoolsData = combineAllPoolsData({
    theme,
    searchValue,
    dexTokensPricesMap,
    feesPerPoolMap,
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
      data={{ body: allPoolsData }}
      columnNames={allPoolsTableColumnsNames}
    />
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
