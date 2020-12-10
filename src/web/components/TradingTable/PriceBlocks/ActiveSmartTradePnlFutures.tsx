import React from 'react';
import { compose } from 'recompose';

import { queryRendererHoc } from '@core/components/QueryRenderer';
import { getMarkPrice } from '@core/graphql/queries/market/getMarkPrice';
import { LISTEN_MARK_PRICE } from '@core/graphql/subscriptions/LISTEN_MARK_PRICE';
import {
  updateMarkPriceQuerryFunction,
} from '@sb/compositions/Chart/components/MarketStats/MarketStats.utils';
import { IPropsDataWrapper  } from './ActiveSmartTradePnl.types'
import { MemoizedPnlBlock } from './ActiveSmartTradePnlBlock'

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

  const { getMarkPriceQuery, theme, pair, entryPrice, leverage, side, positionAmt } = props;
  const { getMarkPrice = { markPrice: 0 } } = getMarkPriceQuery || {
    getMarkPrice: { markPrice: 0 }
  };
  const { markPrice = 0 } = getMarkPrice || { markPrice: 0 };

  return (
    <MemoizedPnlBlock
      price={markPrice}
      theme={theme}
      pair={pair}
      entryPrice={entryPrice}
      leverage={leverage}
      side={side}
      positionAmt={positionAmt}
      {...props}
    />
  );
};

const MemoizedMarkPriceDataWrapper = React.memo(MarkPriceDataWrapper)

export const ActiveSmartTradePnlFutures = React.memo(compose(
  queryRendererHoc({
    query: getMarkPrice,
    name: 'getMarkPriceQuery',
    fetchPolicy: 'cache-first',
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
    withOutSpinner: true,
    withTableLoader: true,
    withoutLoading: true
  })
)(MemoizedMarkPriceDataWrapper));