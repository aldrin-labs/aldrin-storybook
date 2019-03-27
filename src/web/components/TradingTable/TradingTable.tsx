import React from 'react'
import MoreVertIcon from '@material-ui/icons/NetworkCellSharp'
import { Button, Tabs, Tab } from '@material-ui/core'

import { Table } from '@sb/components'
import { StyledWrapperForDateRangePicker } from '@sb/styles/cssUtils'
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

export default class TradingTable extends React.PureComponent<IProps, IState> {
  state: IState = {
    tabValue: 0,
    tab: 'openOrders',
  }

  onTradingTableTabChange = (i: number) => {
    this.setState({ tab: tradingTableTabConfig[i] })
  }
  handleChange = (e, tabValue) => {
    this.setState({
      tabValue,
      tab: tradingTableTabConfig[tabValue],
    })
  }

  render() {
    return (
      <Table
        withCheckboxes={false}
        title={(
          <Tabs
            value={this.state.tabValue}
            onChange={this.handleChange}
            indicatorColor="secondary"
            textColor="primary"
          >
            <Tab label="Open orders" />
            <Tab label="Order history" />
            <Tab label="Trade history" />
            <Tab label="Funds" />
          </Tabs>
        )}
        data={{ body: getTableBody(this.state.tab) }}
        columnNames={getTableHead(this.state.tab)}

        // actions={[
        //     {
        //       id: '1',
        //       icon: <MoreVertIcon />,
        //       onClick: action('1'),
        //       color: 'primary',
        //     },
        // ]}
        // actions={[
        //   {
        //     id: '1',
        //     icon: <MoreVertIcon />,
        //     onClick: action('1'),
        //     color: 'primary',
        //   },
        //   {
        //     id: '2',
        //     icon: <MoreVertIcon />,
        //     onClick: action('2'),
        //   },
        // ]}
      />
    )
  }
}
