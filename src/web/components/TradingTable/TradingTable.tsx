import React, { ChangeEvent } from 'react'
import { compose } from 'recompose'

// MOVE THIS TO APP -_>
import 'react-dates/initialize'
import 'react-dates/lib/css/_datepicker.css'
// <-- MOVE THIS TO APP

import { IProps, IState } from './TradingTable.types'
import { tradingTableTabConfig } from './TradingTable.mocks'

import OpenOrdersTable from './OpenOrdersTable/OpenOrdersTable'
import OrderHistoryTable from './OrderHistoryTable/OrderHistoryDataWrapper'
import TradeHistoryTable from './TradeHistoryTable/TradeHistoryDataWrapper'
import Funds from './FundsTable/FundsTable'
import { withErrorFallback } from '@core/hoc/withErrorFallback'
import { getSelectedKey } from '@core/graphql/queries/chart/getSelectedKey'
import { queryRendererHoc } from '@core/components/QueryRenderer'

class TradingTable extends React.PureComponent<IProps, IState> {
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
    const { getSelectedKeyQuery: { chart: { selectedKey } } } = this.props

    return (
      <>
        <OpenOrdersTable
          {...{
            tab,
            tabIndex,
            selectedKey,
            show: tab === 'openOrders',
            handleTabChange: this.handleTabChange,
            showCancelResult: this.props.showCancelResult,
          }}
        />
        <OrderHistoryTable
          {...{
            tab,
            tabIndex,
            selectedKey,
            show: tab === 'orderHistory',
            handleTabChange: this.handleTabChange,
          }}
        />
        <TradeHistoryTable
          {...{
            tab,
            tabIndex,
            selectedKey,
            show: tab === 'tradeHistory',
            handleTabChange: this.handleTabChange,
          }}
        />
        <Funds
          {...{
            tab,
            tabIndex,
            selectedKey,
            show: tab === 'funds',
            handleTabChange: this.handleTabChange,
          }}
        />
      </>
    )
  }
}

export default compose(
  withErrorFallback,
  queryRendererHoc({
    query: getSelectedKey,
    name: 'getSelectedKeyQuery',
  })
)(TradingTable)
