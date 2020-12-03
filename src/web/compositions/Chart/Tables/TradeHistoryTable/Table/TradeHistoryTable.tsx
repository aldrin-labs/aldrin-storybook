import React, { PureComponent, useMemo } from 'react';
import styled from 'styled-components';
import { withTheme } from '@material-ui/styles';
import { IProps, IState } from './TradeHistoryTable.types';

import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer';
import { Column, Table } from 'react-virtualized';
import 'react-virtualized/styles.css';

// import { rowStyles } from '@core/utils/chartPageUtils'

import defaultRowRenderer from '../../OrderBookTable/utils';
import TradeHistoryTableTitle from './TradeHistoryTableTitle';

const Wrapper = styled.div`
	height: calc(100% - 3rem);
	& .ReactVirtualized__Grid {
		overflow: hidden !important;
	}
`;

const priceColor = { color: '' };
const headerStyle = { paddingLeft: 'calc(.5rem + 10px)' };
const getSizeTimeColor = (theme) => ({ color: theme.palette.dark.main });
const getHeaderStyles = (theme) => ({
	color: theme.palette.grey.text,
	paddingLeft: '.5rem',
	marginLeft: 0,
	marginRight: 0,
	paddingTop: '.25rem',
	letterSpacing: '.075rem',
	borderBottom: theme.palette.border.main,
	fontSize: '1rem'
});
const gridStyles = {
	overflow: 'hidden'
};

const MemoizedWrapper = React.memo(Wrapper);

@withTheme()
class TradeHistoryTable extends PureComponent<IProps, IState> {
	onRowClick = ({ event, index, rowData }) => {
		const { updateTerminalPriceFromOrderbook } = this.props;

		updateTerminalPriceFromOrderbook(+rowData.price);
	};

	rowRenderer = (...rest) => {
		const { amountForBackground, theme } = this.props;
		return defaultRowRenderer({
			...rest[0],
			theme,
			amountForBackground,
			openOrderHistory: []
		});
	};

	rowGetter = ({ index }) => {
		const { data } = this.props;

		return data[index];
	};

	render() {
		const { data, theme } = this.props;

		const sizeTimeColor = getSizeTimeColor(theme);
		const headerStyles = getHeaderStyles(theme);

		return (
			<MemoizedWrapper>
				<AutoSizer>
					{({ width, height }: { width: number; height: number }) => (
						<Table
							headerHeight={window.outerHeight / 50}
							headerStyle={headerStyles}
							gridStyle={gridStyles}
							width={width}
							height={height}
							rowCount={data.length}
							overscanRowCount={0}
							rowHeight={window.outerHeight / 60}
							rowGetter={this.rowGetter}
							onRowClick={this.onRowClick}
							rowRenderer={this.rowRenderer}
						>
							<Column
								label="Price"
								dataKey="price"
								width={width}
								style={priceColor}
								headerStyle={headerStyle}
							/>
							<Column label="Size" dataKey="size" width={width} style={sizeTimeColor} />
							<Column label="time" dataKey="time" width={width} style={sizeTimeColor} />
						</Table>
					)}
				</AutoSizer>
			</MemoizedWrapper>
		);
	}
}

export default TradeHistoryTable;
