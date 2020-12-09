import React from 'react';
import { compose } from 'recompose';

import { Theme } from '@material-ui/core';
import { AdlIndicator } from '../TradingTable.styles';
import { queryRendererHoc } from '@core/components/QueryRenderer';
import { getAdlQuantile } from '@core/graphql/queries/chart/getAdlQuantile';

const adlContainerStyles = { display: 'flex', height: '2rem' };

export type ADLQuantileType = {
	BOTH: number;
	HEDGE: number;
	LONG: number;
	SHORT: number;
};

export type GetAdlQuantileQueryType = {
	getAdlQuantile: {
		status: string;
		binanceMessage: string;
		data: { symbol: string; adlQuantile: ADLQuantileType }[];
	};
};

const getAdlData = (side: string, symbolRaw: string, getAdlQuantileQuery: GetAdlQuantileQueryType): number => {
	const symbol = symbolRaw.replace('_', '');

	if (
		getAdlQuantileQuery &&
		getAdlQuantileQuery.getAdlQuantile &&
		getAdlQuantileQuery.getAdlQuantile.data &&
		getAdlQuantileQuery.getAdlQuantile.data.length
	) {
		const currentAdlData = getAdlQuantileQuery.getAdlQuantile.data.find((adl) => symbol === adl.symbol);
		let adl = 0;

		if (currentAdlData && currentAdlData.adlQuantile) {
			adl =
				side === 'buy long'
					? currentAdlData.adlQuantile.LONG ||
						currentAdlData.adlQuantile.HEDGE ||
						currentAdlData.adlQuantile.BOTH
					: currentAdlData.adlQuantile.SHORT ||
						currentAdlData.adlQuantile.HEDGE ||
						currentAdlData.adlQuantile.BOTH;

			return adl;
		}
	}

	return 0;
};

export interface IProps {
	theme: Theme;
	symbol: string;
	side: 'buy long' | 'sell short';
	getAdlQuantileQuery: GetAdlQuantileQueryType;
}

const AdlComponent = ({ theme, symbol, side, getAdlQuantileQuery }: IProps) => {
	const adl = getAdlData(side, symbol, getAdlQuantileQuery);

	return (
		<div style={adlContainerStyles}>
			<AdlIndicator color={theme.palette.green.main} adl={adl} i={0} />
			<AdlIndicator color={'#A2AC29'} adl={adl} i={1} />
			<AdlIndicator color={'#F3BA2F'} adl={adl} i={2} />
			<AdlIndicator color={'#F38D2F'} adl={adl} i={3} />
			<AdlIndicator color={theme.palette.red.main} adl={adl} i={4} />
		</div>
	);
};

const MemoizedAdlComponent = React.memo(AdlComponent);

const AdlComponentDataWrapper = compose(
	queryRendererHoc({
		query: getAdlQuantile,
		name: 'getAdlQuantileQuery',
		fetchPolicy: 'cache-and-network',
		pollInterval: 60 * 1000,
		withoutLoading: true,
		variables: (props) => ({
			keyId: props.keyId
		})
	})
)(MemoizedAdlComponent);

const MemoizedAdlComponentDataWrapper = React.memo(AdlComponentDataWrapper);

export default MemoizedAdlComponentDataWrapper;
