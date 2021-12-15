import React from 'react'
import { TableWithSort } from '@sb/components'

import {
  getEmptyTextPlaceholder,
  getTableHead,
} from '@sb/components/TradingTable/TradingTable.utils'
import { useFeeDiscountKeys } from '@sb/dexUtils/markets'

export const feeTiers = [
  { feeTier: 0, taker: 0.04, maker: 0, token: '', balance: '' },
  { feeTier: 1, taker: 0.039, maker: 0, token: 'SRM', balance: 100 },
  { feeTier: 2, taker: 0.038, maker: 0, token: 'SRM', balance: 1000 },
  { feeTier: 3, taker: 0.036, maker: 0, token: 'SRM', balance: 10000 },
  {
    feeTier: 4,
    taker: 0.034,
    maker: 0,
    token: 'SRM',
    balance: 100000,
  },
  {
    feeTier: 5,
    taker: 0.032,
    maker: 0,
    token: 'SRM',
    balance: 1000000,
  },
  { feeTier: 6, taker: 0.03, maker: 0, token: 'MSRM', balance: 1 },
]

export const combineFeeTiers = (feeTiers, feeAccounts) => {
  const userTier =
    feeAccounts && feeAccounts.length > 0 ? feeAccounts[0].feeTier : 0

  const processedFundsData = feeTiers.map((el) => {
    const { feeTier, taker, maker, token, balance } = el

    return {
      id: `${feeTier}${balance}`,
      feeTier: `${feeTier}${feeTier === userTier ? ' Selected' : ''}`,
      taker: `${taker} %`,
      maker: `${maker} %`,
      condition: {
        render: balance > 0 ? `>= ${balance} ${token}` : 'None',
        style: { textAlign: 'left' },
        contentToSort: +balance,
      },
    }
  })

  return processedFundsData.filter((el) => !!el)
}

const FeeTiers = (props) => {
  const { tab, theme, show, marketType } = props

  if (!show) {
    return null
  }

  const [feeAccounts] = useFeeDiscountKeys()

  const balancesProcessedData = combineFeeTiers(feeTiers, feeAccounts)

  return (
    <TableWithSort
      style={{
        borderRadius: 0,
        height: 'calc(100% - 6rem)',
        overflowX: 'hidden',
        backgroundColor: 'inherit',
      }}
      stylesForTable={{ backgroundColor: 'inherit' }}
      defaultSort={{
        sortColumn: 'date',
        sortDirection: 'desc',
      }}
      withCheckboxes={false}
      tableStyles={{
        cell: {
          color: theme.palette.dark.main,
          fontSize: '1rem', // 1.2 if bold
          fontWeight: 'bold',
          letterSpacing: '.1rem',
          borderBottom: theme.palette.border.main,
          backgroundColor: 'inherit',
          boxShadow: 'none',
        },
        tab: {
          padding: 0,
          boxShadow: 'none',
        },
      }}
      emptyTableText={getEmptyTextPlaceholder(tab)}
      data={{ body: balancesProcessedData }}
      columnNames={getTableHead(tab, marketType)}
    />
  )
  // }
}

const MemoizedWrapper = React.memo(FeeTiers, (prevProps, nextProps) => {
  // TODO: Refactor isShowEqual --- not so clean
  const isShowEqual = !nextProps.show && !prevProps.show
  const isMarketIsEqual = prevProps.marketType === nextProps.marketType

  if (isShowEqual && isMarketIsEqual) {
    return true
  }

  return false
})

export default MemoizedWrapper
