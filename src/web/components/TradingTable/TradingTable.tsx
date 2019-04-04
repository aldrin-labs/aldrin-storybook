import React, { ChangeEvent } from 'react'
// MOVE THIS TO APP -_>
import 'react-dates/initialize'
import 'react-dates/lib/css/_datepicker.css'
// <-- MOVE THIS TO APP

import { IProps, IState } from './TradingTable.types'
import {
  tradingTableTabConfig,
} from './TradingTable.mocks'

import OpenOrdersTable from './OpenOrdersTable/OpenOrdersTable'
import OrderHistoryTable from './OrderHistoryTable/OrderHistoryDataWrapper'
import TradeHistoryTable from './TradeHistoryTable/TradeHistoryDataWrapper'

export default class TradingTable extends React.PureComponent<IProps, IState> {
  state: IState = {
    tabIndex: 0,
    tab: 'openOrders',
  }

  handleTabChange = (e: ChangeEvent<{}>, tabIndex: number | any) => {
    this.setState({
      tabIndex,
      tab: tradingTableTabConfig[tabIndex],
    })
  }

  render() {
    const { tab, tabIndex } = this.state

    return (
      <>
        <OpenOrdersTable
          {...{
            tab,
            tabIndex,
            show: tab === 'openOrders',
            handleTabChange: this.handleTabChange,
          }}
        />
        <OrderHistoryTable
          {...{
            tab,
            tabIndex,
            show: tab === 'orderHistory',
            handleTabChange: this.handleTabChange,
          }}
        />
        <TradeHistoryTable
          {...{
            tab,
            tabIndex,
            show: tab === 'tradeHistory',
            handleTabChange: this.handleTabChange,
          }}
        />
      </>
    )
  }
}
