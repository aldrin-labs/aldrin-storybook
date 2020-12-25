import React from 'react';
import { compose } from 'recompose';

import { queryRendererHoc } from '@core/components/QueryRenderer';
import { getPrice } from '@core/graphql/queries/chart/getPrice';
import { LISTEN_PRICE } from '@core/graphql/subscriptions/LISTEN_PRICE';
import { updatePriceQuerryFunction } from '@sb/compositions/Chart/components/MarketStats/MarketStats.utils';

import { getMarkPrice } from '@core/graphql/queries/market/getMarkPrice';
import { LISTEN_MARK_PRICE } from '@core/graphql/subscriptions/LISTEN_MARK_PRICE';
import {
  updateMarkPriceQuerryFunction,
} from '@sb/compositions/Chart/components/MarketStats/MarketStats.utils';

import {
  EditEntryOrderPopup,
} from '@sb/compositions/Chart/components/SmartOrderTerminal/EditOrderPopups'

export const EditEntryPopupWithSpotPrice = React.memo(
	compose(
		queryRendererHoc({
			query: getPrice,
      name: 'getPriceQuery',
      fetchPolicy: 'cache-first',
			variables: (props: any) => ({
				exchange: props.exchange.symbol,
				pair: `${props.pair.join('_')}:${props.marketType}`
			}),
			subscriptionArgs: {
				subscription: LISTEN_PRICE,
				variables: (props: any) => ({
					input: {
						exchange: props.exchange.symbol,
						pair: `${props.pair.join('_')}:${props.marketType}`
					}
				}),
				updateQueryFunction: updatePriceQuerryFunction
			},
			withOutSpinner: true,
			withTableLoader: true,
			withoutLoading: true
		})
	)(EditEntryOrderPopup)
);

export const EditEntryPopupWithFuturesPrice = React.memo(compose(
  queryRendererHoc({
    query: getMarkPrice,
    name: 'getMarkPriceQuery',
    fetchPolicy: 'cache-first',
    variables: (props) => ({
      input: {
        exchange: props.exchange.symbol,
        symbol: props.pair.join('_')
      }
    }),
    subscriptionArgs: {
      subscription: LISTEN_MARK_PRICE,
      variables: (props: any) => ({
        input: {
          exchange: props.exchange.symbol,
          symbol: props.pair.join('_')
        }
      }),
      updateQueryFunction: updateMarkPriceQuerryFunction
    },
    withOutSpinner: true,
    withTableLoader: true,
    withoutLoading: true
  })
)(EditEntryOrderPopup));