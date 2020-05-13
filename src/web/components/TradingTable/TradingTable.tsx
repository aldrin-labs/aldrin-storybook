import React from 'react'
import { compose } from 'recompose'
import { queryRendererHoc } from '@core/components/QueryRenderer'

import { IProps, IState } from './TradingTable.types'
import { StyleForCalendar } from '@sb/components/GitTransactionCalendar/Calendar.styles'

import ActiveTrades from './ActiveTrades/ActiveTrades'
import PositionsTable from './PositionsTable/PositionsTable'
import OpenOrdersTable from './OpenOrdersTable/OpenOrdersTable'
import OrderHistoryTable from './OrderHistoryTable/OrderHistoryDataWrapper'
import TradeHistoryTable from './TradeHistoryTable/TradeHistoryDataWrapper'
import StrategiesHistoryTable from './StrategiesHistoryTable/StrategiesHistoryDataWrapper'
import Funds from './FundsTable/FundsTable'

import { getKeysNames } from '@core/graphql/queries/user/getKeysNames'
import { withErrorFallback } from '@core/hoc/withErrorFallback'

class TradingTable extends React.PureComponent<IProps, IState> {
  state: IState = {
    tabIndex: 0,
    tab: 'activeTrades',
    canceledOrders: [],
    showAllPositionPairs: false,
    showAllOpenOrderPairs: false,
    showAllSmartTradePairs: false,
    showPositionsFromAllAccounts: true,
    showOpenOrdersFromAllAccounts: true,
    showSmartTradesFromAllAccounts: true,
  }

  handleTabChange = (tab: string | any) => {
    this.setState({
      tab,
    })
  }

  addOrderToCanceled = (orderId: string) => {
    this.setState((prev) => {
      return { canceledOrders: [...prev.canceledOrders].concat(orderId) }
    })
  }

  clearCanceledOrders = () => {
    this.setState({ canceledOrders: [] })
  }

  render() {
    const {
      tab,
      canceledOrders,
      showAllPositionPairs,
      showAllOpenOrderPairs,
      showAllSmartTradePairs,
      showPositionsFromAllAccounts,
      showOpenOrdersFromAllAccounts,
      showSmartTradesFromAllAccounts,
    } = this.state

    const {
      selectedKey,
      marketType,
      exchange,
      currencyPair,
      arrayOfMarketIds,
      priceFromOrderbook,
      pricePrecision,
      quantityPrecision,
      getKeysNamesQuery,
    } = this.props

    const keys = getKeysNamesQuery.myPortfolios[0].keys.reduce(
      (acc, key) => ({
        ...acc,
        [key.keyId]: key.name,
      }),
      {}
    )

    return (
      <div
        id="tables"
        style={{
          height: '100%',
          backgroundColor: '#fff',
          border: '0.1rem solid #e0e5ec',
          borderRadius: '0.75rem',
          boxShadow: '0px 0px 1.2rem rgba(8, 22, 58, 0.1)',
        }}
      >
        <ActiveTrades
          {...{
            tab,
            keys,
            selectedKey,
            marketType,
            exchange,
            currencyPair,
            canceledOrders,
            arrayOfMarketIds,
            pricePrecision,
            quantityPrecision,
            showAllPositionPairs,
            showAllOpenOrderPairs,
            showAllSmartTradePairs,
            showPositionsFromAllAccounts,
            showOpenOrdersFromAllAccounts,
            showSmartTradesFromAllAccounts,
            handleToggleAllKeys: () =>
              this.setState((prev) => ({
                showSmartTradesFromAllAccounts: !prev.showSmartTradesFromAllAccounts,
              })),
            handleToggleSpecificPair: () =>
              this.setState((prev) => ({
                showAllSmartTradePairs: !prev.showAllSmartTradePairs,
              })),
            show: tab === 'activeTrades',
            handleTabChange: this.handleTabChange,
            showCancelResult: this.props.showCancelResult,
            addOrderToCanceled: this.addOrderToCanceled,
          }}
        />
        <StrategiesHistoryTable
          {...{
            tab,
            keys,
            selectedKey,
            marketType,
            exchange,
            currencyPair,
            canceledOrders,
            arrayOfMarketIds,
            showAllPositionPairs,
            showAllOpenOrderPairs,
            showAllSmartTradePairs,
            showPositionsFromAllAccounts,
            showOpenOrdersFromAllAccounts,
            showSmartTradesFromAllAccounts,
            show: tab === 'strategiesHistory',
            handleTabChange: this.handleTabChange,
            showCancelResult: this.props.showCancelResult,
          }}
        />
        <PositionsTable
          {...{
            tab,
            keys,
            selectedKey,
            marketType,
            exchange,
            currencyPair,
            canceledOrders,
            arrayOfMarketIds,
            pricePrecision,
            quantityPrecision,
            priceFromOrderbook,
            showAllPositionPairs,
            showAllOpenOrderPairs,
            showAllSmartTradePairs,
            showPositionsFromAllAccounts,
            showOpenOrdersFromAllAccounts,
            showSmartTradesFromAllAccounts,
            handleToggleAllKeys: () =>
              this.setState((prev) => ({
                showPositionsFromAllAccounts: !prev.showPositionsFromAllAccounts,
              })),
            handleToggleSpecificPair: () =>
              this.setState((prev) => ({
                showAllPositionPairs: !prev.showAllPositionPairs,
              })),
            show: tab === 'positions',
            handleTabChange: this.handleTabChange,
            showOrderResult: this.props.showOrderResult,
            showCancelResult: this.props.showCancelResult,
            clearCanceledOrders: this.clearCanceledOrders,
            addOrderToCanceled: this.addOrderToCanceled,
          }}
        />
        <OpenOrdersTable
          {...{
            tab,
            keys,
            selectedKey,
            marketType,
            arrayOfMarketIds,
            canceledOrders,
            currencyPair,
            showAllPositionPairs,
            showAllOpenOrderPairs,
            showAllSmartTradePairs,
            showPositionsFromAllAccounts,
            showOpenOrdersFromAllAccounts,
            showSmartTradesFromAllAccounts,
            handleToggleAllKeys: () =>
              this.setState((prev) => ({
                showOpenOrdersFromAllAccounts: !prev.showOpenOrdersFromAllAccounts,
              })),
            handleToggleSpecificPair: () =>
              this.setState((prev) => ({
                showAllOpenOrderPairs: !prev.showAllOpenOrderPairs,
              })),
            show: tab === 'openOrders',
            handleTabChange: this.handleTabChange,
            showCancelResult: this.props.showCancelResult,
            clearCanceledOrders: this.clearCanceledOrders,
            addOrderToCanceled: this.addOrderToCanceled,
          }}
        />
        <OrderHistoryTable
          {...{
            tab,
            keys,
            selectedKey,
            marketType,
            arrayOfMarketIds,
            canceledOrders,
            currencyPair,
            showAllPositionPairs,
            showAllOpenOrderPairs,
            showAllSmartTradePairs,
            showPositionsFromAllAccounts,
            showOpenOrdersFromAllAccounts,
            showSmartTradesFromAllAccounts,
            show: tab === 'orderHistory',
            handleTabChange: this.handleTabChange,
          }}
        />
        <TradeHistoryTable
          {...{
            tab,
            keys,
            selectedKey,
            marketType,
            arrayOfMarketIds,
            canceledOrders,
            currencyPair,
            showAllPositionPairs,
            showAllOpenOrderPairs,
            showAllSmartTradePairs,
            showPositionsFromAllAccounts,
            showOpenOrdersFromAllAccounts,
            showSmartTradesFromAllAccounts,
            show: tab === 'tradeHistory',
            handleTabChange: this.handleTabChange,
          }}
        />
        <Funds
          {...{
            tab,
            selectedKey,
            marketType,
            canceledOrders,
            arrayOfMarketIds,
            currencyPair,
            showAllPositionPairs,
            showAllOpenOrderPairs,
            showAllSmartTradePairs,
            showPositionsFromAllAccounts,
            showOpenOrdersFromAllAccounts,
            showSmartTradesFromAllAccounts,
            show: tab === 'funds',
            handleTabChange: this.handleTabChange,
          }}
        />
        <StyleForCalendar />
      </div>
    )
  }
}

export default compose(
  withErrorFallback,
  queryRendererHoc({
    query: getKeysNames,
    name: 'getKeysNamesQuery',
    fetchPolicy: 'cache-and-network',
  })
)(TradingTable)
