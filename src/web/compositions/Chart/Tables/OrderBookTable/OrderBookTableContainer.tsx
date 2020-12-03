import React, { Component, ChangeEvent, PureComponent } from 'react'

// import QueryRenderer from '@core/components/QueryRenderer'

// import { checkLoginStatus } from '@core/utils/loginUtils'
// import { getOpenOrderHistory } from '@core/graphql/queries/chart/getOpenOrderHistory'
// import { OPEN_ORDER_HISTORY } from '@core/graphql/subscriptions/OPEN_ORDER_HISTORY'
import {
  filterOpenOrders,
  // updateOpenOrderHistoryQuerryFunction,
} from '@sb/components/TradingTable/TradingTable.utils'

import OrderBookTable from './Tables/Asks/OrderBookTable'
import SpreadTable from './Tables/Bids/SpreadTable'
import LastTrade from './Tables/LastTrade/LastTrade'
import OrderBookCardHeader from './OrderBookCardHeader'

import { IProps, IState, OrderbookMode } from './OrderBookTableContainer.types'

// import { getAggregationsFromMinPriceDigits } from '@core/utils/chartPageUtils'

class OrderBookTableContainer extends PureComponent<IProps, IState> {
  state: IState = {
    mode: 'both',
  }

  componentDidUpdate(prevProps) {
    const { getOpenOrderHistoryQuery, addOrderToOrderbookTree } = this.props
    const { getOpenOrderHistoryQuery: prevOpenOrderHistoryQuery } = prevProps

    const {
      getOpenOrderHistory = { orders: [], count: 0 },
    } = getOpenOrderHistoryQuery || {
      getOpenOrderHistory: { orders: [], count: 0 },
    }

    const {
      getOpenOrderHistory: prevOpenOrderHistory = { orders: [], count: 0 },
    } = prevOpenOrderHistoryQuery || {
      getOpenOrderHistory: { orders: [], count: 0 },
    }

    const isNewOrder =
      getOpenOrderHistory.orders.length > prevOpenOrderHistory.orders.length
    const newCachedOrder = getOpenOrderHistory.orders.find(
      (order) => order.marketId === '0'
    )

    if (isNewOrder && newCachedOrder) {
      const transformedOrder = {
        timestamp: +new Date() / 1000,
        price: newCachedOrder.price,
        size: newCachedOrder.info.origQty,
      }

      console.log('add order to ob')
      addOrderToOrderbookTree(transformedOrder)
    }
  }

  setOrderbookMode = (mode: OrderbookMode) => this.setState({ mode })

  render() {
    const {
      data,
      quote,
      base,
      theme,
      exchange,
      marketType,
      marketOrders,
      aggregation,
      symbol,
      onButtonClick,
      minPriceDigits,
      arrayOfMarketIds,
      amountForBackground,
      setOrderbookAggregation,
      updateTerminalPriceFromOrderbook,
      getOpenOrderHistoryQuery,
    } = this.props

    const { mode } = this.state
    const {
      getOpenOrderHistory = { orders: [], count: 0 },
    } = getOpenOrderHistoryQuery || {
      getOpenOrderHistory: { orders: [], count: 0 },
    }

    const openOrders = getOpenOrderHistory.orders.filter((order) =>
      filterOpenOrders({ order, canceledOrders: [] })
    )
    // const aggregationModes = getAggregationsFromMinPriceDigits(minPriceDigits)

    return (
      <>
        <OrderBookCardHeader theme={theme} mode={mode} setOrderbookMode={this.setOrderbookMode} />

        <OrderBookTable
          data={data}
          mode={mode}
          theme={theme}
          marketType={marketType}
          arrayOfMarketIds={arrayOfMarketIds}
          aggregation={aggregation}
          onButtonClick={onButtonClick}
          openOrderHistory={openOrders}
          currencyPair={symbol}
          amountForBackground={amountForBackground}
          updateTerminalPriceFromOrderbook={updateTerminalPriceFromOrderbook}
          quote={quote}
          base={base}
        />

        <LastTrade
          // mode={mode}
          theme={theme}
          minPriceDigits={minPriceDigits}
          marketType={marketType}
          symbol={symbol}
          exchange={exchange}
          updateTerminalPriceFromOrderbook={updateTerminalPriceFromOrderbook}
        />

        <SpreadTable
          data={data}
          mode={mode}
          theme={theme}
          marketType={marketType}
          arrayOfMarketIds={arrayOfMarketIds}
          aggregation={aggregation}
          openOrderHistory={openOrders}
          currencyPair={symbol}
          amountForBackground={amountForBackground}
          updateTerminalPriceFromOrderbook={updateTerminalPriceFromOrderbook}
          quote={quote}
          base={base}
        />
      </>
    )
  }
}


export default OrderBookTableContainer
