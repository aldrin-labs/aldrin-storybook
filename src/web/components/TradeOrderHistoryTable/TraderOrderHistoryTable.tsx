import * as React from 'react'
import { TableWithSort } from '@sb/components/index'
import { IProps } from './TraderOrderHistoryTable.types'

class TradeOrderHistoryTable extends React.Component<IProps> {
  // state = {
  //   activeSortArg: null,
  //   page: 0,
  //   rowsPerPage: 20,
  // }

  // handleChangePage = (
  //   event: React.ChangeEvent<HTMLInputElement>,
  //   page: number
  // ) => {
  //   this.setState({ page })
  // }

  // handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   this.setState({ rowsPerPage: event.target.value })
  // }

  render() {
    const { rows } = this.props

    return (
      <TableWithSort
        id="PortfolioActionsTable"
        padding="dense"
        title="TRANSACTIONS"
        data={{ body: rows.body }}
        columnNames={rows.head}
        emptyTableText="No history"
        // pagination={{
        //   enabled: true,
        //   page: this.state.page,
        //   rowsPerPage: this.state.rowsPerPage,
        //   rowsPerPageOptions: [20, 50, 100, 200],
        //   handleChangeRowsPerPage: this.handleChangeRowsPerPage,
        //   handleChangePage: this.handleChangePage,
        // }}
      />
    )
  }
}

export default TradeOrderHistoryTable