import React, { useState, useEffect } from 'react'
import { compose } from 'recompose'
import { Theme } from '@material-ui/core'

import { DarkTooltip } from '@sb/components/TooltipCustom/Tooltip'
import {
  PanelCard,
  PanelCardTitle,
  PanelCardValue,
  PanelCardSubValue,
} from '@sb/compositions/Chart/Chart.styles'

import {
  formatNumberToUSFormat,
  stripDigitPlaces,
  roundAndFormatNumber,
} from '@core/utils/PortfolioTableUtils'
import { getPrice } from '@core/graphql/queries/chart/getPrice'
import { LISTEN_PRICE } from '@core/graphql/subscriptions/LISTEN_PRICE'
import { updatePriceQuerryFunction } from '@sb/compositions/Chart/components/MarketStats/MarketStats.utils'
import { queryRendererHoc } from '@core/components/QueryRenderer'

import {
  Row,
  BlockContainer,
  GreenTitle,
  SerumTitleBlockContainer,
  SerumWhiteTitle,
  Text,
  TopBarTitle,
} from '../../index.styles'

export interface IProps {
  marketType: 0 | 1
  theme: Theme
  pricePrecision: number
  lastMarketPrice: number
}
export interface IPropsDataWrapper {
  symbol: string
  exchange: string
  marketType: 0 | 1
  props: any[]
}

const PriceBlock = ({
  marketType,
  theme,
  pricePrecision,
  lastMarketPrice,
  circulatingSupply,
}: IProps) => {
  return (
    <Text theme={theme}>
      ${formatNumberToUSFormat((lastMarketPrice * circulatingSupply).toFixed(0))}
    </Text>
  )
}

const MemoizedPriceBlock = React.memo(PriceBlock)

const PriceDataWrapper = ({
  symbol,
  exchange,
  marketType,
  ...props
}: IPropsDataWrapper) => {
  const { getPriceQuery, theme, pricePrecision, circulatingSupply } = props
  const { getPrice: lastMarketPrice = 0 } = getPriceQuery || { getPrice: 0 }

  return (
    <MemoizedPriceBlock
      theme={theme}
      pricePrecision={pricePrecision}
      lastMarketPrice={lastMarketPrice}
      marketType={marketType}
      circulatingSupply={circulatingSupply}
    />
  )
}

const MemoizedPriceDataWrapper = React.memo(PriceDataWrapper)

export default React.memo(
  compose(
    queryRendererHoc({
      query: getPrice,
      name: 'getPriceQuery',
      variables: (props: any) => ({
        exchange: props.exchange.symbol,
        pair: `${props.symbol}:${props.marketType}`,
      }),
      fetchPolicy: 'cache-and-network',
      withOutSpinner: true,
      withTableLoader: true,
      withoutLoading: true,
    })
  )(MemoizedPriceDataWrapper)
)
