import * as React from 'react'
import SelectCoinList from '@core/components/SelectCoinList/SelectCoinList'
import { StyledTable } from './TraderOrderHistoryTable.styles'
import { IProps } from './TraderOrderHistoryTable.types'
import { withWidth } from '@material-ui/core'
import { withTheme } from '@material-ui/styles'

const coinFilterComponent = (
  assets,
  inputValue,
  filterCoin,
  onInputChange,
  updateFilterCoin
) => (
  <SelectCoinList
    //ref={handleRef}
    assets={assets}
    key={`inputCoinSymbol${'index'}`}
    placeholder="coin"
    classNamePrefix="custom-select-box"
    isClearable={true}
    isSearchable={true}
    menuPortalTarget={document.body}
    menuPortalStyles={{
      zIndex: 11111,
    }}
    menuStyles={{
      fontSize: '12px',
      minWidth: '150px',
      borderRadius: '1.5rem',
      textAlign: 'center',
      background: 'white',
      position: 'relative',
      boxShadow: '0px 0px 8px rgba(10,19,43,0.1)',
      border: '1px solid #e0e5ec',
      color: '#7284A0',
    }}
    menuListStyles={{
      height: '8rem',
    }}
    optionStyles={{
      color: '#7284A0',
      background: '#fff',
      textAlign: 'left',
      fontSize: '12px',
      position: 'relative',

      '&:hover': {
        borderRadius: '1rem',
        color: '#16253D',
        background: '#E7ECF3',
      },
    }}
    clearIndicatorStyles={{
      padding: '2px',
    }}
    inputStyles={{
      marginLeft: '0',
      color: '#7284A0',
      opacity: '1',
    }}
    dropdownIndicatorStyles={{
      display: 'none',
    }}
    valueContainerStyles={{
      border: '1px solid #E7ECF3',
      borderRadius: '3rem',
      background: '#fff',
      paddingLeft: '15px',
      minWidth: '80px',
      color: '#7284A0',
    }}
    singleValueStyles={{
      height: 'auto',
      width: 'auto',
      color: 'rgb(114, 132, 160);',
      overflow: 'auto',
    }}
    noOptionsMessageStyles={{
      textAlign: 'left',
    }}
    inputValue={inputValue}
    filterCoin={filterCoin}
    onInputChange={(value) => {
      if (value === '') {
        updateFilterCoin('')
        onInputChange('')
        return
      }
      onInputChange(value)
    }}
    onChange={(
      optionSelected: {
        label: string
        value: string
        priceUSD: string | number
      } | null
    ) => {
      updateFilterCoin(optionSelected ? optionSelected.label : '')
    }}
  />
)

@withTheme()
class TradeOrderHistoryTable extends React.Component<IProps> {
  addFilter = (
    headings,
    rows,
    inputValue,
    filterCoin,
    onInputChange,
    updateFilterCoin
  ) => {
    return headings.map((heading) => {
      if (heading.label === 'pairFilter')
        return {
          ...heading,
          label: coinFilterComponent(
            rows,
            inputValue,
            filterCoin,
            onInputChange,
            updateFilterCoin
          ),
        }
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
      inputValue,
      filterCoin,
      onInputChange,
      updateFilterCoin,
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
        columnNames={this.addFilter(
          rows.head,
          rows.body,
          inputValue,
          filterCoin,
          onInputChange,
          updateFilterCoin
        )}
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
