import { Theme, withTheme } from '@material-ui/core'
import { TableWithSort } from '@sb/components'
import {
  DexTokensPrices,
  FeesEarned,
  PoolInfo,
  TradingVolumeStats
} from '@sb/compositions/Pools/index.types'
import { COLORS } from '@variables/variables'

import { useHistory, Link } from 'react-router-dom'

import React from 'react'
import { TableContainer } from '../index.styles'
import {
  allPoolsTableColumnsNames,
  combineAllPoolsData
} from './AllPoolsTable.utils'


interface AllPoolsProps {
  theme: Theme
  searchValue: string
  poolsInfo: PoolInfo[]
  includePermissionless: boolean
  dexTokensPricesMap: Map<string, DexTokensPrices>
  feesByPool: FeesEarned[]
  tradingVolumes: TradingVolumeStats[]
}

const AllPoolsTableComponent: React.FC<AllPoolsProps> = (props) => {
  const {
    theme,
    searchValue,
    dexTokensPricesMap,
    poolsInfo,
    feesByPool,
    tradingVolumes,
    includePermissionless,
  } = props

  const history = useHistory()

  const feesPerPoolMap = feesByPool.reduce(
    (acc, feeEarnedByPool) => acc.set(feeEarnedByPool.pool, feeEarnedByPool),
    new Map()
  )

  const weeklyAndDailyTradingVolumes = tradingVolumes

  const allPoolsData = combineAllPoolsData({
    theme,
    poolsInfo,
    searchValue,
    dexTokensPricesMap,
    feesPerPoolMap,
    weeklyAndDailyTradingVolumes,
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
            color: COLORS.main,
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

export default withTheme()(AllPoolsTableComponent)