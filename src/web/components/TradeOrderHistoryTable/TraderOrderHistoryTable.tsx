import * as React from 'react'
import { StyledTable, StyledArrow } from './TraderOrderHistoryTable.styles'
import { IProps } from './TraderOrderHistoryTable.types'
import { withWidth } from '@material-ui/core'
import { withTheme } from '@material-ui/styles'
import CoinRow from './CoinRow'

// const QuantityHeading = () => {
//   return (
//     <div>
//       <span>quantity</span>
//       <StyledArrow />
//     </div>
//   )
// }

@withTheme()
class TradeOrderHistoryTable extends React.Component<IProps> {
  addFilter = () => {
    const {
      rows: { head: headings },
      inputValue,
      filterCoin,
      onInputChange,
      updateFilterCoin,
    } = this.props

    return headings.map((heading) => {
      if (heading.label === 'pairFilter') {
        return {
          ...heading,
          label: (
            <CoinRow
              {...{
                inputValue,
                filterCoin,
                onInputChange,
                updateFilterCoin,
              }}
            />
          ),
        }
      }
      // else if (heading.label === 'quantity') {
      //   return {
      //     ...heading,
      //     label: <QuantityHeading />,
      //   }
      // }

      return { ...heading }
    })
  }

  render() {
    const {
      rows,
      page,
      perPage,
      count,
      handleChangePage,
      handleChangeRowsPerPage,
      isCustomStyleForFooter,
      defaultSort,
    } = this.props

    return (
      <StyledTable
        defaultSort={defaultSort}
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
        columnNames={this.addFilter()}
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
            padding: '.6rem 1.6rem .6rem 1.2rem',
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
