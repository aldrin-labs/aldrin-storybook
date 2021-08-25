import React, { useState } from 'react'
import { compose } from 'recompose'
import { graphql } from 'react-apollo'
import { useLocation } from 'react-router-dom'
import { withTheme } from '@material-ui/styles'

import QueryRenderer from '@core/components/QueryRenderer'
import { TableWithSort } from '@sb/components'

import { IProps, IState } from './TradeHistoryTable.types'
import {
  combineTradeHistoryTable,
  updateTradeHistoryQuerryFunction,
  getEmptyTextPlaceholder,
  getTableHead,
} from '@sb/components/TradingTable/TradingTable.utils'

import { addSerumTransaction } from '@core/graphql/mutations/chart/addSerumTransaction'

import { PaginationBlock } from '../TradingTablePagination'
import TradingTabs from '@sb/components/TradingTable/TradingTabs/TradingTabs'
// import TradingTitle from '@sb/components/TradingTable/TradingTitle/TradingTitle'
import { getTradeHistory } from '@core/graphql/queries/chart/getTradeHistory'
import { TRADE_HISTORY } from '@core/graphql/subscriptions/TRADE_HISTORY'
// import { CSS_CONFIG } from '@sb/config/cssConfig'

import { useFills } from '@sb/dexUtils/markets'
import { useWallet } from '@sb/dexUtils/wallet'

// @withTheme()
const TradeHistoryTable = (props) => {
  const {
    tab,
    show,
    theme,
    marketType,
    arrayOfMarketIds,
    handlePairChange,
    keys,
  } = props

  const fills = useFills()
  const location = useLocation()

  const pair = location.pathname.split('/')[3]
    ? location.pathname.split('/')[3]
    : null

  if (!show || !pair) {
    return null
  }

  const dataSource = (fills || []).map((fill) => ({
    ...fill,
    key: `${fill.orderId}${fill.side}`,
    liquidity: fill.eventFlags.maker ? 'Maker' : 'Taker',
  }))

  const tradeHistoryProcessedData = combineTradeHistoryTable(
    dataSource,
    theme,
    arrayOfMarketIds,
    marketType,
    keys,
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
          paddingBottom: '.8rem'
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
  const showAllAccountsEqual =
    prevProps.showOpenOrdersFromAllAccounts ===
    nextProps.showOpenOrdersFromAllAccounts
  const showAllPairsEqual =
    prevProps.showAllOpenOrderPairs === nextProps.showAllOpenOrderPairs
  // TODO: here must be smart condition if specificPair is not changed
  const pairIsEqual = prevProps.currencyPair === nextProps.currencyPair
  // TODO: here must be smart condition if showAllAccountsEqual is true & is not changed
  const selectedKeyIsEqual =
    prevProps.selectedKey.keyId === nextProps.selectedKey.keyId
  const isMarketIsEqual = prevProps.marketType === nextProps.marketType
  const startDateIsEqual = +prevProps.startDate === +nextProps.startDate
  const endDateIsEqual = +prevProps.endDate === +nextProps.endDate
  const pageIsEqual = prevProps.page === nextProps.page
  const perPageIsEqual = prevProps.perPage === nextProps.perPage

  if (
    isShowEqual &&
    showAllAccountsEqual &&
    showAllPairsEqual &&
    pairIsEqual &&
    selectedKeyIsEqual &&
    isMarketIsEqual &&
    startDateIsEqual &&
    endDateIsEqual &&
    pageIsEqual &&
    perPageIsEqual
  ) {
    return true
  }

  return false
})

export default compose(
  graphql(addSerumTransaction, { name: 'addSerumTransactionMutation' })
)(MemoTable)
