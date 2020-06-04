import React from 'react'
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
import { PaginationBlock } from '../TradingTablePagination'
import TradingTabs from '@sb/components/TradingTable/TradingTabs/TradingTabs'
import TradingTitle from '@sb/components/TradingTable/TradingTitle/TradingTitle'
import { getTradeHistory } from '@core/graphql/queries/chart/getTradeHistory'
import { TRADE_HISTORY } from '@core/graphql/subscriptions/TRADE_HISTORY'
// import { CSS_CONFIG } from '@sb/config/cssConfig'

@withTheme()
class TradeHistoryTable extends React.PureComponent<IProps> {
  state: IState = {
    tradeHistoryProcessedData: [],
  }

  unsubscribeFunction: null | Function = null

  componentDidMount() {
    const {
      getTradeHistoryQuery,
      subscribeToMore,
      theme,
      arrayOfMarketIds,
      marketType,
      keys,
    } = this.props

    const tradeHistoryProcessedData = combineTradeHistoryTable(
      getTradeHistoryQuery.getTradeHistory.trades,
      theme,
      arrayOfMarketIds,
      marketType,
      keys
    )
    this.setState({
      tradeHistoryProcessedData,
    })

    this.unsubscribeFunction = subscribeToMore()
  }

  componentDidUpdate(prevProps: IProps) {
    if (
      prevProps.selectedKey.keyId !== this.props.selectedKey.keyId ||
      prevProps.specificPair !== this.props.specificPair ||
      prevProps.allKeys !== this.props.allKeys
    ) {
      const {
        startDate,
        endDate,
        marketType,
        selectedKey,
        allKeys,
        currencyPair,
        specificPair,
      } = this.props

      this.unsubscribeFunction && this.unsubscribeFunction()
      this.unsubscribeFunction = this.props.getTradeHistoryQuery.subscribeToMore(
        {
          document: TRADE_HISTORY,
          variables: {
            tradeHistoryInput: {
              startDate: startDate.valueOf(),
              endDate: endDate.valueOf(),
              marketType,
              activeExchangeKey: selectedKey.keyId,
              allKeys,
              ...(!specificPair ? {} : { specificPair: currencyPair }),
            },
          },
          updateQuery: updateTradeHistoryQuerryFunction,
        }
      )
    }
  }

  componentWillUnmount = () => {
    // unsubscribe subscription
    if (this.unsubscribeFunction !== null) {
      this.unsubscribeFunction()
    }
  }

  componentWillReceiveProps(nextProps: IProps) {
    const tradeHistoryProcessedData = combineTradeHistoryTable(
      nextProps.getTradeHistoryQuery.getTradeHistory.trades,
      nextProps.theme,
      nextProps.arrayOfMarketIds,
      nextProps.marketType,
      nextProps.keys
    )
    this.setState({
      tradeHistoryProcessedData,
    })
  }

  render() {
    const { tradeHistoryProcessedData } = this.state

    const {
      tab,
      show,
      page,
      perPage,
      theme,
      handleTabChange,
      focusedInput,
      endDate,
      activeDateButton,
      startDate,
      maximumDate,
      minimumDate,
      onClearDateButtonClick,
      onDateButtonClick,
      onDatesChange,
      onFocusChange,
      marketType,
      selectedKey,
      canceledOrders,
      currencyPair,
      allKeys,
      specificPair,
      handleToggleAllKeys,
      handleToggleSpecificPair,
      arrayOfMarketIds,
      handleChangePage,
      getTradeHistoryQuery,
      handleChangeRowsPerPage,
      showAllPositionPairs,
      showAllOpenOrderPairs,
      showAllSmartTradePairs,
      showPositionsFromAllAccounts,
      showOpenOrdersFromAllAccounts,
      showSmartTradesFromAllAccounts,
    } = this.props

    if (!show) {
      return null
    }

    return (
      <TableWithSort
        style={{ borderRadius: 0, height: '100%' }}
        stylesForTable={{ backgroundColor: '#fff' }}
        defaultSort={{
          sortColumn: 'date',
          sortDirection: 'desc',
        }}
        withCheckboxes={false}
        tableStyles={{
          headRow: {
            borderBottom: '1px solid #e0e5ec',
            boxShadow: 'none',
          },
          heading: {
            fontSize: '1rem',
            fontWeight: 'bold',
            backgroundColor: '#fff',
            color: '#16253D',
            boxShadow: 'none',
          },
          cell: {
            color: '#7284A0',
            fontSize: '1rem', // 1.2 if bold
            fontWeight: 'bold',
            letterSpacing: '1px',
            borderBottom: '1px solid #e0e5ec',
            boxShadow: 'none',
          },
          tab: {
            padding: 0,
            boxShadow: 'none',
          },
        }}
        pagination={{
          fakePagination: false,
          enabled: true,
          totalCount: getTradeHistoryQuery.getTradeHistory.count,
          page: page,
          rowsPerPage: perPage,
          rowsPerPageOptions: [10, 20, 30, 50, 100],
          handleChangePage: handleChangePage,
          handleChangeRowsPerPage: handleChangeRowsPerPage,
          additionalBlock: (
            <PaginationBlock
              {...{
                allKeys,
                specificPair,
                handleToggleAllKeys,
                handleToggleSpecificPair,
              }}
            />
          ),
          paginationStyles: { width: 'calc(100% - 0.4rem)' },
        }}
        emptyTableText={getEmptyTextPlaceholder(tab)}
        title={
          <div>
            <TradingTabs
              {...{
                tab,
                marketType,
                selectedKey,
                currencyPair,
                canceledOrders,
                handleTabChange,
                arrayOfMarketIds,
                showAllPositionPairs,
                showAllOpenOrderPairs,
                showAllSmartTradePairs,
                showPositionsFromAllAccounts,
                showOpenOrdersFromAllAccounts,
                showSmartTradesFromAllAccounts,
              }}
            />
            <TradingTitle
              {...{
                page,
                perPage,
                theme,
                startDate,
                endDate,
                focusedInput,
                activeDateButton,
                minimumDate,
                maximumDate,
                onDateButtonClick,
                onDatesChange,
                onFocusChange,
                onClearDateButtonClick,
                handleChangePage,
                handleChangeRowsPerPage,
                maxRows: getTradeHistoryQuery.getTradeHistory.count,
              }}
            />
          </div>
        }
        data={{ body: tradeHistoryProcessedData }}
        columnNames={getTableHead(tab, marketType)}
      />
    )
  }
}

const TableDataWrapper = ({ ...props }) => {
  let { startDate, endDate, page, perPage, allKeys, specificPair } = props

  startDate = +startDate
  endDate = +endDate

  return (
    <QueryRenderer
      component={TradeHistoryTable}
      withOutSpinner={true}
      withTableLoader={true}
      query={getTradeHistory}
      name={`getTradeHistoryQuery`}
      fetchPolicy="cache-and-network"
      showLoadingWhenQueryParamsChange={false}
      // pollInterval={props.show ? 60000 : 0}
      variables={{
        tradeHistoryInput: {
          page,
          perPage,
          startDate,
          endDate,
          activeExchangeKey: props.selectedKey.keyId,
          marketType: props.marketType,
          allKeys,
          ...(!specificPair ? {} : { specificPair: props.currencyPair }),
        },
      }}
      subscriptionArgs={{
        subscription: TRADE_HISTORY,
        variables: {
          tradeHistoryInput: {
            startDate,
            endDate,
            activeExchangeKey: props.selectedKey.keyId,
            marketType: props.marketType,
            allKeys,
            ...(!specificPair ? {} : { specificPair: props.currencyPair }),
          },
        },
        updateQueryFunction: updateTradeHistoryQuerryFunction,
      }}
      {...props}
    />
  )
}

export default React.memo(TableDataWrapper, (prevProps, nextProps) => {
  if (!nextProps.show && !prevProps.show) {
    return true
  }

  return false
})
