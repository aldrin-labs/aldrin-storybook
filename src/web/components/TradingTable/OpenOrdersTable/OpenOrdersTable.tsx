import React, { useState } from 'react'
import dayjs from 'dayjs'
import { compose } from 'recompose'
import { graphql } from 'react-apollo'
import { withTheme } from '@material-ui/styles'

import QueryRenderer from '@core/components/QueryRenderer'
import { TableWithSort } from '@sb/components'

import { IProps, IState } from './OpenOrdersTable.types'
import { OrderType } from '@core/types/ChartTypes'

import { filterCacheData } from '@core/utils/TradingTable.utils'

import {
  updateOpenOrderHistoryQuerryFunction,
  combineOpenOrdersTable,
  getEmptyTextPlaceholder,
  getTableHead,
} from '@sb/components/TradingTable/TradingTable.utils'

import TradingTabs from '@sb/components/TradingTable/TradingTabs/TradingTabs'
import { PaginationBlock } from '../TradingTablePagination'

import { getOpenOrderHistory } from '@core/graphql/queries/chart/getOpenOrderHistory'
import { OPEN_ORDER_HISTORY } from '@core/graphql/subscriptions/OPEN_ORDER_HISTORY'
import { CANCEL_ORDER_MUTATION } from '@core/graphql/mutations/chart/cancelOrderMutation'
import { ordersHealthcheck } from '@core/graphql/mutations/chart/ordersHealthcheck'

import { client } from '@core/graphql/apolloClient'
import { cancelOrderStatus } from '@core/utils/tradingUtils'

@withTheme()
class OpenOrdersTable extends React.PureComponent<IProps> {
  state: IState = {
    openOrdersProcessedData: [],
    cachedOrder: null,
  }

  interval: null | number = null

  unsubscribeFunction: null | Function = null

  onCancelOrder = async (keyId: string, orderId: string, pair: string) => {
    const { cancelOrderMutation, marketType } = this.props

    try {
      const responseResult = await cancelOrderMutation({
        variables: {
          cancelOrderInput: {
            keyId,
            orderId,
            pair,
            marketType,
          },
        },
      })

      return responseResult
    } catch (err) {
      return { errors: err }
    }
  }

  cancelOrderWithStatus = async (
    keyId: string,
    orderId: string,
    pair: string
  ) => {
    const { showCancelResult } = this.props

    await this.props.addOrderToCanceled(orderId)
    const result = await this.onCancelOrder(keyId, orderId, pair)
    const status = await cancelOrderStatus(result)

    if (status.result === 'error') {
      await this.props.clearCanceledOrders()
    }

    showCancelResult(status)
  }

  refetch = async () => {
    await this.props.getOpenOrderHistoryQueryRefetch()
  }

  componentDidMount() {
    const {
      getOpenOrderHistoryQuery,
      subscribeToMore,
      theme,
      arrayOfMarketIds,
      marketType,
      keys,
    } = this.props

    const that = this

    const openOrdersProcessedData = combineOpenOrdersTable(
      getOpenOrderHistoryQuery.getOpenOrderHistory.orders,
      this.cancelOrderWithStatus,
      theme,
      arrayOfMarketIds,
      marketType,
      this.props.canceledOrders,
      keys
    )

    client.writeQuery({
      query: getOpenOrderHistory,
      variables: {
        openOrderInput: {
          activeExchangeKey: this.props.selectedKey.keyId,
          marketType: this.props.marketType,
          allKeys: true,
          page: 0,
          perPage: 30,
          // ...(!this.props.specificPair
          //   ? {}
          //   : { specificPair: this.props.currencyPair }),
        },
      },
      data: {
        getOpenOrderHistory: getOpenOrderHistoryQuery.getOpenOrderHistory,
      },
    })

    client
      .watchQuery({
        query: getOpenOrderHistory,
        variables: {
          openOrderInput: {
            activeExchangeKey: this.props.selectedKey.keyId,
            marketType: this.props.marketType,
            allKeys: true,
            page: 0,
            perPage: 30,
          },
        },
      })
      .subscribe({
        next: ({ data }) => {
          // console.log('data', data)
          const cachedOrder = data.getOpenOrderHistory.orders.find(
            (order: OrderType) =>
              order.marketId === '0' && order.status === 'placing'
          )

          const errorReturned = data.getOpenOrderHistory.orders.find(
            (order: OrderType) =>
              order.marketId === '0' && order.status === 'error'
          )

          const filteredOrders = that.props.getOpenOrderHistoryQuery.getOpenOrderHistory.orders.filter(
            (order) => order.status !== 'error' && order.status !== 'placing'
          )

          if ((cachedOrder && !that.state.cachedOrder) || !!errorReturned) {
            const ordersToDisplay = errorReturned
              ? filteredOrders
              : filteredOrders.concat(cachedOrder)

            console.log('ordersToDisplay in cache catch func', ordersToDisplay)

            const openOrdersProcessedData = combineOpenOrdersTable(
              ordersToDisplay,
              that.cancelOrderWithStatus,
              that.props.theme,
              that.props.arrayOfMarketIds,
              that.props.marketType,
              that.props.canceledOrders,
              that.props.keys
            )

            that.setState({
              cachedOrder: errorReturned ? null : cachedOrder,
              openOrdersProcessedData,
            })
          }

          if (errorReturned) {
            filterCacheData({
              name: 'getOpenOrderHistory',
              subName: 'orders',
              query: getOpenOrderHistory,
              variables: {
                openOrderInput: {
                  activeExchangeKey: this.props.selectedKey.keyId,
                  marketType: this.props.marketType,
                  allKeys: true,
                  page: 0,
                  perPage: 30,
                },
              },
              data,
              filterData: (order: OrderType) =>
                order.status !== 'error' && order.status !== 'placing',
            })
          }
        },
      })

    this.setState({
      openOrdersProcessedData,
    })

    // this.interval = setInterval(() => {
    //   if (!this.props.show || this.checkForCachedOrder()) {
    //     return
    //   }

    //   // that.props.getOpenOrderHistoryQueryRefetch()
    // }, 60000)

    this.unsubscribeFunction = subscribeToMore()
  }

  componentDidUpdate(prevProps: IProps) {
    if (
      prevProps.selectedKey.keyId !== this.props.selectedKey.keyId ||
      prevProps.specificPair !== this.props.specificPair ||
      prevProps.allKeys !== this.props.allKeys
    ) {
      const {
        marketType,
        selectedKey,
        allKeys,
        currencyPair,
        specificPair,
      } = this.props

      console.log('OpenOrdersTable unsubscribe')

      this.unsubscribeFunction && this.unsubscribeFunction()
      this.unsubscribeFunction = this.props.getOpenOrderHistoryQuery.subscribeToMore(
        {
          document: OPEN_ORDER_HISTORY,
          variables: {
            openOrderInput: {
              marketType,
              activeExchangeKey: selectedKey.keyId,
              allKeys,
              ...(!specificPair ? {} : { specificPair: currencyPair }),
            },
          },
          updateQuery: updateOpenOrderHistoryQuerryFunction,
        }
      )
    }

    if (this.props.show !== prevProps.show && this.props.show) {
      if (this.checkForCachedOrder()) return

      this.props.ordersHealthcheckMutation({
        variables: {
          input: {
            keyId: this.props.selectedKey.keyId,
            pair: this.props.currencyPair,
          },
        },
      })
      this.refetch()
    }
  }

  componentWillUnmount = () => {
    // unsubscribe subscription
    if (this.unsubscribeFunction !== null) {
      this.unsubscribeFunction()
    }

    this.interval && clearInterval(this.interval)
  }

  componentWillReceiveProps(nextProps: IProps) {
    const { cachedOrder } = this.state

    let data
    try {
      data = client.readQuery({
        query: getOpenOrderHistory,
        variables: {
          openOrderInput: {
            activeExchangeKey: this.props.selectedKey.keyId,
            marketType: this.props.marketType,
            page: this.props.page,
            perPage: this.props.perPage,
            allKeys: this.props.allKeys,
            ...(!this.props.specificPair
              ? {}
              : { specificPair: this.props.currencyPair }),
          },
        },
      })
    } catch (e) {
      // console.log(e)
      data = nextProps.getOpenOrderHistoryQuery
    }

    console.log('data in receive props', data)

    const newOrderFromSubscription =
      cachedOrder !== null
        ? data.getOpenOrderHistory.orders.find((order: OrderType) => {
            return order.price == cachedOrder.price
          })
        : null

    console.log(
      'newOrderFromSubscription in receive props',
      newOrderFromSubscription
    )

    if (newOrderFromSubscription) {
      this.setState({
        cachedOrder: null,
      })
    }

    // console.log(
    //   'nextProps.getOpenOrderHistoryQuery.getOpenOrderHistory',
    //   nextProps.getOpenOrderHistoryQuery.getOpenOrderHistory
    // )

    const ordersToDisplay =
      !newOrderFromSubscription && !!cachedOrder
        ? nextProps.getOpenOrderHistoryQuery.getOpenOrderHistory.orders.concat(
            cachedOrder
          )
        : nextProps.getOpenOrderHistoryQuery.getOpenOrderHistory.orders

    console.log('ordersToDisplay in receive props', ordersToDisplay)

    const openOrdersProcessedData = combineOpenOrdersTable(
      ordersToDisplay,
      // nextProps.getOpenOrderHistoryQuery.getOpenOrderHistory.orders,
      this.cancelOrderWithStatus,
      nextProps.theme,
      nextProps.arrayOfMarketIds,
      nextProps.marketType,
      nextProps.canceledOrders,
      nextProps.keys
    )

    this.setState({
      openOrdersProcessedData,
    })
  }

  checkForCachedOrder = () => {
    const data = client.readQuery({
      query: getOpenOrderHistory,
      variables: {
        openOrderInput: {
          activeExchangeKey: this.props.selectedKey.keyId,
          marketType: this.props.marketType,
          allKeys: true,
          page: 0,
          perPage: 30,
          // ...(!this.props.specificPair ? {} : { specificPair: this.props.currencyPair }),
        },
      },
    })

    const cachedOrder = data.getOpenOrderHistory.orders.find(
      (order: OrderType) => order.marketId === '0'
    )

    if (cachedOrder) {
      return true
    }

    return false
  }

  render() {
    const { openOrdersProcessedData } = this.state
    const {
      tab,
      handleTabChange,
      show,
      page,
      perPage,
      marketType,
      selectedKey,
      canceledOrders,
      currencyPair,
      arrayOfMarketIds,
      allKeys,
      specificPair,
      handleChangePage,
      handleChangeRowsPerPage,
      getOpenOrderHistoryQuery,
      handleToggleAllKeys,
      handleToggleSpecificPair,
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

    console.log(
      'getOpenOrderHistoryQuery.getOpenOrderHistory.count',
      getOpenOrderHistoryQuery.getOpenOrderHistory.count
    )

    return (
      <TableWithSort
        style={{ borderRadius: 0, height: '100%', overflowX: 'hidden' }}
        stylesForTable={{ backgroundColor: '#fff' }}
        defaultSort={{
          sortColumn: 'date',
          sortDirection: 'desc',
        }}
        withCheckboxes={false}
        pagination={{
          fakePagination: false,
          enabled: true,
          totalCount: getOpenOrderHistoryQuery.getOpenOrderHistory.count,
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
          </div>
        }
        data={{ body: openOrdersProcessedData }}
        columnNames={getTableHead(tab, marketType)}
      />
    )
  }
}

const TableDataWrapper = ({ ...props }) => {
  console.log('OpenOrders TableDataWrapper render')

  const [page, handleChangePage] = useState(0)
  const [perPage, handleChangeRowsPerPageFunc] = useState(30)

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    handleChangeRowsPerPageFunc(+event.target.value)
  }

  const {
    showOpenOrdersFromAllAccounts: allKeys,
    showAllOpenOrderPairs: specificPair,
  } = props

  return (
    <QueryRenderer
      page={page}
      perPage={perPage}
      handleChangePage={handleChangePage}
      handleChangeRowsPerPage={handleChangeRowsPerPage}
      component={OpenOrdersTable}
      variables={{
        openOrderInput: {
          activeExchangeKey: props.selectedKey.keyId,
          marketType: props.marketType,
          allKeys: allKeys,
          page,
          perPage,
          ...(!specificPair ? {} : { specificPair: props.currencyPair }),
        },
      }}
      withOutSpinner={true}
      withTableLoader={true}
      showLoadingWhenQueryParamsChange={false}
      query={getOpenOrderHistory}
      name={`getOpenOrderHistoryQuery`}
      fetchPolicy="cache-and-network"
      subscriptionArgs={{
        subscription: OPEN_ORDER_HISTORY,
        variables: {
          openOrderInput: {
            activeExchangeKey: props.selectedKey.keyId,
            marketType: props.marketType,
            allKeys: allKeys,
            ...(!specificPair ? {} : { specificPair: props.currencyPair }),
          },
        },
        updateQueryFunction: updateOpenOrderHistoryQuerryFunction,
      }}
      {...{
        allKeys,
        specificPair,
      }}
      {...props}
    />
  )
}

const MemoizedWrapper = React.memo(TableDataWrapper, (prevProps, nextProps) => {
  if (!nextProps.show && !prevProps.show) {
    return true
  }

  return false
})

export default compose(
  graphql(CANCEL_ORDER_MUTATION, { name: 'cancelOrderMutation' }),
  graphql(ordersHealthcheck, { name: 'ordersHealthcheckMutation' })
)(MemoizedWrapper)
