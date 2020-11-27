import React from 'react';
import { compose } from 'recompose';
import { Theme } from '@material-ui/core';
import { queryRendererHoc } from '@core/components/QueryRenderer/index';
import { getMarketStatisticsByPair } from '@core/graphql/queries/chart/getMarketStatisticsByPair';
import { getFundingRate } from '@core/graphql/queries/chart/getFundingRate';
import { getMarkPrice } from '@core/graphql/queries/market/getMarkPrice';
import { LISTEN_MARK_PRICE } from '@core/graphql/subscriptions/LISTEN_MARK_PRICE';
import { LISTEN_FUNDING_RATE } from '@core/graphql/subscriptions/LISTEN_FUNDING_RATE';
import { getPrice } from '@core/graphql/queries/chart/getPrice';
import { LISTEN_PRICE } from '@core/graphql/subscriptions/LISTEN_PRICE';

import { formatNumberToUSFormat, stripDigitPlaces, roundAndFormatNumber } from '@core/utils/PortfolioTableUtils';

import {
	updateFundingRateQuerryFunction,
	updateMarkPriceQuerryFunction,
	updatePriceQuerryFunction
} from './MarketStats.utils';

import { PanelCard, PanelCardTitle, PanelCardValue, PanelCardSubValue } from '../../Chart.styles';

import MarkPriceBlock from './MarkPriceBlock/MarkPriceBlock';
import PriceBlock from './PriceBlock/PriceBlock';
import PriceChange from './PriceChange/PriceChange'
import LowHighPrice from './LowHighPrice/LowHighPrice'
import VolumeBlock from './VolumeBlock/VolumeBlock'
import FundingRateBlock from './FundingRateBlock/FundingRateBlock';
export interface IProps {
	theme: Theme;
	symbol: string;
	marketType: 0 | 1;
	getMarketStatisticsByPairQuery: {
		getMarketStatisticsByPair: {
			exchange: string;
			symbol: string;
			lastPrice: string;
			volume: string;
			priceChange: string;
			priceChangePercent: string;
			highPrice: string;
			lowPrice: string;
		};
	};
	getFundingRateQuery: {
		getFundingRate: {
			exchange: string;
			symbol: string;
			fundingTime: number;
			fundingRate: number;
		};
		subscribeToMoreFunction: () => () => void;
	};
	getPriceQuery: {
		getPrice: number;
		subscribeToMoreFunction: () => () => void;
	};
	getFundingRateQueryRefetch: () => Promise<void>;
	getMarkPriceQuery: {
		getMarkPrice: {
			symbol: string;
			markPrice: number;
		};
		subscribeToMoreFunction: () => () => void;
	};
	quantityPrecision: number;
	pricePrecision: number;
}

class MarketStats extends React.PureComponent<IProps> {
	state: { key: number; refetching: boolean } = {
		key: 0,
		refetching: false
	};

	getMarkPriceQueryUnsubscribe: null | (() => void) = null;
	getPriceQueryUnsubscribe: null | (() => void) = null;
	getFundingRateQueryUnsubscribe: null | (() => void) = null;

	componentDidMount() {
		// subscribe
		this.getMarkPriceQueryUnsubscribe = this.props.getMarkPriceQuery.subscribeToMoreFunction();
		this.getPriceQueryUnsubscribe = this.props.getPriceQuery.subscribeToMoreFunction();
		this.getFundingRateQueryUnsubscribe = this.props.getFundingRateQuery.subscribeToMoreFunction();
	}

	componentDidUpdate(prevProps: IProps) {
		if (prevProps.symbol !== this.props.symbol || prevProps.marketType !== this.props.marketType) {
			//  unsubscribe from old params
			//  subscribe to new params and create new unsub link
			this.getMarkPriceQueryUnsubscribe && this.getMarkPriceQueryUnsubscribe();
			this.getMarkPriceQueryUnsubscribe = this.props.getMarkPriceQuery.subscribeToMoreFunction();

			this.getPriceQueryUnsubscribe && this.getPriceQueryUnsubscribe();
			this.getPriceQueryUnsubscribe = this.props.getPriceQuery.subscribeToMoreFunction();

			this.getFundingRateQueryUnsubscribe && this.getFundingRateQueryUnsubscribe();
			this.getFundingRateQueryUnsubscribe = this.props.getFundingRateQuery.subscribeToMoreFunction();
		}

		// for funding ime
		const {
			getFundingRate: { fundingTime: prevFundingTime = 0 } = {
				fundingTime: 0
			}
		} = prevProps.getFundingRateQuery || {
			fundingTime: 0
		};

		const {
			getFundingRate: { fundingTime: newFundingTime = 0 } = {
				fundingTime: 0
			}
		} = this.props.getFundingRateQuery || {
			fundingTime: 0
		};

		if (prevFundingTime === 0 && newFundingTime !== 0) {
			this.setState((prevState) => ({ key: prevState.key + 1 }));
		}
	}

	componentWillUnmount() {
		//  unsubscribe
		this.getMarkPriceQueryUnsubscribe && this.getMarkPriceQueryUnsubscribe();
		this.getPriceQueryUnsubscribe && this.getPriceQueryUnsubscribe();
		this.getFundingRateQueryUnsubscribe && this.getFundingRateQueryUnsubscribe();
	}

	render() {
		const {
			getMarketStatisticsByPairQuery,
			getFundingRateQuery,
			symbol = ' _ ',
			theme,
			marketType,
			getFundingRateQueryRefetch,
			getPriceQuery,
			getMarkPriceQuery,
			quantityPrecision,
			pricePrecision: pricePrecisionRaw
		} = this.props;

		const pricePrecision = pricePrecisionRaw === 0 || pricePrecisionRaw < 0 ? 8 : pricePrecisionRaw;

		const { getPrice: lastMarketPrice = 0 } = getPriceQuery || { getPrice: 0 };
		const { getMarkPrice = { markPrice: 0 } } = getMarkPriceQuery || {
			getMarkPrice: { markPrice: 0 }
		};
		const { markPrice = 0 } = getMarkPrice || { markPrice: 0 };

		const {
			getMarketStatisticsByPair: {
				volume = 0,
				priceChange = 0,
				priceChangePercent = 0,
				highPrice = 0,
				lowPrice = 0
			} = {
				volume: 0,
				priceChange: 0,
				priceChangePercent: 0,
				highPrice: 0,
				lowPrice: 0
			}
		} = getMarketStatisticsByPairQuery || {
			getMarketStatisticsByPair: {
				volume: 0,
				priceChange: 0,
				priceChangePercent: 0,
				highPrice: 0,
				lowPrice: 0
			}
		};

		// const stableCoinsRegexp = new RegExp(stableCoins.join('|'), 'g')
		// const isStableCoinInPair = stableCoinsRegexp.test(symbol)
		// const roundingPrecision = isStableCoinInPair ? 2 : 8

		const {
			getFundingRate: { fundingTime = 0, fundingRate = 0 } = {
				fundingTime: 0,
				fundingRate: 0
			}
		} = getFundingRateQuery || {
			getFundingRate: {
				fundingTime: 0,
				fundingRate: 0
			}
		};

		return (
			<div style={{ display: 'flex', width: '100%' }} key={this.state.key}>
				{marketType === 1 && (
					<MarkPriceBlock
						theme={theme}
						marketType={marketType}
						lastMarketPrice={lastMarketPrice}
						pricePrecision={pricePrecision}
					/>
				)}

				<PriceBlock
					theme={theme}
					marketType={marketType}
					pricePrecision={pricePrecision}
					lastMarketPrice={lastMarketPrice}
					markPrice={markPrice}
				/>

				<PriceChange
					marketType={marketType}
					theme={theme}
					priceChange={priceChange}
					priceChangePercent={priceChangePercent}
					pricePrecision={pricePrecision}
				/>

				<LowHighPrice
					marketType={marketType}
					theme={theme}
					highPrice={highPrice}
					lowPrice={lowPrice}
					pricePrecision={pricePrecision}
				/>

				<VolumeBlock marketType={marketType} theme={theme} volume={volume} symbol={symbol} />

				{marketType === 1 && (
					<FundingRateBlock
						marketType={marketType}
						theme={theme}
						fundingRate={fundingRate}
						fundingTime={fundingTime}
						getFundingRateQueryRefetch={getFundingRateQueryRefetch}
					/>
				)}
			</div>
		);
	}
}

const MarketStatsDataWrapper = compose(
	queryRendererHoc({
		query: getMarkPrice,
		name: 'getMarkPriceQuery',
		variables: (props) => ({
			input: {
				exchange: props.exchange.symbol,
				symbol: props.symbol
			}
		}),
		subscriptionArgs: {
			subscription: LISTEN_MARK_PRICE,
			variables: (props: any) => ({
				input: {
					exchange: props.exchange.symbol,
					symbol: props.symbol
				}
			}),
			updateQueryFunction: updateMarkPriceQuerryFunction
		},
		fetchPolicy: 'cache-and-network',
		withOutSpinner: true,
		withTableLoader: true,
		withoutLoading: true
	}),
	queryRendererHoc({
		query: getPrice,
		name: 'getPriceQuery',
		variables: (props) => ({
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
		fetchPolicy: 'cache-and-network',
		withOutSpinner: true,
		withTableLoader: true,
		withoutLoading: true
	}),
	queryRendererHoc({
		query: getMarketStatisticsByPair,
		name: 'getMarketStatisticsByPairQuery',
		variables: (props) => ({
			input: {
				exchange: props.exchange.symbol,
				symbol: props.symbol,
				marketType: props.marketType
			}
		}),
		fetchPolicy: 'cache-and-network',
		pollInterval: 30000,
		withOutSpinner: true,
		withTableLoader: true,
		withoutLoading: true
	}),
	queryRendererHoc({
		query: getFundingRate,
		name: 'getFundingRateQuery',
		variables: (props) => ({
			input: {
				exchange: props.exchange.symbol,
				symbol: props.symbol
			}
		}),
		subscriptionArgs: {
			subscription: LISTEN_FUNDING_RATE,
			variables: (props: any) => ({
				input: {
					exchange: props.exchange.symbol,
					symbol: props.symbol
				}
			}),
			updateQueryFunction: updateFundingRateQuerryFunction
		},
		fetchPolicy: 'cache-and-network',
		withOutSpinner: true,
		withTableLoader: true,
		withoutLoading: true
	})
)(MarketStats);

export default React.memo(MarketStatsDataWrapper);
