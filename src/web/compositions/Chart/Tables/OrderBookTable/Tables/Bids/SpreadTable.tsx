import React, { Component, PureComponent, CSSProperties } from 'react'
import memoizeOne from 'memoize-one';
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer'
import { Column, Table } from 'react-virtualized'
import 'react-virtualized/styles.css'

import { IProps } from './SpreadTable.types'
import { withErrorFallback } from '@core/hoc/withErrorFallback'
import { withTheme } from '@material-ui/styles'

import {
  getDataForTable,
  getDataFromTree,
  rowStyles,
} from '@core/utils/chartPageUtils'

import defaultRowRenderer from '../../utils'
import { BidsWrapper } from '../../OrderBookTableContainer.styles'

const getHeaderStyle = memoizeOne((theme): CSSProperties => ({
  color: '#7284A0',
  paddingLeft: '.5rem',
  marginLeft: 0,
  marginRight: 0,
  paddingTop: '.25rem',
  letterSpacing: '.075rem',
  borderBottom: theme.palette.border.main,
  fontSize: '1rem',
}))

const gridStyle = {
  // overflow: mode !== 'bids' ? 'hidden' : 'hidden auto',
  overflow: 'hidden',
}

const columnPriceHeaderStyle = { paddingLeft: 'calc(.5rem + 10px)' }

const columnSizeHeaderStyle = { textAlign: 'right', paddingRight: '.9rem' }

const columnTotalHeaderStyle = {
  paddingRight: 'calc(.5rem + 10px)',
  textAlign: 'right',
}
const getTotalStyles = memoizeOne((theme): CSSProperties => ({ textAlign: 'right', color: theme.palette.dark.main }))
const getSizeStyles = memoizeOne((theme): CSSProperties => ({
  textAlign: 'right',
  color: theme.palette.dark.main,
}))
const getPriceStyles = memoizeOne((theme): CSSProperties => ({ color: theme.palette.green.main }))
// @withTheme()
class SpreadTable extends PureComponent<IProps> {
  onRowClick = ({ event, index, rowData }) => {
		const { updateTerminalPriceFromOrderbook } = this.props;

    updateTerminalPriceFromOrderbook(+rowData.price);
	};

	// rowRenderer = (...rest) => {
	// 	const { amountForBackground, theme } = this.props;
	// 	return defaultRowRenderer({
	// 		...rest[0],
	// 		theme,
	// 		amountForBackground,
	// 		openOrderHistory: []
	// 	});
	// };

	// rowGetter = ({ index }) => {
	// 	const { data } = this.props;

	// 	return data[index];
	// };

  render() {
    const {
      theme,
      data,
      aggregation,
      openOrderHistory,
      mode,
      marketType,
      arrayOfMarketIds,
      updateTerminalPriceFromOrderbook,
      base,
      quote,
    } = this.props

    const tableData = getDataFromTree(data.bids, 'bids').reverse()
    const amountForBackground =
      tableData.reduce((acc, curr) => acc + +curr.size, 0) / tableData.length

    const headerStyle = getHeaderStyle(theme)  
    const totalStyles = getTotalStyles(theme)
    const sizeStyles = getSizeStyles(theme)
    const priceStyles = getPriceStyles(theme)

    return (
      <BidsWrapper mode={mode} isFullHeight={mode === 'bids'}>
        <AutoSizer>
          {({ width, height }: { width: number; height: number }) => (
            <Table
              disableHeader={mode !== 'bids'}
              width={width}
              height={height}
              headerHeight={window.outerHeight / 50}
              onRowClick={this.onRowClick}
              headerStyle={headerStyle}
              gridStyle={gridStyle}
              rowCount={tableData.length}
              rowHeight={window.outerHeight / 60}
              overscanRowCount={0}
              rowGetter={({ index }) => tableData[index]}
              rowRenderer={(...rest) =>
                defaultRowRenderer({
                  theme,
                  ...rest[0],
                  side: 'bids',
                  aggregation,
                  marketType,
                  arrayOfMarketIds,
                  amountForBackground,
                  openOrderHistory,
                })
              }
            >
              <Column
                label={mode === 'bids' ? `price` : ''}
                dataKey="price"
                headerStyle={columnPriceHeaderStyle}
                width={width - width / 6}
                style={priceStyles}
              />
              <Column
                label={mode === 'bids' ? `size (${base})` : ''}
                dataKey="size"
                width={width + width / 6}
                headerStyle={columnSizeHeaderStyle}
                style={sizeStyles}
              />
              <Column
                label={mode === 'bids' ? `total (${quote})` : ''}
                dataKey="total"
                headerStyle={columnTotalHeaderStyle}
                width={width}
                style={totalStyles}
              />
            </Table>
          )}
        </AutoSizer>
      </BidsWrapper>
    )
  }
}

export default withErrorFallback(SpreadTable)
