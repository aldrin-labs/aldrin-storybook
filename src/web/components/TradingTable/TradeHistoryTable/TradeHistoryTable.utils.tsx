import React from 'react'
import { DefaultTheme } from 'styled-components'

import { RowContainer } from '@sb/compositions/AnalyticsRoute/index.styles'

import { TradeType } from '@core/types/ChartTypes'
import { getPrecisionItem } from '@core/utils/getPrecisionItem'
import { stripDigitPlaces } from '@core/utils/PortfolioTableUtils'

import { StyledTitle } from '../TradingTable.styles'

export const combineTradeHistoryTable = (
  tradeData: TradeType[],
  theme: DefaultTheme,
  marketType: 0 | 1,
  handlePairChange: (pair: string) => void
) => {
  if (!tradeData && !Array.isArray(tradeData)) {
    return []
  }

  const processedTradeHistoryData = tradeData.map((el: TradeType) => {
    const {
      marketName = '',
      side = '',
      size = 0,
      price = 0,
      orderId = 0,
      liquidity = '',
      feeCost = 0,
    } = el

    const { pricePrecision, quantityPrecision } = getPrecisionItem({
      marketType,
      symbol: marketName,
    })

    const pair = marketName.split('/').join('_').split('_')

    return {
      id: `${orderId}_${size}_${price}`,
      pair: {
        render: (
          <div
            onClick={(e) => {
              handlePairChange(marketName)
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer',
            }}
          >
            {pair[0]}/{pair[1]}
          </div>
        ),
        contentToSort: marketName,
        showOnMobile: false,
      },
      type: {
        render: (
          <span
            style={{
              display: 'block',
              textTransform: 'uppercase',
              color: side === 'buy' ? theme.colors.green7 : theme.colors.red3,
            }}
          >
            {side}
          </span>
        ),
        contentToSort: side,
        showOnMobile: false,
      },
      price: {
        render: `${stripDigitPlaces(price, pricePrecision)} ${pair[1]}`,
        style: { textAlign: 'left', whiteSpace: 'nowrap' },
        contentToSort: price,
        showOnMobile: false,
      },
      quantity: {
        render: `${stripDigitPlaces(size, quantityPrecision)} ${pair[0]}`,
        contentToSort: +size,
        showOnMobile: false,
      },
      amount: {
        // render: `${total} ${getCurrentCurrencySymbol(symbol, side)}`,
        render: `${stripDigitPlaces(size * price, quantityPrecision)} ${
          pair[1]
        }`,
        contentToSort: size * price,
        showOnMobile: false,
      },
      liquidity: {
        render: liquidity,
        contentToSort: liquidity,
        showOnMobile: false,
      },
      fee: {
        render: `${stripDigitPlaces(feeCost, quantityPrecision)} ${pair[1]}`,
        contentToSort: feeCost,
        showOnMobile: false,
      },
      columnForMobile: {
        render: (
          <RowContainer padding="0 2rem" direction="column" height="20rem">
            <RowContainer justify="space-between">
              <StyledTitle color="#fbf2f2">
                {pair[0]}/{pair[1]}
              </StyledTitle>
              <StyledTitle
                style={{
                  textTransform: 'capitalize',
                  color:
                    side === 'buy' ? theme.colors.green7 : theme.colors.red3,
                }}
              >
                {side}
              </StyledTitle>
            </RowContainer>
            <RowContainer justify="space-between">
              <StyledTitle>Price(USDC)</StyledTitle>{' '}
              <StyledTitle color="#fbf2f2">{`${stripDigitPlaces(
                price,
                pricePrecision
              )}`}</StyledTitle>
            </RowContainer>
            <RowContainer justify="space-between">
              <StyledTitle>Amount (CCAI)</StyledTitle>
              <StyledTitle color="#fbf2f2">
                {stripDigitPlaces(size, quantityPrecision)}
              </StyledTitle>
            </RowContainer>
            <RowContainer justify="space-between">
              <StyledTitle>Total (USDC)</StyledTitle>
              <StyledTitle color="#fbf2f2">
                {stripDigitPlaces(size * price, quantityPrecision)}
              </StyledTitle>
            </RowContainer>
          </RowContainer>
        ),
        showOnMobile: true,
      },
    }
  })

  return processedTradeHistoryData
}
