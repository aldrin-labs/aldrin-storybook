import React from 'react';
import { compose } from 'recompose';
import { Theme } from '@material-ui/core';

import { queryRendererHoc } from '@core/components/QueryRenderer';
import { getPrice } from '@core/graphql/queries/chart/getPrice'
import { getNumberOfDecimalsFromNumber } from '@core/utils/chartPageUtils';

import { LastTradeContainer, LastTradeValue, LastTradePrice } from './LastTrade.styles';
const MemoizedLastTradePrice = React.memo(LastTradePrice)
const lastTradePriceStyles = { fontSize: '1.2rem' }


export interface IProps {
	theme: Theme;
	markPrice: number;
	aggregation: any;
	getPriceQuery: {
		getPrice: number;
	};
}

const PriceBlockOrderBook = ({ theme, aggregation, getPriceQuery }: IProps) => {
	const { getPrice: lastMarketPrice = 0 } = getPriceQuery || { getPrice: 0 };

	return (
		<MemoizedLastTradePrice theme={theme} style={lastTradePriceStyles}>
			{Number(lastMarketPrice).toFixed(getNumberOfDecimalsFromNumber(aggregation))}
		</MemoizedLastTradePrice>
	);
};

const MemoizedPriceBlock = React.memo(PriceBlockOrderBook);

export default React.memo(
	compose(
		queryRendererHoc({
			query: getPrice,
			name: 'getPriceQuery',
			fetchPolicy: 'cache-only',
			withOutSpinner: true,
			withTableLoader: false,
			withoutLoading: true,
			variables: (props) => ({
				exchange: props.exchange,
				pair: `${props.symbol}:${props.marketType}`
			})
		})
	)(MemoizedPriceBlock)
);
