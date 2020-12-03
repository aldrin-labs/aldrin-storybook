import React from 'react';
import dayjs from 'dayjs';
import { compose } from 'recompose';
import { Theme } from '@material-ui/core';

import { queryRendererHoc } from '@core/components/QueryRenderer/index';
import { getMarketStatisticsByPair } from '@core/graphql/queries/chart/getMarketStatisticsByPair';
import { getFundingRate } from '@core/graphql/queries/chart/getFundingRate';
import { LISTEN_FUNDING_RATE } from '@core/graphql/subscriptions/LISTEN_FUNDING_RATE';
import {
	updateFundingRateQuerryFunction,
} from './MarketStats.utils';

import MarkPriceBlock from './MarkPriceBlock/MarkPriceBlock';
import PriceBlock from './PriceBlock/PriceBlock';
import PriceChange from './PriceChange/PriceChange';
import LowHighPrice from './LowHighPrice/LowHighPrice';
import VolumeBlock from './VolumeBlock/VolumeBlock';
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
	exchange: {
		symbol: string
	}
}

class MarketStats extends React.PureComponent<IProps> {
	state: { key: number, refetching: boolean } = {
		key: 0,
		refetching: false,
	};
	// getFundingRateQueryUnsubscribe: null | (() => void) = null;
	componentDidMount() {
		// subscribe
		// this.getFundingRateQueryUnsubscribe = this.props.getFundingRateQuery.subscribeToMoreFunction();
	}

	componentDidUpdate(prevProps: IProps) {
		if (prevProps.symbol !== this.props.symbol || prevProps.marketType !== this.props.marketType) {
			// this.getFundingRateQueryUnsubscribe && this.getFundingRateQueryUnsubscribe();
			// this.getFundingRateQueryUnsubscribe = this.props.getFundingRateQuery.subscribeToMoreFunction();
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
		// this.getFundingRateQueryUnsubscribe && this.getFundingRateQueryUnsubscribe();
	}

	setKey(key: number) {
		this.setState({ key })
	}

	setRefetching(refetching: boolean) {
		this.setState({ refetching })
	}

	render() {
		const {
			getMarketStatisticsByPairQuery,
			getFundingRateQuery,
			symbol = ' _ ',
			theme,
			marketType,
			getFundingRateQueryRefetch,
			pricePrecision: pricePrecisionRaw,
			exchange,
		} = this.props;

		const { refetching, key } = this.state
		const pricePrecision = pricePrecisionRaw === 0 || pricePrecisionRaw < 0 ? 8 : pricePrecisionRaw;

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

		if ((fundingTime == 0 || +dayjs(fundingTime) - Date.now() < 0) && !refetching) {
			this.setRefetching(true)
	
			setTimeout(() => {
				getFundingRateQueryRefetch();
				this.setKey(key + 1)
				this.setRefetching(false)
			}, 3000);
		}

		return (
			<div style={{ display: 'flex', width: '100%' }} key={this.state.key}>
				<PriceBlock
					symbol={symbol}
					exchange={exchange}
					marketType={marketType}
					pricePrecision={pricePrecision}
					theme={theme}
				/>

				<MarkPriceBlock
					marketType={marketType}
					pricePrecision={pricePrecision}
					symbol={symbol}
					exchange={exchange}
					theme={theme}
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
						key={key}
						marketType={marketType}
						theme={theme}
						fundingRate={fundingRate}
						fundingTime={fundingTime}
						getFundingRateQueryRefetch={getFundingRateQueryRefetch}
						setKey={this.setKey.bind(this)}
						setRefetching={this.setRefetching}
						refetching={refetching}

					/>
				)}
			</div>
		);
	}
}

const MarketStatsDataWrapper = compose(
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
