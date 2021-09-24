import React from 'react'
import { TableWithSort } from '@sb/components'

import {
  getEmptyTextPlaceholder,
  getTableHead,
} from '@sb/components/TradingTable/TradingTable.utils'

import { useFills } from '@sb/dexUtils/markets'
import { combineTradeHistoryTable } from './TradeHistoryTable.utils'

const TradeHistoryTable = (props) => {
  const { tab, theme, marketType, handlePairChange } = props

  const fills = useFills()

  const dataSource = (fills || []).map((fill) => ({
    ...fill,
    key: `${fill.orderId}${fill.side}`,
    liquidity: fill.eventFlags.maker ? 'Maker' : 'Taker',
  }))

  const tradeHistoryProcessedData = combineTradeHistoryTable(
    dataSource,
    theme,
    marketType,
    handlePairChange
  )

  return (
    <TableWithSort
      style={{
        borderRadius: 0,
        height: 'calc(100% - 6rem)',
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
          backgroundColor: 'inherit',
          fontSize: '1rem', // 1.2 if bold
          fontWeight: 'bold',
          letterSpacing: '.1rem',
          borderBottom: theme.palette.border.main,
          boxShadow: 'none',
          paddingTop: '.8rem',
          paddingBottom: '.8rem',
        },
        tab: {
          padding: 0,
          boxShadow: 'none',
        },
      }}
      emptyTableText={getEmptyTextPlaceholder(tab)}
      data={{ body: tradeHistoryProcessedData }}
      columnNames={getTableHead(tab, marketType)}
    />
  )
  // }
}

const MemoTable = React.memo(TradeHistoryTable, (prevProps, nextProps) => {
  // TODO: Refactor isShowEqual --- not so clean
  const isShowEqual = !nextProps.show && !prevProps.show
  const isMarketIsEqual = prevProps.marketType === nextProps.marketType

  if (isShowEqual && isMarketIsEqual) {
    return true
  }

  return false
})

export default MemoTable
