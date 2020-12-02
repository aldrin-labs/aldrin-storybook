import React, { PureComponent } from 'react';
import { Column, Table } from 'react-virtualized';

const TradeHistoryTableTitle = ({ theme, width, ...rest }) => {

    const priceColor = { color: '' }
    const sizeTimeColor = { color: theme.palette.dark.main }
    const headerStyle = { paddingLeft: 'calc(.5rem + 10px)' }

    console.log('TradeHistoryTableTitle rest', rest)

	return (
		<>
			<Column
				label="Price"
				dataKey="price"
				width={width}
				style={priceColor}
                headerStyle={headerStyle}
			/>
			<Column label="Size" dataKey="size" width={width} style={sizeTimeColor} />
			<Column label="time" dataKey="time" width={width} style={sizeTimeColor} />
		</>
	);
};

export default React.memo(TradeHistoryTableTitle)
