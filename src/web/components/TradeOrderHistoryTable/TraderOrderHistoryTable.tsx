import * as React from 'react'
import { StyledTable } from './TraderOrderHistoryTable.styles'
import { IProps } from './TraderOrderHistoryTable.types'
import { withWidth } from '@material-ui/core'
import { isWidthUp } from '@material-ui/core/withWidth'
import { withTheme } from '@material-ui/styles'

@withTheme()
class TradeOrderHistoryTable extends React.Component<IProps> {
  state = {
    activeSortArg: null,
    page: 0,
    rowsPerPage: 7,
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
    const { rows } = this.props

    return (
      <StyledTable
        style={{ width: '19.5vw', overflowY: 'scroll' }}
        id="PortfolioActionsTable"
        padding="dense"
        data={{ body: rows.body }}
        columnNames={rows.head}
        emptyTableText="No history"
        pagination={{
          enabled: true, // toogle page nav panel in the footer
          page: this.state.page,
          rowsPerPage: this.state.rowsPerPage,
          rowsPerPageOptions: [20, 50, 100, 200],
          handleChangeRowsPerPage: this.handleChangeRowsPerPage,
          handleChangePage: this.handleChangePage,
        }}
        tableStyles={{
          heading: {
            padding: '1.2rem 1.6rem 1.2rem 1.2rem',
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '1.1rem',
            fontWeight: 600,
            letterSpacing: 0.5,
            borderBottom: '2px solid #e0e5ec',
            whiteSpace: 'nowrap',
            color: '#7284A0'
          },
          cell: {
            padding: '1.2rem 1.6rem 1.2rem 1.2rem',
            fontFamily: "'DM Sans Bold', sans-serif",
            fontSize: '1.1rem',
            fontWeight: 500,
            textTransform: 'uppercase',
            letterSpacing: 0.5,
            color: '#7284A0'
          }
        }}
      />
    )
  }

  componentDidMount() {
    if (isWidthUp('xl', this.props.width)) {
      this.setState({
        rowsPerPage: 20
      })
    }
  }
}

export default withWidth()(TradeOrderHistoryTable)
