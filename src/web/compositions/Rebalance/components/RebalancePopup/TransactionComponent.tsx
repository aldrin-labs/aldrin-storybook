import React from 'react'
import { Theme } from '@material-ui/core'

import { Row } from '@sb/compositions/AnalyticsRoute/index.styles'
import { Text } from '@sb/compositions/Addressbook/index'

import { TextColumnContainer } from '@sb/compositions/Pools/components/Tables/index.styles'
import { Stroke, StyledPaper } from './styles'
import { BlockForCoins } from './BlockForCoins'
import { stripDigitPlaces } from '@core/utils/PortfolioTableUtils'
import { Market } from '@project-serum/serum'

export const TransactionComponent = ({
  theme,
  symbol,
  slippage,
  price,
  side,
  amount,
  total,
  market,
  isNotEnoughLiquidity,
}: {
  theme: Theme
  symbol: string
  slippage: number
  price: number
  amount: number
  total: number
  side: 'buy' | 'sell'
  market: Market
  isNotEnoughLiquidity: boolean
}) => {
  const [base, quote] = symbol.split('_')
  const showError = amount === 0 || isNotEnoughLiquidity
  const errorText = isNotEnoughLiquidity
    ? 'Not enough liquidity in orderbook'
    : `Min order size is ${market.minOrderSize}`

  return (
    <Stroke>
      <Row>
        <BlockForCoins symbol={symbol} side={side} />
      </Row>
      <Row>
        {showError ? (
          <TextColumnContainer>
            <Row>
              <Text
                theme={theme}
                color={theme.palette.red.main}
                style={{
                  whiteSpace: 'nowrap',
                  paddingRight: '1rem',
                  fontSize: '1.4rem',
                }}
              >
                Error. {errorText}
              </Text>
            </Row>
            <Row>
              <Text
                theme={theme}
                color={theme.palette.red.main}
                style={{
                  whiteSpace: 'nowrap',
                  paddingRight: '1rem',
                  fontSize: '1.4rem',
                }}
              >
                Transaction won't be executed
              </Text>
            </Row>
          </TextColumnContainer>
        ) : (
          <TextColumnContainer style={{ alignItems: 'flex-end' }}>
            <Row padding={'1rem 0'}>
              <Text
                theme={theme}
                color={theme.palette.grey.new}
                style={{
                  whiteSpace: 'nowrap',
                  fontSize: '1.4rem',
                  paddingRight: '1rem',
                }}
              >
                Est. Slippage:
              </Text>{' '}
              <Text
                theme={theme}
                style={{
                  whiteSpace: 'nowrap',
                  fontSize: '1.4rem',
                }}
              >
                {slippage}%
              </Text>
            </Row>

            <Row>
              <Text
                theme={theme}
                color={theme.palette.grey.new}
                style={{
                  whiteSpace: 'nowrap',
                  paddingRight: '1rem',
                  fontSize: '1.4rem',
                }}
              >
                Est. Total:
              </Text>

              <Text
                theme={theme}
                style={{
                  whiteSpace: 'nowrap',
                  fontSize: '1.4rem',
                }}
              >
                {`${amount} ${base}`} ={' '}
                {`${stripDigitPlaces(total, 4)} ${quote}`}
              </Text>
            </Row>
            <Row>
              <Text
                theme={theme}
                color={theme.palette.grey.new}
                style={{
                  whiteSpace: 'nowrap',
                  paddingRight: '1rem',
                  fontSize: '1.4rem',
                }}
              >
                Est. Price:
              </Text>

              <Text
                theme={theme}
                style={{
                  whiteSpace: 'nowrap',
                  fontSize: '1.4rem',
                }}
              >
                1 {base} = {price ? +stripDigitPlaces(price, 4) : 0} {quote}
              </Text>
            </Row>
          </TextColumnContainer>
        )}
      </Row>
    </Stroke>
  )
}
