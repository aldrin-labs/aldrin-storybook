import * as React from 'react'
import { StyledTable } from './TraderOrderHistoryTable.styles'
import { IProps } from './TraderOrderHistoryTable.types'
import { withTheme } from '@material-ui/styles'

@withTheme()
class TradeOrderHistoryTable extends React.Component<IProps> {
  state = {
    activeSortArg: null,
    page: 0,
    rowsPerPage: 11,
  }

  handleChangePage = (
    event: React.ChangeEvent<HTMLInputElement>,
    page: number
  ) => {
    this.setState({ page })
  }

  handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ rowsPerPage: event.target.value })
  }

  render() {
    const { rows, theme } = this.props

    return (
      <StyledTable
        style={{ height: '10vh', overflow: 'scroll' }}
        id="PortfolioActionsTable"
        padding="dense"
        data={{ body: rows.body }}
        columnNames={rows.head}
        emptyTableText="No history"
        pagination={{
          // enabled: false, // toogle page nav panel in the footer
          page: this.state.page,
          rowsPerPage: this.state.rowsPerPage,
          rowsPerPageOptions: [20, 50, 100, 200],
          handleChangeRowsPerPage: this.handleChangeRowsPerPage,
          handleChangePage: this.handleChangePage,
        }}
        tableStyles={{
          heading: {
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '1.2rem',
            fontWeight: 600,
            letterSpacing: 1,
            borderBottom: '1px solid #e0e5ec',
            color: '#7284A0',
            whiteSpace: 'nowrap'
          },
          cell: {
            width: '9.5rem'
          }
        }}
      />
    )
  }
}

export default TradeOrderHistoryTable
