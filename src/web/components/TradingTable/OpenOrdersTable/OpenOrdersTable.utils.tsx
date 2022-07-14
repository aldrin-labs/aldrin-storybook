import React from 'react'
import { DefaultTheme } from 'styled-components'

import { RowContainer } from '@sb/compositions/AnalyticsRoute/index.styles'

import { OrderType } from '@core/types/ChartTypes'
import { getPrecisionItem } from '@core/utils/getPrecisionItem'
import { stripDigitPlaces } from '@core/utils/PortfolioTableUtils'

import { StyledTitle, StyledPriceText } from '../TradingTable.styles'
import { CloseButton, isBuyTypeOrder } from '../TradingTable.utils'

export const filterOpenOrders = ({
  order,
  canceledOrders,
}: {
  order: OrderType
  canceledOrders: string[]
}) => {
  const {
    type = '',
    status = '',
    info = { orderId: '' },
  } = order || {
    type: '',
    status: '',
    info: { orderId: '' },
  }

  const { orderId = '' } = info || { orderId: '' }

  return (
    !canceledOrders.includes(orderId) &&
    // sometimes we don't have order.type, also we want to filter market orders
    (!type || (type && type !== 'market'))
  )
}

export const combineOpenOrdersTable = (
  openOrdersData: OrderType[],
  cancelOrderFunc: (el: OrderType) => Promise<any>,
  theme: DefaultTheme,
  handlePairChange: (pair: string) => void,
  isCancellingAllOrders: boolean,
  needShowValue: boolean
) => {
  if (!openOrdersData && !Array.isArray(openOrdersData)) {
    return []
  }

  const processedOpenOrdersData = openOrdersData
    .filter((el) =>
      filterOpenOrders({
        order: el,
        canceledOrders: [],
      })
    )
    .map((el: OrderType, i: number) => {
      const {
        orderId = 0,
        size = '',
        side = '',
        price = 0,
        marketName = '',
      } = el || {
        orderId: 0,
        size: 0,
        side: '',
        price: 0,
        marketName: '',
      }
      const orderSymbol = marketName.split('/').join('_') || ''
      const orderSide = side || ''

      // const keyName = keys ? keys[keyId] : ''

      const needOpacity = false
      const pair = orderSymbol.split('_')

      let type = 'limit'
      const isMakerOnlyOrder = type === 'maker-only'

      type = type.toLowerCase().replace(/-/g, '_')

      const isMarketOrMakerOrder =
        price === 0 && (!!type.match(/market/) || isMakerOnlyOrder)

      const { pricePrecision, quantityPrecision } = getPrecisionItem({
        marketType: 0,
        symbol: marketName,
      })
      return {
        id: `${orderId}${size}${price}`,
        pair: {
          render: (
            <div
              onClick={() => handlePairChange(orderSymbol)}
              style={{
                display: 'flex',
                alignItems: 'center',
                cursor: 'pointer',
              }}
            >
              {pair[0]}/{pair[1]}
            </div>
          ),
          contentToSort: orderSymbol,
          showOnMobile: false,
        },
        columnForMobile: {
          render: (
            <RowContainer height="20rem" padding="0 2rem">
              <RowContainer style={{ width: '65%' }} direction="column">
                <RowContainer justify="space-between">
                  <StyledTitle color="#fbf2f2">
                    {pair[0]}/{pair[1]}
                  </StyledTitle>
                  <StyledTitle
                    style={{
                      textTransform: 'capitalize',
                      color:
                        side === 'buy'
                          ? theme.colors.green7
                          : theme.colors.red4,
                    }}
                  >
                    {side}
                  </StyledTitle>
                </RowContainer>
                <RowContainer justify="space-between">
                  <StyledTitle>Price({pair[1]})</StyledTitle>{' '}
                  <StyledPriceText>{`${stripDigitPlaces(
                    price,
                    pricePrecision
                  )}`}</StyledPriceText>
                </RowContainer>
                <RowContainer justify="space-between">
                  <StyledTitle>Amount ({pair[0]})</StyledTitle>
                  <StyledPriceText>
                    {stripDigitPlaces(size, quantityPrecision)}
                  </StyledPriceText>
                </RowContainer>
                <RowContainer justify="space-between">
                  <StyledTitle>Total ({pair[0]})</StyledTitle>
                  <StyledPriceText>
                    {stripDigitPlaces(+size * price, quantityPrecision)}
                  </StyledPriceText>
                </RowContainer>
              </RowContainer>
              <RowContainer style={{ width: '35%', padding: '0 0 0 4rem' }}>
                <CloseButton
                  i={i}
                  showLoader={isCancellingAllOrders}
                  onClick={() => {
                    cancelOrderFunc(el)
                  }}
                />
              </RowContainer>
            </RowContainer>
          ),
          showOnMobile: true,
        },
        side: {
          render: (
            <div>
              <span
                style={{
                  display: 'block',
                  textTransform: 'uppercase',
                  color: isBuyTypeOrder(orderSide)
                    ? theme.colors.green7
                    : theme.colors.red4,
                }}
              >
                {orderSide}
              </span>
              {/* <span
                style={{
                  textTransform: 'capitalize',
                  color: theme.palette.grey.light,
                  letterSpacing: '1px',
                }}
              >
                {'limit'}
              </span> */}
            </div>
          ),
          style: {
            color: isBuyTypeOrder(orderSide)
              ? theme.colors.green7
              : theme.colors.red4,
            opacity: needOpacity ? 0.75 : 1,
          },
          showOnMobile: false,
        },
        price: {
          render: isMarketOrMakerOrder
            ? 'market'
            : !+price
            ? price
            : `${stripDigitPlaces(price, pricePrecision)} ${pair[1]}`,
          style: {
            textAlign: 'left',
            whiteSpace: 'nowrap',
            opacity: needOpacity ? 0.75 : 1,
          },
          contentToSort: price,
          showOnMobile: false,
        },
        amount: {
          render: `${stripDigitPlaces(size, quantityPrecision)} ${pair[0]}`,
          contentToSort: +size,
          style: { opacity: needOpacity ? 0.75 : 1 },
          showOnMobile: false,
        },

        value: {
          // render: `${total} ${getCurrentCurrencySymbol(symbol, side)}`,
          render: !+price
            ? '-'
            : `$${stripDigitPlaces(+size * price, quantityPrecision)}`,
          contentToSort: +size * price,
          style: { opacity: needOpacity ? 0.75 : 1 },
          showOnMobile: false,
        },
        cancel: {
          render: needOpacity ? (
            '-'
          ) : (
            <CloseButton
              i={i}
              showLoader={isCancellingAllOrders}
              onClick={() => {
                cancelOrderFunc(el)
              }}
            />
          ),
          style: { textAlign: 'right' },
          showOnMobile: false,
        },
      }
    })

  return processedOpenOrdersData
}
