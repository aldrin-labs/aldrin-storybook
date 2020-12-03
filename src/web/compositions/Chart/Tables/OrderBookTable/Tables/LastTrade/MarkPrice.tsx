import React from 'react';
import { compose } from 'recompose';
import { Theme } from '@material-ui/core';

import { queryRendererHoc } from '@core/components/QueryRenderer';
import { getMarkPrice } from '@core/graphql/queries/market/getMarkPrice';
import { getNumberOfDecimalsFromNumber } from '@core/utils/chartPageUtils';

import { LastTradeContainer, LastTradeValue, LastTradePrice } from './LastTrade.styles';
const MemoizedLastTradePrice = React.memo(LastTradePrice)

const lastTradePriceStyles = { fontSize: '1.2rem' }

export interface IProps {
	theme: Theme;
	markPrice: number;
	aggregation: any;
	getMarkPriceQuery: {
		getMarkPrice: {
			markPrice: number;
		};
	};
}

const MarkPriceBlockOrderBook = ({ theme, aggregation, getMarkPriceQuery }: IProps) => {
	const { getMarkPrice = { markPrice: 0 } } = getMarkPriceQuery || {
		getMarkPrice: { markPrice: 0 }
	};
	const { markPrice = 0 } = getMarkPrice || { markPrice: 0 };

	return (
		<MemoizedLastTradePrice theme={theme} style={lastTradePriceStyles}>
			{Number(markPrice).toFixed(getNumberOfDecimalsFromNumber(aggregation))}
		</MemoizedLastTradePrice>
	);
};

const MemoizedMarkPriceBlock = React.memo(MarkPriceBlockOrderBook);

export default React.memo(
	compose(
		queryRendererHoc({
			query: getMarkPrice,
			name: 'getMarkPriceQuery',
			fetchPolicy: 'cache-only',
			withOutSpinner: true,
			withTableLoader: true,
			withoutLoading: true,
			variables: (props) => ({
				input: {
					exchange: props.exchange,
					symbol: props.symbol
				}
			})
		})
	)(MemoizedMarkPriceBlock)
);
