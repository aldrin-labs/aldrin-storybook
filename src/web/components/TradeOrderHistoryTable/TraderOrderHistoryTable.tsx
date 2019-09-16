import * as React from 'react'
import { StyledTable } from './TraderOrderHistoryTable.styles'
import { IProps } from './TraderOrderHistoryTable.types'
import { withWidth } from '@material-ui/core'
import { withTheme } from '@material-ui/styles'

@withTheme()
class TradeOrderHistoryTable extends React.Component<IProps> {
  render() {
    const {
      rows,
      page,
      perPage,
      count,
      handleChangePage,
      handleChangeRowsPerPage,
      isCustomStyleForFooter,
    } = this.props
    // 82.2
    return (
      <StyledTable
        isCustomStyleForFooter={isCustomStyleForFooter}
        style={{
          height: '88%',
          position: 'relative',
          overflowY: 'scroll',
          overflowX: 'hidden',
          borderTopLeftRadius: '0',
          borderTopRightRadius: '0',
        }}
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
            top: '-1px',
            padding: '1.2rem 1.6rem 1.2rem 1.2rem',
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '1.1rem',
            fontWeight: 600,
            letterSpacing: 0.5,
            borderBottom: '2px solid #e0e5ec',
            whiteSpace: 'nowrap',
            color: '#7284A0',
            background: '#F2F4F6',
          },
          cell: {
            padding: '1.2rem 1.6rem 1.2rem 1.2rem',
            fontFamily: "'DM Sans Bold', sans-serif",
            fontSize: '1.1rem',
            fontWeight: 500,
            textTransform: 'uppercase',
            letterSpacing: 0.5,
            color: '#7284A0',
          },
        }}
      />
    )
  }
}

export default withWidth()(TradeOrderHistoryTable)
