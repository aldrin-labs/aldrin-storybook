import React, { ChangeEvent } from 'react'
// MOVE THIS TO APP -_>
import 'react-dates/initialize'
import 'react-dates/lib/css/_datepicker.css'
// <-- MOVE THIS TO APP
import moment from 'moment'
import { TableWithSort } from '@sb/components'

import { IProps, IState } from './TradingTable.types'
import {
  tradingTableTabConfig,
  openOrdersBody,
  openOrdersColumnNames,
  orderHistoryBody,
  orderHistoryColumnNames,
  tradeHistoryBody,
  tradeHistoryColumnNames,
  fundsBody,
  fundsColumnNames,
} from './TradingTable.mocks'

// import TitleOrderHistory from './TitleOrderHistory/TitleOrderHistory'
// import TitleTradeHistory from './TitleTradeHistory/TitleTradeHistory'
import { getEmptyTextPlaceholder, getTableHead } from './TradingTable.utils'
import TradingTabs from '@components/TradingTable/TradingTabs/TradingTabs'
import OpenOrdersTable from './OpenOrdersTable/OpenOrdersTable'
import OrderHistoryTable from './OrderHistoryTable/OrderHistoryDataWrapper'

const getTableBody = (tab: string) =>
  tab === 'openOrders'
    ? openOrdersBody
    : tab === 'orderHistory'
    ? orderHistoryBody
    : tab === 'tradeHistory'
    ? tradeHistoryBody
    : tab === 'funds'
    ? fundsBody
    : []

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
      </>
    )

    // return (
    //   <TableWithSort
    //     emptyTableText={getEmptyTextPlaceholder(tab)}
    //     withCheckboxes={false}
    //     title={
    //       <div>
    //         <TradingTabs
    //           tabIndex={tabIndex}
    //           handleTabChange={this.handleTabChange}
    //         />
    //         <TitleOrderHistory
    //           {...{
    //             minimumDate,
    //             maximumDate,
    //             show: tab === 'orderHistory',
    //             key: 'titleOrder',
    //           }}
    //         />
    //         <TitleTradeHistory
    //           {...{
    //             minimumDate,
    //             maximumDate,
    //             show: tab === 'tradeHistory',
    //             key: 'titleTrade',
    //           }}
    //         />
    //       </div>
    //     }
    //     data={{ body: getTableBody(this.state.tab) }}
    //     columnNames={getTableHead(this.state.tab)}
    //   />
    // )
  }
}
