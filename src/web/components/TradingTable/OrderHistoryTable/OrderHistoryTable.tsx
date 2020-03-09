import React from 'react'
import copy from 'clipboard-copy'
import { withTheme } from '@material-ui/styles'

import QueryRenderer from '@core/components/QueryRenderer'
import { TableWithSort } from '@sb/components'
import { PaginationBlock } from '../TradingTablePagination'
import { IProps, IState } from './OrderHistoryTable.types'
import {
  updatePaginatedOrderHistoryQuerryFunction,
  combineOrderHistoryTable,
  getEmptyTextPlaceholder,
  getTableHead,
} from '@sb/components/TradingTable/TradingTable.utils'
import TradingTabs from '@sb/components/TradingTable/TradingTabs/TradingTabs'
import TradingTitle from '@sb/components/TradingTable/TradingTitle/TradingTitle'
import { getPaginatedOrderHistory } from '@core/graphql/queries/chart/getPaginatedOrderHistory'
import { ORDER_HISTORY } from '@core/graphql/subscriptions/ORDER_HISTORY'
// import { CSS_CONFIG } from '@sb/config/cssConfig'

@withTheme
class OrderHistoryTable extends React.PureComponent<IProps> {
  state: IState = {
    orderHistoryProcessedData: [],
  }

  unsubscribeFunction: null | Function = null

  componentDidMount() {
    const {
      getPaginatedOrderHistoryQuery,
      subscribeToMore,
      theme,
      keys,
      arrayOfMarketIds,
      marketType,
    } = this.props

    const orderHistoryProcessedData = combineOrderHistoryTable(
      getPaginatedOrderHistoryQuery.getPaginatedOrderHistory.orders,
      theme,
      arrayOfMarketIds,
      marketType,
      keys
    )
    this.setState({
      orderHistoryProcessedData,
    })

    this.unsubscribeFunction = subscribeToMore()
  }

  componentWillUnmount = () => {
    // unsubscribe subscription
    if (this.unsubscribeFunction !== null) {
      this.unsubscribeFunction()
    }
  }

  componentWillReceiveProps(nextProps: IProps) {
    const orderHistoryProcessedData = combineOrderHistoryTable(
      nextProps.getPaginatedOrderHistoryQuery.getPaginatedOrderHistory.orders,
      nextProps.theme,
      nextProps.arrayOfMarketIds,
      nextProps.marketType,
      nextProps.keys
    )

    this.setState({
      orderHistoryProcessedData,
    })
  }

  render() {
    const { orderHistoryProcessedData } = this.state
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
      allKeys,
      specificPair,
      onClearDateButtonClick,
      onDateButtonClick,
      onDatesChange,
      onFocusChange,
      marketType,
      selectedKey,
      canceledOrders,
      currencyPair,
      arrayOfMarketIds,
      showAllPositionPairs,
      showAllOpenOrderPairs,
      showAllSmartTradePairs,
      showPositionsFromAllAccounts,
      showOpenOrdersFromAllAccounts,
      showSmartTradesFromAllAccounts,
      handleChangePage,
      handleChangeRowsPerPage,
      handleToggleAllKeys,
      handleToggleSpecificPair,
    } = this.props

    if (!show) {
      return null
    }

    const maxRows = this.props.getPaginatedOrderHistoryQuery
      .getPaginatedOrderHistory.count

    return (
      <TableWithSort
        style={{ borderRadius: 0, height: '100%' }}
        stylesForTable={{ backgroundColor: '#fff' }}
        defaultSort={{
          sortColumn: 'date',
          sortDirection: 'desc',
        }}
        onTrClick={(row) => {
          copy(row.id.split('_')[0])
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
          totalCount: maxRows,
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
                startDate,
                endDate,
                theme,
                maxRows,
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
              }}
            />
          </div>
        }
        data={{ body: orderHistoryProcessedData }}
        columnNames={getTableHead(tab, marketType)}
      />
    )
  }
}

const TableDataWrapper = ({ ...props }) => {
  let {
    startDate,
    endDate,
    page,
    perPage,
    marketType,
    allKeys,
    specificPair,
  } = props

  startDate = +startDate
  endDate = +endDate

  return (
    <QueryRenderer
      component={OrderHistoryTable}
      variables={{
        paginatedOrderHistoryInput: {
          page,
          perPage,
          startDate,
          endDate,
          marketType,
          allKeys,
          ...(!specificPair ? {} : { specificPair: props.currencyPair }),
          activeExchangeKey: props.selectedKey.keyId,
        },
      }}
      withOutSpinner={true}
      withTableLoader={true}
      showLoadingWhenQueryParamsChange={false}
      query={getPaginatedOrderHistory}
      name={`getPaginatedOrderHistoryQuery`}
      fetchPolicy="network-only"
      pollInterval={props.show ? 45000 : 0}
      subscriptionArgs={{
        subscription: ORDER_HISTORY,
        variables: {
          orderHistoryInput: {
            startDate,
            endDate,
            marketType,
            activeExchangeKey: props.selectedKey.keyId,
            allKeys,
            ...(!specificPair ? {} : { specificPair: props.currencyPair }),
          },
        },
        updateQueryFunction: updatePaginatedOrderHistoryQuerryFunction,
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
