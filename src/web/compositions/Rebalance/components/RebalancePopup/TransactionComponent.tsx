import React from 'react'
import { Theme } from '@material-ui/core'

import { Row } from '@sb/compositions/AnalyticsRoute/index.styles'
import { Text } from '@sb/compositions/Addressbook/index'

import { TextColumnContainer } from '@sb/compositions/Pools/components/Tables/index.styles'
import { Stroke, StyledPaper } from './styles'
import { BlockForCoins } from './BlockForCoins'

export const TransactionComponent = ({
    theme,
    symbol,
    slippage,
    price,
    side,
  }: {
    theme: Theme
    symbol: string
    slippage: number
    price: number
    side: 'buy' | 'sell'
  }) => {
    const [base, quote] = symbol.split('_')
  
    return (
      <Stroke>
        <Row>
          <BlockForCoins symbol={symbol} side={side} />
        </Row>
        <Row>
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
                Est. Price:
              </Text>
  
              <Text
                theme={theme}
                style={{
                  whiteSpace: 'nowrap',
                  fontSize: '1.4rem',
                }}
              >
                1 {base} = {1 * (price ? price.toFixed(3) : 0)} {quote}
              </Text>
            </Row>
          </TextColumnContainer>
        </Row>
      </Stroke>
    )
  }
  