import * as React from 'react'
import { StyledTable } from './TraderOrderHistoryTable.styles'
import { IProps } from './TraderOrderHistoryTable.types'
import { withWidth } from '@material-ui/core'
import { isWidthUp } from '@material-ui/core/withWidth'
import { withTheme } from '@material-ui/styles'

@withTheme()
class TradeOrderHistoryTable extends React.Component<IProps> {
  // componentDidMount() {
  //   if (isWidthUp('xl', this.props.width)) {
  //     this.setState({
  //       rowsPerPage: 20
  //     })
  //   }
  // }

  render() {
    const { rows, page, perPage, count, handleChangePage, handleChangeRowsPerPage } = this.props

    return (
      <StyledTable
        style={{ height: '19.5vw', overflowY: 'scroll' }}
        id="PortfolioActionsTable"
        padding="dense"
        data={{ body: rows.body }}
        columnNames={rows.head}
        emptyTableText="No history"
        pagination={{
          fakePagination: false,
          enabled: true,
          totalCount: count,
          page: page,
          rowsPerPage: perPage,
          rowsPerPageOptions: [30, 50, 70, 100],
          handleChangePage: handleChangePage,
          handleChangeRowsPerPage: handleChangeRowsPerPage,
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
            color: '#7284A0',
            background: 'white'
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
}

export default withWidth()(TradeOrderHistoryTable)
