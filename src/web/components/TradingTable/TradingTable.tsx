import React, { ChangeEvent } from 'react'
// MOVE THIS TO APP -_>
import 'react-dates/initialize'
import 'react-dates/lib/css/_datepicker.css'
// <-- MOVE THIS TO APP
import moment from 'moment'
import { withTheme } from '@material-ui/styles'
import { Tabs, Grow } from '@material-ui/core'
import { Table, TableWithSort } from '@sb/components'

import { TitleTab } from './TradingTable.styles'
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

import TitleOrderHistory from './TitleOrderHistory/TitleOrderHistory'
import TitleTradeHistory from './TitleTradeHistory/TitleTradeHistory'

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

const getTableHead = (tab: string) =>
  tab === 'openOrders'
    ? openOrdersColumnNames
    : tab === 'orderHistory'
    ? orderHistoryColumnNames
    : tab === 'tradeHistory'
    ? tradeHistoryColumnNames
    : tab === 'funds'
    ? fundsColumnNames
    : []

const getEmptyTextPlaceholder = (tab: string) =>
  tab === 'openOrders'
    ? 'You have no open orders.'
    : tab === 'orderHistory'
    ? 'You have no order history'
    : tab === 'tradeHistory'
    ? 'You have no trades.'
    : tab === 'funds'
    ? 'You have no Funds'
    : []

@withTheme()
export default class TradingTable extends React.PureComponent<IProps, IState> {
  state: IState = {
    tabIndex: 0,
    tab: 'openOrders',
    startDate: null,
    endDate: null,
    focusedInput: null,
    activeDateButton: null,
  }

  onCancelOrder = async (arg: any) => {
    // TODO: here should be a mutation order to cancel a specific order
    // TODO: Also it should receive an argument to edentify the order that we should cancel
    // TODO: Also it would be good to show the dialog message here after mutation completed
  }

  onCancelAll = async () => {
    // TODO: here should be a mutation func to cancel all orders
    // TODO: Also it would be good to show the dialog message here after mutation completed
  }

  handleTabChange = (e: ChangeEvent<{}>, tabIndex: number | any) => {
    this.setState({
      tabIndex,
      tab: tradingTableTabConfig[tabIndex],
    })
  }

  render() {
    const { tab } = this.state
    const { theme } = this.props
    const textColor: string = theme.palette.text.primary
    const secondary = theme.palette.secondary.main
    const primaryLight = theme.palette.primary.light
    const fontFamily = theme.typography.fontFamily
    const maximumDate = moment()
    const minimumDate = moment().subtract(3, 'years')

    return (
      <TableWithSort
        emptyTableText={getEmptyTextPlaceholder(tab)}
        withCheckboxes={false}
        title={
          <div>
            <div>
              <Tabs
                value={this.state.tabIndex}
                onChange={this.handleTabChange}
                indicatorColor="secondary"
                textColor="primary"
              >
                <TitleTab label="Open orders" primary={textColor} />
                <TitleTab label="Order history" primary={textColor} />
                <TitleTab label="Trade history" primary={textColor} />
                <TitleTab label="Funds" primary={textColor} />
              </Tabs>
            </div>
             <TitleOrderHistory
                {...{
                  minimumDate,
                  maximumDate,
                  secondary,
                  fontFamily,
                  textColor,
                  primaryLight,
                  show: tab === 'orderHistory',
                }}
              />
              <TitleTradeHistory
                {...{
                  minimumDate,
                  maximumDate,
                  secondary,
                  fontFamily,
                  textColor,
                  primaryLight,
                  show: tab === 'tradeHistory',
                }}
              />
          </div>
        }
        data={{ body: getTableBody(this.state.tab) }}
        columnNames={getTableHead(this.state.tab)}
      />
    )
  }
}
