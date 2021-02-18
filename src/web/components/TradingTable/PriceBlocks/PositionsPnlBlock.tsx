import React from 'react'
import { compose } from 'recompose'
import { Theme } from '@material-ui/core'

import { getPrice } from '@core/graphql/queries/chart/getPrice'
import { queryRendererHoc } from '@core/components/QueryRenderer'
import { LISTEN_PRICE } from '@core/graphql/subscriptions/LISTEN_PRICE'
import { updatePriceQuerryFunction } from '@sb/compositions/Chart/components/MarketStats/MarketStats.utils'

import { SubColumnValue } from '../ActiveTrades/Columns'

const subColumnStyle = { whiteSpace: 'nowrap' }
export interface IProps {
  theme: Theme
  price: number
  pair: [string, string]
  entryPrice: number
  leverage: number
  side: 'buy long' | 'sell short'
  positionAmt: number
}

export interface IPropsDataWrapper {
  symbol: string
  exchange: string
  getPriceQuery: {
    getPrice: {
      lastMarketPrice: number
    }
    subscribeToMoreFunction: () => () => void
  }
  pricePrecision: number
  theme: Theme
  pair: [string, string]
  entryPrice: number
  leverage: number
  side: 'buy long' | 'sell short'
  positionAmt: number
}

const PnlBlock = ({
  theme,
  price,
  pair,
  entryPrice,
  leverage,
  side,
  positionAmt,
}: IProps) => {
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
      whiteSpace={'normal'}
      width={'100%'}
      theme={theme}
      // style={subColumnStyle}
      color={
        profitPercentage > 0 ? theme.palette.green.main : theme.palette.red.main
      }
    >
      <span style={{ whiteSpace: 'nowrap' }}>
        {`${profitAmount < 0 ? '-' : ''}${Math.abs(
          Number(profitAmount.toFixed(3))
        )} ${pair[1]}`}{' '}
        /
      </span>{' '}
      {`${profitPercentage < 0 ? '-' : ''}${Math.abs(
        Number(profitPercentage.toFixed(2))
      )}%`}
    </SubColumnValue>
  ) : (
    `0 ${pair[1]} / 0%`
  )
}
const MemoizedPnlBlock = React.memo(PnlBlock)

const PriceDataWrapper = ({
  symbol,
  exchange,
  getPriceQuery,
  theme,
  pair,
  entryPrice,
  leverage,
  side,
  positionAmt,
}: IPropsDataWrapper) => {
  // React.useEffect(
  //   () => {
  //     const unsubscribePrice = getPriceQuery.subscribeToMoreFunction();

  //     return () => {
  //       unsubscribePrice && unsubscribePrice();
  //     };
  //   },
  //   [symbol, exchange]
  // );

  const { getPrice: lastMarketPrice = 0 } = getPriceQuery || {
    getPrice: lastMarketPrice = 0,
  }

  return (
    <MemoizedPnlBlock
      price={lastMarketPrice}
      theme={theme}
      pair={pair}
      entryPrice={entryPrice}
      leverage={leverage}
      side={side}
      positionAmt={positionAmt}
    />
  )
}

const MemoizedPriceDataWrapper = React.memo(PriceDataWrapper)

export default React.memo(
  compose(
    queryRendererHoc({
      query: getPrice,
      name: 'getPriceQuery',
      fetchPolicy: 'cache-first',
      variables: (props: any) => ({
        exchange: props.exchange.symbol,
        pair: `${props.symbol}:${props.marketType}`,
      }),
      withOutSpinner: true,
      withTableLoader: true,
      withoutLoading: true,
    })
  )(MemoizedPriceDataWrapper)
)
