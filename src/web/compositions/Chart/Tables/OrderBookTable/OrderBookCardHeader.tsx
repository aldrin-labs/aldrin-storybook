import React, { Component, ChangeEvent } from 'react'

import ChartCardHeader from '@sb/components/ChartCardHeader'
import OrderBookModesContainer from './OrderBookModesContainer'

const OrderBookCardHeader = ({ theme, mode, setOrderbookMode }) => (
	<ChartCardHeader
		theme={theme}
		style={{
			display: 'flex',
			justifyContent: 'space-between',
			alignItems: 'center'
		}}
	>
		<span style={{ width: '40%', whiteSpace: 'pre-line', textAlign: 'left' }}>Order book</span>
		<OrderBookModesContainer mode={mode} setOrderbookMode={setOrderbookMode} />
	</ChartCardHeader>
);

export default React.memo(OrderBookCardHeader)