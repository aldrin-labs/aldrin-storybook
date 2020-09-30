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
import { disableStrategy } from '@core/graphql/mutations/strategies/disableStrategy'
import { getOpenOrderHistory } from '@core/graphql/queries/chart/getOpenOrderHistory'
import { OPEN_ORDER_HISTORY } from '@core/graphql/subscriptions/OPEN_ORDER_HISTORY'
import { CANCEL_ORDER_MUTATION } from '@core/graphql/mutations/chart/cancelOrderMutation'
import { ordersHealthcheck } from '@core/graphql/mutations/chart/ordersHealthcheck'

import { client } from '@core/graphql/apolloClient'
import { cancelOrderStatus } from '@core/utils/tradingUtils'

import { useOpenOrdersForAllMarkets } from '@sb/dexUtils/markets'

const OpenOrdersTable = (props) => {
  // state: IState = {
  //   openOrdersProcessedData: [],
  //   cachedOrder: null,
  // }

  // interval: null | number = null

  // unsubscribeFunction: null | Function = null

  const onCancelOrder = async (keyId: string, orderId: string, pair: string, type: string) => {
    const { cancelOrderMutation, marketType, disableStrategyMutation } = props

    try {
      const responseResult = await cancelOrderMutation({
        variables: {
          cancelOrderInput: {
            keyId,
            orderId,
            pair,
            marketType,
            type
          },
        },
      })

      return responseResult
    } catch (err) {
      return { errors: err }
    }
  }

  const cancelOrderWithStatus = async (
    keyId: string,
    orderId: string,
    pair: string,
    type: string
  ) => {
    const { showCancelResult } = props

    await props.addOrderToCanceled(orderId)
    const result = await onCancelOrder(keyId, orderId, pair, type)
    const status = await cancelOrderStatus(result)

    if (status.result === 'error') {
      await props.clearCanceledOrders()
    }

    showCancelResult(status)
  }

  // refetch = async () => {
  //   await this.props.getOpenOrderHistoryQueryRefetch()
  // }

  // componentDidMount() {
  //   const {
  //     subscribeToMore,
  //     theme,
  //     arrayOfMarketIds,
  //     marketType,
  //     keys,
  //     handlePairChange,
  //   } = this.props

  //   // const that = this

  //   const {
  //     getOpenOrderHistory: { orders } = {
  //       orders: [],
  //     },
  //   } = this.props.getOpenOrderHistoryQuery || {
  //     getOpenOrderHistory: { orders: [] },
  //   }

  //   const openOrdersProcessedData = combineOpenOrdersTable(
  //     orders,
  //     this.cancelOrderWithStatus,
  //     theme,
  //     arrayOfMarketIds,
  //     marketType,
  //     this.props.canceledOrders,
  //     keys,
  //     handlePairChange
  //   )

  //   this.setState({
  //     openOrdersProcessedData,
  //   })

  // this.unsubscribeFunction = subscribeToMore()
  // }

  // componentDidUpdate(prevProps: IProps) {
  //   if (
  //     prevProps.specificPair !== this.props.specificPair ||
  //     prevProps.marketType !== this.props.marketType
  //   ) {
  // const {
  //   marketType,
  //   selectedKey,
  //   allKeys,
  //   currencyPair,
  //   specificPair,
  // } = this.props

  // console.log('OpenOrdersTable unsubscribe')

  //   this.unsubscribeFunction && this.unsubscribeFunction()
  //   this.unsubscribeFunction = this.props.getOpenOrderHistoryQuery.subscribeToMore(
  //     {
  //       document: OPEN_ORDER_HISTORY,
  //       variables: {
  //         openOrderInput: {
  //           marketType,
  //           activeExchangeKey: selectedKey.keyId,
  //           allKeys,
  //           ...(!specificPair ? {} : { specificPair: currencyPair }),
  //         },
  //       },
  //       updateQuery: updateOpenOrderHistoryQuerryFunction,
  //     }
  //   )
  // }
  //   }
  // }

  // componentWillUnmount = () => {
  // unsubscribe subscription
  // if (this.unsubscribeFunction !== null) {
  //   this.unsubscribeFunction()
  // }

  // this.interval && clearInterval(this.interval)
  // }

  // componentWillReceiveProps(nextProps: IProps) {
  //   const { cachedOrder } = this.state

  // console.log('nextProps.getOpenOrderHistoryQuery', nextProps.getOpenOrderHistoryQuery)

  // let data
  // try {
  //   data = client.readQuery({
  //     query: getOpenOrderHistory,
  //     variables: {
  //       openOrderInput: {
  //         activeExchangeKey: this.props.selectedKey.keyId,
  //         marketType: this.props.marketType,
  //         page: this.props.page,
  //         perPage: this.props.perPage,
  //         allKeys: this.props.allKeys,
  //         ...(!this.props.specificPair
  //           ? {}
  //           : { specificPair: this.props.currencyPair }),
  //       },
  //     },
  //   })
  // } catch (e) {
  //   // console.log(e)
  //   data = nextProps.getOpenOrderHistoryQuery
  // }

  // console.log('data in receive props', data)

  // const newOrderFromSubscription =
  //   cachedOrder !== null
  //     ? data.getOpenOrderHistory.orders.find((order: OrderType) => {
  //       return order.price == cachedOrder.price
  //     })
  //     : null

  // console.log(
  //   'newOrderFromSubscription in receive props',
  //   newOrderFromSubscription
  // )

  // if (newOrderFromSubscription) {
  //   this.setState({
  //     cachedOrder: null,
  //   })
  // }

  // console.log(
  //   'nextProps.getOpenOrderHistoryQuery.getOpenOrderHistory',
  //   nextProps.getOpenOrderHistoryQuery.getOpenOrderHistory
  // )

  // console.log('cachedOrder', cachedOrder)

  // const ordersToDisplay =
  //   !newOrderFromSubscription && !!cachedOrder
  //     ? nextProps.getOpenOrderHistoryQuery.getOpenOrderHistory.orders.concat(
  //       cachedOrder
  //     )
  //     : nextProps.getOpenOrderHistoryQuery.getOpenOrderHistory.orders

  // console.log('ordersToDisplay in receive props', ordersToDisplay)

  // const {
  //   getOpenOrderHistory: { orders } = {
  //     orders: [],
  //   },
  // } = nextProps.getOpenOrderHistoryQuery || {
  //   getOpenOrderHistory: { orders: [] },
  // }


  // const openOrdersProcessedData = combineOpenOrdersTable(
  //   orders,
  // nextProps.getOpenOrderHistoryQuery.getOpenOrderHistory.orders,
  //     this.cancelOrderWithStatus,
  //     nextProps.theme,
  //     nextProps.arrayOfMar    const {
  //       getOpenOrderHistory: { count } = {
  //         count: 0,
  //       },
  //     } = this.props.getOpenOrderHistoryQuery || {
  //       getOpenOrderHistory: { count: 0 },
  //     }
  // ketIds,
  //     nextProps.marketType,
  //     nextProps.canceledOrders,
  //     nextProps.keys,
  //     nextProps.handlePairChange
  //   )

  //   this.setState({
  //     openOrdersProcessedData,
  //   })
  // }

  // render() {
  // const { openOrdersProcessedData } = this.state
  const {
    tab,
    theme,
    show,
    page,
    perPage,
    marketType,
    allKeys,
    specificPair,
    handleChangePage,
    handleChangeRowsPerPage,
    getOpenOrderHistoryQuery,
    handleToggleAllKeys,
    handleToggleSpecificPair,
    arrayOfMarketIds,
    canceledOrders,
    handlePairChange,
    keys
  } = props

  const [openOrders] = useOpenOrdersForAllMarkets();
  openOrders?.push({
    marketName: 'BTC_USDT',
    side: 'buy',
    size: 0.001,
    price: 10000,
    orderId: 123
  })

  if (!show) {
    return null
  }

  const openOrdersProcessedData = combineOpenOrdersTable(
    openOrders,
    cancelOrderWithStatus,
    theme,
    arrayOfMarketIds,
    marketType,
    canceledOrders,
    keys,
    handlePairChange
  )

  return (
    <TableWithSort
      style={{
        borderRadius: 0,
        height: 'calc(100% - 6rem)',
        overflowX: 'hidden',
        backgroundColor: theme.palette.white.background,
      }}
      stylesForTable={{ backgroundColor: theme.palette.white.background }}
      defaultSort={{
        sortColumn: 'date',
        sortDirection: 'desc',
      }}
      withCheckboxes={false}
      pagination={{
        fakePagination: false,
        enabled: true,
        totalCount: 0,
        page: page,
        rowsPerPage: perPage,
        rowsPerPageOptions: [10, 20, 30, 50, 100],
        handleChangePage: handleChangePage,
        handleChangeRowsPerPage: handleChangeRowsPerPage,
        additionalBlock: (
          <PaginationBlock
            {...{
              theme,
              allKeys,
              specificPair,
              handleToggleAllKeys,
              handleToggleSpecificPair,
            }}
          />
        ),
        paginationStyles: {
          width: 'calc(100%)',
          backgroundColor: theme.palette.white.background,
          border: theme.palette.border.main,
          borderRight: 0,
        },
      }}
      tableStyles={{
        headRow: {
          borderBottom: theme.palette.border.main,
          boxShadow: 'none',
        },
        heading: {
          fontSize: '1rem',
          fontWeight: 'bold',
          backgroundColor: theme.palette.white.background,
          color: theme.palette.dark.main,
          boxShadow: 'none',
        },
        cell: {
          color: theme.palette.dark.main,
          fontSize: '1rem', // 1.2 if bold
          fontWeight: 'bold',
          letterSpacing: '.1rem',
          borderBottom: theme.palette.border.main,
          backgroundColor: theme.palette.white.background,
          boxShadow: 'none',
        },
        tab: {
          padding: 0,
          boxShadow: 'none',
        },
      }}
      emptyTableText={getEmptyTextPlaceholder(tab)}
      data={{ body: openOrdersProcessedData }}
      columnNames={getTableHead(tab, marketType)}
    />
  )
  // }
}

const MemoizedWrapper = React.memo(OpenOrdersTable, (prevProps, nextProps) => {
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
  const pageIsEqual = prevProps.page === nextProps.page
  const perPageIsEqual = prevProps.perPage === nextProps.perPage

  if (
    isShowEqual &&
    showAllAccountsEqual &&
    showAllPairsEqual &&
    pairIsEqual &&
    selectedKeyIsEqual &&
    isMarketIsEqual &&
    pageIsEqual &&
    perPageIsEqual
  ) {
    return true
  }

  return false
})

export default MemoizedWrapper
