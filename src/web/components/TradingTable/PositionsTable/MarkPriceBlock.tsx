import React from 'react';
import { compose } from 'recompose';
import { Theme } from '@material-ui/core';

import { formatNumberToUSFormat, roundAndFormatNumber } from '@core/utils/PortfolioTableUtils';

import { queryRendererHoc } from '@core/components/QueryRenderer';
import { getMarkPrice } from '@core/graphql/queries/market/getMarkPrice';
import { LISTEN_MARK_PRICE } from '@core/graphql/subscriptions/LISTEN_MARK_PRICE';
import {
  updateMarkPriceQuerryFunction,
} from '@sb/compositions/Chart/components/MarketStats/MarketStats.utils';
export interface IProps {
  marketType: 0 | 1;
  theme: Theme;
  markPrice: number;
  pricePrecision: number;
}

export interface IPropsDataWrapper {
  symbol: string;
  exchange: string;
  props: any[];
}

const MarkPriceBlock = ({ marketType, theme, markPrice, pricePrecision }: IProps) =>
  marketType === 1 && (
    <div>
      {formatNumberToUSFormat(roundAndFormatNumber(markPrice, pricePrecision, false))}
    </div>
  );

const MemoizedMarkPriceBlock = React.memo(MarkPriceBlock);

const MarkPriceDataWrapper = ({ symbol, exchange, ...props }: IPropsDataWrapper) => {
  React.useEffect(
    () => {
      const unsubscribePrice = props.getMarkPriceQuery.subscribeToMoreFunction();

      return () => {
        unsubscribePrice && unsubscribePrice();
      };
    },
    [symbol, exchange]
  );

  const { getMarkPriceQuery, marketType, theme, pricePrecision } = props;
  const { getMarkPrice = { markPrice: 0 } } = getMarkPriceQuery || {
    getMarkPrice: { markPrice: 0 }
  };
  const { markPrice = 0 } = getMarkPrice || { markPrice: 0 };

  return (
    <MemoizedMarkPriceBlock
      markPrice={markPrice}
      marketType={marketType}
      theme={theme}
      pricePrecision={pricePrecision}
    />
  );
};

const MemoizedMarkPriceDataWrapper = React.memo(MarkPriceDataWrapper)


export default React.memo(compose(
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
  })
)(MemoizedMarkPriceDataWrapper));
