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

import { SubColumnValue } from '../ActiveTrades/Columns'

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

const MarkPriceBlock = ({ marketType, theme, markPrice, pricePrecision, pair, entryPrice, leverage, side, positionAmt }: IProps) => {
  // <div>
  //   {formatNumberToUSFormat(roundAndFormatNumber(markPrice, pricePrecision, false))}
  // </div>
  const profitPercentage =
    ((markPrice / entryPrice) * 100 - 100) *
    leverage *
    (side === 'buy long' ? 1 : -1)

  const profitAmount =
    (positionAmt / leverage) *
    entryPrice *
    (profitPercentage / 100) *
    (side === 'buy long' ? 1 : -1)

  return markPrice ? (
    <SubColumnValue
      theme={theme}
      style={{ whiteSpace: 'nowrap' }}
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

  const { getMarkPriceQuery, marketType, theme, pricePrecision, pair, entryPrice, leverage, side, positionAmt } = props;
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
    fetchPolicy: 'cache-and-network',
    withOutSpinner: true,
    withTableLoader: true,
    withoutLoading: true
  })
)(MemoizedMarkPriceDataWrapper));
