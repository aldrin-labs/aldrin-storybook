import { Market, OpenOrders } from '@project-serum/serum'
import React from 'react'
import { DefaultTheme } from 'styled-components'

import { BtnCustom } from '@sb/components/BtnCustom/BtnCustom.styles'
import { Button } from '@sb/components/Button'
import { InlineText } from '@sb/components/Typography'
import { RowContainer } from '@sb/compositions/AnalyticsRoute/index.styles'

import { FundsType } from '@core/types/ChartTypes'
import { roundAndFormatNumber } from '@core/utils/PortfolioTableUtils'

import { StyledTitle } from '../TradingTable.styles'

export const combineBalancesTable = (
  fundsData: FundsType[],
  onSettleFunds: (market: Market, openOrders: OpenOrders) => void,
  theme: DefaultTheme,
  showSettle: boolean
) => {
  if (!fundsData && !Array.isArray(fundsData)) {
    return []
  }

  const filtredFundsData = fundsData

  const processedFundsData = filtredFundsData.map(
    (el: FundsType, i: number) => {
      const { coin, wallet, orders, unsettled, market, openOrders } = el
      return {
        id: `${coin}${wallet}${unsettled}${i}`,
        coin: {
          render: <InlineText> {coin || 'unknown'}</InlineText>,
          showOnMobile: false,
        },
        columnForMobile: {
          render: (
            <RowContainer height="20rem" padding="0 2rem">
              <RowContainer style={{ width: '40%' }} direction="column">
                <RowContainer justify="flex-start">
                  <StyledTitle color={theme.colors.gray1}>{coin}</StyledTitle>
                </RowContainer>
                <RowContainer justify="space-between">
                  <StyledTitle>Wallet</StyledTitle>
                  <StyledTitle color={theme.colors.gray1}>
                    {roundAndFormatNumber(wallet, 8, true) || '0'}
                  </StyledTitle>
                </RowContainer>
                <RowContainer justify="space-between">
                  <StyledTitle>Unsettled</StyledTitle>
                  <StyledTitle color={theme.colors.gray1}>
                    {roundAndFormatNumber(unsettled, 8, true) || '0'}
                  </StyledTitle>
                </RowContainer>
              </RowContainer>

              <RowContainer style={{ width: '60%' }} justify="flex-end">
                <BtnCustom
                  btnWidth="50%"
                  height="auto"
                  fontSize="1.6rem"
                  textTransform="none"
                  padding=".5rem 1rem .4rem 1rem"
                  borderRadius="1.4rem"
                  btnColor={theme.colors.primaryWhite}
                  borderColor={theme.colors.blue3}
                  backgroundColor={theme.colors.blue3}
                  transition="all .4s ease-out"
                  margin="0 0 0 2rem"
                  onClick={() => onSettleFunds(market, openOrders)}
                >
                  Settle
                </BtnCustom>
              </RowContainer>
            </RowContainer>
          ),
          showOnMobile: true,
        },
        wallet: {
          render: (
            <InlineText size="md">
              {roundAndFormatNumber(wallet, 8, true) || '0'}
            </InlineText>
          ),
          style: { textAlign: 'left' },
          contentToSort: +wallet,
          showOnMobile: false,
        },
        orders: {
          render: (
            <InlineText size="md">
              {roundAndFormatNumber(orders, 8, true) || '0'}
            </InlineText>
          ),
          style: { textAlign: 'left' },
          contentToSort: +orders,
          showOnMobile: false,
        },
        unsettled: {
          render: (
            <InlineText size="md">
              {roundAndFormatNumber(unsettled, 8, true) || '0'}
            </InlineText>
          ),
          style: { textAlign: 'left' },
          contentToSort: +unsettled,
          showOnMobile: false,
        },
        ...(showSettle
          ? {
              settle: {
                render: (
                  <Button
                    $variant="primary"
                    $fontSize="lg"
                    style={{ margin: '0.3em 0' }}
                    onClick={() => onSettleFunds(market, openOrders)}
                  >
                    Settle
                  </Button>
                ),
                showOnMobile: false,
              },
            }
          : {}),
      }
    }
  )

  return processedFundsData.filter((el) => !!el)
}
