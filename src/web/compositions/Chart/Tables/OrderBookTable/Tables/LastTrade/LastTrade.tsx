import React, { useState, useEffect } from 'react'

import {
  LastTradeContainer,
  LastTradeValue,
  LastTradePrice,
  ArrowIcon,
} from './LastTrade.styles'

import { OrderbookMode } from '../../OrderBookTableContainer.types'
import { stripDigitPlaces } from '@core/utils/PortfolioTableUtils'
import { addMainSymbol } from '@sb/components/index'

const LastTrade = ({
  lastTradeData,
  group,
  mode,
}: {
  lastTradeData: { marketTickers: [string] }
  group: number
  mode: OrderbookMode
}) => {
  if (
    !(
      lastTradeData &&
      lastTradeData.marketTickers &&
      lastTradeData.marketTickers.length > 0
    ) ||
    mode !== 'both'
  ) {
    return null
  }

  const currentTrade = JSON.parse(lastTradeData.marketTickers[0])
  const currentTradePrice = currentTrade[3]

  const [prevTradePrice, updatePrevPrice] = useState(currentTrade[3])
  const fall = prevTradePrice > currentTradePrice

  useEffect(() => {
    updatePrevPrice(currentTradePrice)
  }, [currentTradePrice])

  return (
    <LastTradeContainer>
      <LastTradeValue fall={fall}>
        <ArrowIcon />
        {addMainSymbol(stripDigitPlaces(currentTrade[3], 2), true)}
      </LastTradeValue>
      <LastTradePrice>
        {addMainSymbol(stripDigitPlaces(currentTrade[3], 2), true)}
      </LastTradePrice>
    </LastTradeContainer>
  )
}

export default LastTrade
