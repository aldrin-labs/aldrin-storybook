import React from 'react'
import { Theme } from '@material-ui/core';

import {
  LastTradeContainer,
  LastTradeValue,
  LastTradePrice,
  ArrowIcon,
} from './LastTrade.styles'

import { OrderbookMode } from '../../OrderBookTableContainer.types'

import {
  getAggregationsFromMinPriceDigits,
} from '@core/utils/chartPageUtils'


import MarkPrice from './MarkPrice'
import Price from './Price'

interface IProps {
  data: { marketTickers: [string] }
  theme: Theme
  exchange: string
  symbol: string
  group: number
  mode: OrderbookMode
  marketType: 0 | 1
  minPriceDigits: number
  getPriceQuery: {
    getPrice: number
    subscribeToMoreFunction: () => () => void
  }
  getFundingRateQueryRefetch: () => void
  getMarkPriceQuery: {
    getMarkPrice: {
      symbol: string
      markPrice: number
    }
    subscribeToMoreFunction: () => () => void
  }
  updateTerminalPriceFromOrderbook: (price: number | string) => void
}

const lastTradeStylesContainer = {
  width: '100%',
  display: 'flex',
  justifyContent: 'flex-start',
  alignItems: 'flex-end',
}


const LastTrade = (props: IProps) => {
  const {
    updateTerminalPriceFromOrderbook,
    marketType,
    exchange,
    symbol,
    theme,
  } = props

  console.log('LastTrade exchange', exchange)


  const aggregation = getAggregationsFromMinPriceDigits(props.minPriceDigits)[0]
    .value

  return (
    <LastTradeContainer
      theme={theme}
      // TODO: I'm not sure that these arrow function should exists here
      // onClick={() =>
      //   updateTerminalPriceFromOrderbook(
      //     Number(markPrice).toFixed(getNumberOfDecimalsFromNumber(aggregation))
      //   )
      // }
    >
      <div
        style={lastTradeStylesContainer}
      >
          {/* <ArrowIcon fall={fall} /> */}
          <Price theme={theme} symbol={symbol} exchange={exchange} aggregation={aggregation} marketType={marketType} />
        {marketType === 1 && (
          <MarkPrice theme={theme} symbol={symbol} exchange={exchange} aggregation={aggregation} />
        )}
      </div>
    </LastTradeContainer>
  )
}

const MemoizedLastTrade = React.memo(LastTrade)

export default MemoizedLastTrade