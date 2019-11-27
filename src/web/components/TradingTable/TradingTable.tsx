import React, { ChangeEvent } from 'react'
import { compose } from 'recompose'

// MOVE THIS TO APP -_>
import 'react-dates/initialize'
import 'react-dates/lib/css/_datepicker.css'
// <-- MOVE THIS TO APP

import { IProps, IState } from './TradingTable.types'
import { tradingTableTabConfig } from './TradingTable.mocks'
import { CustomCard } from '@sb/compositions/Chart/Chart.styles'

import PositionsTable from './PositionsTable/PositionsTable'
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

  handleTabChange = (tab: string | any) => {
    this.setState({
      tab,
    })
  }

  render() {
    const { tab } = this.state
    const {
      getSelectedKeyQuery: {
        chart: { selectedKey },
      },
      marketType,
    } = this.props

    return (
      <>
        <PositionsTable
          {...{
            tab,
            selectedKey,
            marketType,
            show: tab === 'positions',
            handleTabChange: this.handleTabChange,
            showCancelResult: this.props.showCancelResult,
          }}
        />
        <OpenOrdersTable
          {...{
            tab,
            selectedKey,
            marketType,
            show: tab === 'openOrders',
            handleTabChange: this.handleTabChange,
            showCancelResult: this.props.showCancelResult,
          }}
        />
        <OrderHistoryTable
          {...{
            tab,
            selectedKey,
            marketType,
            show: tab === 'orderHistory',
            handleTabChange: this.handleTabChange,
          }}
        />
        <TradeHistoryTable
          {...{
            tab,
            selectedKey,
            marketType,
            show: tab === 'tradeHistory',
            handleTabChange: this.handleTabChange,
          }}
        />
        <Funds
          {...{
            tab,
            selectedKey,
            marketType,
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
