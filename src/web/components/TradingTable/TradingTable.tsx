import React from 'react'
import { compose } from 'recompose'

// MOVE THIS TO APP -_>
import 'react-dates/initialize'
import 'react-dates/lib/css/_datepicker.css'
// <-- MOVE THIS TO APP

import { IProps, IState } from './TradingTable.types'
import { StyleForCalendar } from '@sb/components/GitTransactionCalendar/Calendar.styles'

import ActiveTrades from './ActiveTrades/ActiveTrades'
import PositionsTable from './PositionsTable/PositionsTable'
import OpenOrdersTable from './OpenOrdersTable/OpenOrdersTable'
import OrderHistoryTable from './OrderHistoryTable/OrderHistoryDataWrapper'
import TradeHistoryTable from './TradeHistoryTable/TradeHistoryDataWrapper'
import StrategiesHistoryTable from './StrategiesHistoryTable/StrategiesHistoryDataWrapper'
import Funds from './FundsTable/FundsTable'
import { withErrorFallback } from '@core/hoc/withErrorFallback'

class TradingTable extends React.PureComponent<IProps, IState> {
  state: IState = {
    tabIndex: 0,
    tab: 'activeTrades',
    canceledOrders: [],
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
    const { tab, canceledOrders } = this.state
    const {
      selectedKey,
      marketType,
      exchange,
      currencyPair,
      arrayOfMarketIds,
      priceFromOrderbook,
      pricePrecision,
      quantityPrecision,
    } = this.props

    return (
      <div
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
            selectedKey,
            marketType,
            exchange,
            currencyPair,
            canceledOrders,
            arrayOfMarketIds,
            pricePrecision,
            quantityPrecision,
            show: tab === 'activeTrades',
            handleTabChange: this.handleTabChange,
            showCancelResult: this.props.showCancelResult,
          }}
        />
        <StrategiesHistoryTable
          {...{
            tab,
            selectedKey,
            marketType,
            exchange,
            currencyPair,
            canceledOrders,
            arrayOfMarketIds,
            show: tab === 'strategiesHistory',
            handleTabChange: this.handleTabChange,
            showCancelResult: this.props.showCancelResult,
          }}
        />
        <PositionsTable
          {...{
            tab,
            selectedKey,
            marketType,
            exchange,
            currencyPair,
            canceledOrders,
            arrayOfMarketIds,
            pricePrecision,
            quantityPrecision,
            show: tab === 'positions',
            priceFromOrderbook,
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
            selectedKey,
            marketType,
            arrayOfMarketIds,
            canceledOrders,
            currencyPair,
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
            selectedKey,
            marketType,
            arrayOfMarketIds,
            canceledOrders,
            currencyPair,
            show: tab === 'orderHistory',
            handleTabChange: this.handleTabChange,
          }}
        />
        <TradeHistoryTable
          {...{
            tab,
            selectedKey,
            marketType,
            arrayOfMarketIds,
            canceledOrders,
            currencyPair,
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
            show: tab === 'funds',
            handleTabChange: this.handleTabChange,
          }}
        />
        <StyleForCalendar />
      </div>
    )
  }
}

export default compose(withErrorFallback)(TradingTable)
