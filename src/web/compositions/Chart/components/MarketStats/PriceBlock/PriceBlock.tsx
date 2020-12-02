import React from 'react'
import { compose } from 'recompose';
import { Theme } from '@material-ui/core';

import { DarkTooltip } from '@sb/components/TooltipCustom/Tooltip'
import { PanelCard, PanelCardTitle, PanelCardValue, PanelCardSubValue } from '../../../Chart.styles';
import PriceTitle from '../PriceTitle'

import { formatNumberToUSFormat, stripDigitPlaces, roundAndFormatNumber } from '@core/utils/PortfolioTableUtils';
import { getPrice } from '@core/graphql/queries/chart/getPrice';
import { LISTEN_PRICE } from '@core/graphql/subscriptions/LISTEN_PRICE';
import {
	updateFundingRateQuerryFunction,
	updateMarkPriceQuerryFunction,
	updatePriceQuerryFunction
} from '../MarketStats.utils';
import { queryRendererHoc } from '@core/components/QueryRenderer';


export interface IProps {
	marketType: 0 | 1;
	theme: Theme;
  pricePrecision: number;
  lastMarketPrice: number
}
export interface IPropsDataWrapper {
	symbol: string;
  exchange: string;
  marketType: 0 | 1;
  props: any[];
}

const PriceBlock = ({ marketType, theme, pricePrecision, lastMarketPrice }: IProps) => (
    <>
    {marketType === 1 && (
    <PanelCard marketType={marketType} theme={theme}>
		  <PanelCardValue
			  theme={theme}
			  style={{
			  	whiteSpace: 'nowrap',
				  fontSize: '2rem',
				  textAlign: 'center'
			  }}
		  >
			{formatNumberToUSFormat(roundAndFormatNumber(lastMarketPrice, pricePrecision, false))}
		  </PanelCardValue>
    </PanelCard>
    )}

    {marketType === 0 && (
      <PanelCard marketType={marketType} theme={theme}>
        <PriceTitle marketType={marketType} theme={theme} />
        <span style={{ display: 'flex', justifyContent: 'space-between' }}>
          <PanelCardValue theme={theme}>
            {formatNumberToUSFormat(
              roundAndFormatNumber(lastMarketPrice, pricePrecision, false)
            )}
          </PanelCardValue>
        </span>
      </PanelCard>
    )}
  </>
)

const MemoizedPriceBlock = React.memo(PriceBlock)

const PriceDataWrapper = ({ symbol, exchange, marketType, ...props }: IPropsDataWrapper) => {
	React.useEffect(
		() => {
			const unsubscribePrice = props.getPriceQuery.subscribeToMoreFunction()

			return () => {
				unsubscribePrice && unsubscribePrice();
			};
		},
		[ symbol, exchange, marketType ]
	);

  const { getPriceQuery, theme, pricePrecision } = props;
  const { getPrice: lastMarketPrice = 0 } = getPriceQuery || { getPrice: 0 };


	return (
		<MemoizedPriceBlock
			theme={theme}
      pricePrecision={pricePrecision}
      lastMarketPrice={lastMarketPrice}
      marketType={marketType}
		/>
	);
};

const MemoizedPriceDataWrapper = React.memo(PriceDataWrapper)

export default React.memo(compose(
	queryRendererHoc({
		query: getPrice,
		name: 'getPriceQuery',
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
		fetchPolicy: 'cache-and-network',
		withOutSpinner: true,
		withTableLoader: true,
		withoutLoading: true
	}),
)(MemoizedPriceDataWrapper));
