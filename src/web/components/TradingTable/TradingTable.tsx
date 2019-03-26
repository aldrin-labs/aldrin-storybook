import React from 'react'
import MoreVertIcon from '@material-ui/icons/NetworkCellSharp'

import { Table } from '@sb/components'
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
    tab: 'openOrders',
  }

  onTradingTableTabChange = (i: number) => {
    this.setState({ tab: tradingTableTabConfig[i] })
  }

  render() {
    return (
      <Table
        withCheckboxes={false}
        title={new Array(4).fill(undefined).map((el, i) => (
          <button onClick={() => this.onTradingTableTabChange(i)}>{`${
            tradingTableTabConfig[i]
          }`}</button>
        ))}
        data={{ body: getTableBody(this.state.tab) }}
        columnNames={getTableHead(this.state.tab)}
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
