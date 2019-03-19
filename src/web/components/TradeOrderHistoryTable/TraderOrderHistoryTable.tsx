import * as React from 'react'
import { TableWithSort } from '@sb/components/index'
import { IProps } from './TraderOrderHistoryTable.types'

class TradeOrderHistoryTable extends React.Component<IProps> {
  render() {
    const { rows } = this.props

    return (
      <TableWithSort
        id="PortfolioActionsTable"
        padding="dense"
        title="Portfolio Actions"
        data={{ body: rows.body }}
        columnNames={rows.head}
        emptyTableText="No history"
      />
    )
  }
}

export default TradeOrderHistoryTable
