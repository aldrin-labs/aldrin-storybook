import * as React from 'react'
import { TableWithSort } from '@storybook/components/index'
import Loader from '@components/TablePlaceholderLoader/newLoader'
import { IProps } from './TraderOrderHistoryTable.types'

class TradeOrderHistoryTable extends React.Component<IProps> {
  render() {
    const { rows } = this.props

    if (rows.body.length === 0) {
      return <Loader />
    }

    return (
      <TableWithSort
        id="PortfolioActionsTable"
        padding="dense"
        title="Portfolio Actions"
        data={{ body: rows.body }}
        columnNames={rows.head}
      />
    )
  }
}

export default TradeOrderHistoryTable
