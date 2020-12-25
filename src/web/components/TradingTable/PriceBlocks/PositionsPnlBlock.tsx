import React from 'react';
import { compose } from 'recompose';
import { Theme } from '@material-ui/core';

import { queryRendererHoc } from '@core/components/QueryRenderer';
import { getMarkPrice } from '@core/graphql/queries/market/getMarkPrice';
import { LISTEN_MARK_PRICE } from '@core/graphql/subscriptions/LISTEN_MARK_PRICE';
import {
  updateMarkPriceQuerryFunction,
} from '@sb/compositions/Chart/components/MarketStats/MarketStats.utils';

import { SubColumnValue } from '../ActiveTrades/Columns'

const subColumnStyle = { whiteSpace: 'nowrap' }
export interface IProps {
  theme: Theme;
  price: number;
  pair: [string, string]
  entryPrice: number
  leverage: number
  side: 'buy long' | 'sell short'
  positionAmt: number
}

export interface IPropsDataWrapper {
  symbol: string;
  exchange: string;
  getMarkPriceQuery: {
    getMarkPrice: {
      markPrice: number,
    }
    subscribeToMoreFunction: () => () => void
  }
  pricePrecision: number
  theme: Theme;
  pair: [string, string]
  entryPrice: number
  leverage: number
  side: 'buy long' | 'sell short'
  positionAmt: number
}

const MarkPnlBlock = ({ theme, price, pair, entryPrice, leverage, side, positionAmt }: IProps) => {
  const profitPercentage =
    ((price / entryPrice) * 100 - 100) *
    leverage *
    (side === 'buy long' ? 1 : -1)

  const profitAmount =
    (positionAmt / leverage) *
    entryPrice *
    (profitPercentage / 100) *
    (side === 'buy long' ? 1 : -1)

  return price ? (
    <SubColumnValue
      theme={theme}
      style={subColumnStyle}
      color={profitPercentage > 0 ? theme.palette.green.main : theme.palette.red.main}
    >
      {`${profitAmount < 0 ? '-' : ''}${Math.abs(
        Number(profitAmount.toFixed(3))
      )} ${pair[1]} / ${profitPercentage < 0 ? '-' : ''}${Math.abs(
        Number(profitPercentage.toFixed(2))
      )}%`}
    </SubColumnValue>
  ) : (
      `0 ${pair[1]} / 0%`
    );
}
const MemoizedMarkPriceBlock = React.memo(MarkPnlBlock);

const MarkPriceDataWrapper = ({ symbol, exchange, getMarkPriceQuery, theme, pricePrecision, pair, entryPrice, leverage, side, positionAmt }: IPropsDataWrapper) => {
  React.useEffect(
    () => {
      const unsubscribePrice = getMarkPriceQuery.subscribeToMoreFunction();

      return () => {
        unsubscribePrice && unsubscribePrice();
      };
    },
    [symbol, exchange]
  );

  const { getMarkPrice = { markPrice: 0 } } = getMarkPriceQuery || {
    getMarkPrice: { markPrice: 0 }
  };
  const { markPrice = 0 } = getMarkPrice || { markPrice: 0 };

  return (
    <MemoizedMarkPriceBlock
      price={markPrice}
      theme={theme}
      pair={pair}
      entryPrice={entryPrice}
      leverage={leverage}
      side={side}
      positionAmt={positionAmt}
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
    fetchPolicy: 'cache-first',
    withOutSpinner: true,
    withTableLoader: false,
    withoutLoading: true
  }),
)(MemoizedMarkPriceDataWrapper));
