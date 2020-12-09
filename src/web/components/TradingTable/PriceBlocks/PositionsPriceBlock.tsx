import React from 'react';
import { compose } from 'recompose';

import { formatNumberToUSFormat, roundAndFormatNumber } from '@core/utils/PortfolioTableUtils';

import { queryRendererHoc } from '@core/components/QueryRenderer';
import { getMarkPrice } from '@core/graphql/queries/market/getMarkPrice';

export interface IProps {
  price: number;
  pricePrecision: number;
}

export interface IPropsDataWrapper {
  symbol: string;
  exchange: string;
  props: any[];
  getMarkPriceQuery: {
    getMarkPrice: {
      markPrice: number,
    }
  }
  pricePrecision: number
}

const PriceBlock = ({ pricePrecision, price }: IProps) => (
  <>
    <>
      {formatNumberToUSFormat(
        roundAndFormatNumber(price, pricePrecision, false)
      )}
    </>
  </>
)

const MemoizedMarkPriceBlock = React.memo(PriceBlock);

const MarkPriceDataWrapper = ({ getMarkPriceQuery, pricePrecision  }: IPropsDataWrapper) => {
  const { getMarkPrice = { markPrice: 0 } } = getMarkPriceQuery || {
    getMarkPrice: { markPrice: 0 }
  };
  const { markPrice = 0 } = getMarkPrice || { markPrice: 0 };

  return (
    <MemoizedMarkPriceBlock
      price={markPrice}
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
    fetchPolicy: 'cache-first',
    withOutSpinner: true,
    withTableLoader: false,
    withoutLoading: true
  })
)(MemoizedMarkPriceDataWrapper));
