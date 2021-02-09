import React from 'react';
import { compose } from 'recompose';

import { formatNumberToUSFormat, roundAndFormatNumber } from '@core/utils/PortfolioTableUtils';

import { queryRendererHoc } from '@core/components/QueryRenderer';
import { getPrice } from '@core/graphql/queries/chart/getPrice'
import { LISTEN_PRICE } from '@core/graphql/subscriptions/LISTEN_PRICE'
import { updatePriceQuerryFunction } from '@sb/compositions/Chart/components/MarketStats/MarketStats.utils'

export interface IProps {
  price: number;
  pricePrecision: number;
}

export interface IPropsDataWrapper {
  symbol: string;
  exchange: string;
  props: any[];
  getPriceQuery: {
    getPrice: number | string
  }
  pricePrecision: number
}

const PriceBlock = ({ pricePrecision, price }: IProps) => (
  <>
    <>
      {price === 0 ? '--' : formatNumberToUSFormat(
        roundAndFormatNumber(price, pricePrecision, false)
      )}
    </>
  </>
)

const MemoizedMarkPriceBlock = React.memo(PriceBlock);

const MarkPriceDataWrapper = ({ getPriceQuery, pricePrecision  }: IPropsDataWrapper) => {
  const { getPrice: price = 0 } = getPriceQuery || {
    getPrice: price = 0
  };

  console.log('getPrice', getPriceQuery)

  return (
    <MemoizedMarkPriceBlock
      price={price}
      pricePrecision={pricePrecision}
    />
  );
};

const MemoizedMarkPriceDataWrapper = React.memo(MarkPriceDataWrapper)


export default React.memo(compose(
  queryRendererHoc({
    query: getPrice,
    name: 'getPriceQuery',
    variables: (props) => ({
      exchange: props.exchange.symbol,
      pair: `${props.symbol}:${props.marketType}`,
    }),
    fetchPolicy: 'cache-first',
    withOutSpinner: true,
    withTableLoader: false,
    withoutLoading: true
  })
)(MemoizedMarkPriceDataWrapper));
