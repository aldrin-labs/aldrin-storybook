import React from 'react';
import { compose } from 'recompose';

import { queryRendererHoc } from '@core/components/QueryRenderer';
import { getPrice } from '@core/graphql/queries/chart/getPrice';
import { LISTEN_PRICE } from '@core/graphql/subscriptions/LISTEN_PRICE';
import { updatePriceQuerryFunction } from '@sb/compositions/Chart/components/MarketStats/MarketStats.utils';

import { IPropsDataWrapper, IPropsSpotDataWrapper } from './ActiveSmartTradePnl.types';
import { MemoizedPnlBlock } from './ActiveSmartTradePnlBlock';

// export type IPropsSpotDataWrapper = {

// }

const SpotPriceDataWrapper = ({ symbol, exchange, marketType, ...props }) => {
	React.useEffect(
		() => {
			const unsubscribePrice = props.getPriceQuery.subscribeToMoreFunction();

			return () => {
				unsubscribePrice && unsubscribePrice();
			};
		},
		[ symbol, exchange, marketType ]
	);

	const { getPriceQuery, theme, pricePrecision } = props;
	const { getPrice: lastMarketPrice = 0 } = getPriceQuery || { getPrice: 0 };

	return <MemoizedPnlBlock price={lastMarketPrice} {...props} />;
};

const MemoizedSpotPriceDataWrapper = React.memo(SpotPriceDataWrapper);

export const ActiveSmartTradePnlSpot = React.memo(
	compose(
		queryRendererHoc({
			query: getPrice,
            name: 'getPriceQuery',
            fetchPolicy: 'cache-first',
			variables: (props: any) => ({
				exchange: props.exchange.symbol,
				pair: `${props.symbol}:${props.marketType}`
			}),
			subscriptionArgs: {
				subscription: LISTEN_PRICE,
				variables: (props: any) => ({
					input: {
						exchange: props.exchange.symbol,
						pair: `${props.symbol}:${props.marketType}`
					}
				}),
				updateQueryFunction: updatePriceQuerryFunction
			},
			withOutSpinner: true,
			withTableLoader: true,
			withoutLoading: true
		})
	)(MemoizedSpotPriceDataWrapper)
);
