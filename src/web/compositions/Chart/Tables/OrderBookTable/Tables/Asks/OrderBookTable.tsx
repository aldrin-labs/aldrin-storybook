import React, { Component, PureComponent, CSSProperties } from 'react';
import { withTheme } from '@material-ui/styles';

import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer';
import { Column, Table } from 'react-virtualized';
import 'react-virtualized/styles.css';

import { withErrorFallback } from '@core/hoc/withErrorFallback';
import { IProps } from './OrderBookTable.types';

import { getDataFromTree } from '@core/utils/chartPageUtils';

import defaultRowRenderer from '../../utils';
import { AsksWrapper } from '../../OrderBookTableContainer.styles';

const getHeaderStyle = (theme) => ({
  color: theme.palette.grey.text,
  paddingLeft: '.5rem',
  paddingTop: '.25rem',
  marginLeft: 0,
  marginRight: 0,
  letterSpacing: '.075rem',
  borderBottom: theme.palette.border.main,
  fontSize: '1rem'
})

const gridStyle = {
	// overflow: mode !== 'asks' ? 'hidden' : 'hidden auto',
	overflow: 'hidden'
};

const columnPriceHeaderStyle = { paddingLeft: 'calc(.5rem + 10px)' };

const columnSizeHeaderStyle = { textAlign: 'right', paddingRight: '.9rem' };

const columnTotalHeaderStyle = {
	paddingRight: 'calc(.5rem + 10px)',
	textAlign: 'right'
};
const getTotalStyles = (theme): CSSProperties => ({ textAlign: 'right', color: theme.palette.dark.main });
const getSizeStyles = (theme): CSSProperties => ({
	textAlign: 'right',
	color: theme.palette.dark.main
});
const getPriceStyles = (theme): CSSProperties => ({ color: theme.palette.red.main });

@withTheme()
class OrderBookTable extends PureComponent<IProps> {
	render() {
		const {
			data,
			theme,
			mode,
			aggregation,
			openOrderHistory,
			marketType,
			arrayOfMarketIds,
			updateTerminalPriceFromOrderbook,
			base,
			quote
		} = this.props;
		const tableData = getDataFromTree(data.asks, 'asks').reverse();
		const amountForBackground = tableData.reduce((acc, curr) => acc + +curr.size, 0) / tableData.length;

		// Add memo
		const headerStyle = getHeaderStyle(theme);
		const totalStyles = getTotalStyles(theme);
		const sizeStyles = getSizeStyles(theme);
		const priceStyles = getPriceStyles(theme);

		return (
			<AsksWrapper mode={mode} isFullHeight={mode === 'asks'}>
				<AutoSizer>
					{({ width, height }: { width: number; height: number }) => (
						<Table
							width={width}
							height={height}
							rowCount={tableData.length}
							onRowClick={({ event, index, rowData }) => {
								updateTerminalPriceFromOrderbook(+rowData.price);
							}}
							headerHeight={window.outerHeight / 50}
							headerStyle={headerStyle}
							gridStyle={gridStyle}
							rowHeight={window.outerHeight / 60}
							overscanRowCount={0}
							scrollToIndex={tableData.length - 1}
							rowGetter={({ index }) => tableData[index]}
							rowRenderer={(...rest) =>
								defaultRowRenderer({
									theme,
									...rest[0],
									side: 'asks',
									marketType,
									aggregation,
									arrayOfMarketIds,
									openOrderHistory,
									amountForBackground
								})}
						>
							<Column
								label="Price"
								dataKey="price"
								headerStyle={columnPriceHeaderStyle}
								width={width - width / 6}
								style={priceStyles}
							/>
							<Column
								label={`Size (${base})`}
								dataKey="size"
								headerStyle={columnSizeHeaderStyle}
								width={width + width / 6}
								style={sizeStyles}
							/>
							<Column
								label={`Total (${quote})`}
								dataKey="total"
								headerStyle={columnTotalHeaderStyle}
								width={width}
								style={totalStyles}
							/>
						</Table>
					)}
				</AutoSizer>
			</AsksWrapper>
		);
	}
}

export default withErrorFallback(OrderBookTable);
