import * as React from 'react'
import { TableWithSort } from '@sb/components/index'
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

    const tableStyles = {
      heading: {
        background: 'transparent',
        color: '#ABBAD1',
        fontFamily: `DM Sans`,
        textTransform: 'uppercase',
        fontWeight: '700',
        fontSize: '1.2rem',
        borderBottom: '1px solid #E0E5EC',
        padding: '0 0 10px 10px',
      },
      title: {},
      cell: {
        letterSpacing: '1.5px',
        textTransform: 'uppercase',
        color: theme.palette.text.subPrimary,
        fontFamily: 'DM Sans',
        fontStyle: 'normal',
        fontWeight: '700',
        fontSize: '1.2rem',
        lineHeight: '31px',
        background: 'transparent',
        borderBottom: '1px solid #E0E5EC',
        height: '48px',
        paddingLeft: '10px',
      },
    }

    return (
      <TableWithSort
        id="PortfolioActionsTable"
        padding="dense"
        data={{ body: rows.body }}
        columnNames={rows.head}
        emptyTableText="No history"
        tableStyles={tableStyles}
        pagination={{
          enabled: true, // toogle page nav panel in the footer
          page: this.state.page,
          rowsPerPage: this.state.rowsPerPage,
          rowsPerPageOptions: [20, 50, 100, 200],
          handleChangeRowsPerPage: this.handleChangeRowsPerPage,
          handleChangePage: this.handleChangePage,
        }}
      />
    )
  }
}

export default TradeOrderHistoryTable
