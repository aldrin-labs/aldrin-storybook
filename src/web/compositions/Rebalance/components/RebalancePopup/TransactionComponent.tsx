import React from 'react'
import { Theme } from '@material-ui/core'

import { Row } from '@sb/compositions/AnalyticsRoute/index.styles'
import { Text } from '@sb/compositions/Addressbook/index'

import { Stroke, StyledTextColumnContainer } from './styles'
import { BlockForCoins } from './BlockForCoins'
import { stripDigitPlaces } from '@core/utils/PortfolioTableUtils'
import { Market } from '@project-serum/serum'
import { RebalancePopupStep } from '../../Rebalance.types'
import { Loading, SvgIcon } from '@sb/components'
import GreenCheckMark from '@icons/greenDoneMark.svg'
import RedCross from '@icons/Cross.svg'

const getTransactionState = ({
  rebalanceStep,
  isTransactionCompleted,
}: {
  rebalanceStep: RebalancePopupStep
  isTransactionCompleted: boolean
}): RebalancePopupStep | null => {
  switch (rebalanceStep) {
    case 'initial': {
      return null
    }
    case 'pending': {
      if (isTransactionCompleted) {
        return 'done'
      } else {
        return 'pending'
      }
    }
    case 'failed': {
      if (isTransactionCompleted) {
        return 'done'
      } else {
        return 'failed'
      }
    }
    case 'done': {
      return 'done'
    }
    default: {
      return null
    }
  }
}

export const TransactionComponent = ({
  theme,
  symbol,
  slippage,
  price,
  side,
  amount,
  total,
  market,
  index,
  rebalanceStep,
  isNotEnoughLiquidity,
  isLastTransaction,
  numberOfCompletedTransactions,
}: {
  theme: Theme
  symbol: string
  slippage: number
  price: number
  amount: number
  total: number
  side: 'buy' | 'sell'
  market: Market
  index: number
  rebalanceStep: RebalancePopupStep
  isNotEnoughLiquidity: boolean
  isLastTransaction: boolean
  numberOfCompletedTransactions: number
}) => {
  const isBuySide = side === 'buy'
  const [base, quote] = symbol.split('_')
  const showError = amount === 0 || isNotEnoughLiquidity
  const errorText = isNotEnoughLiquidity
    ? 'Insufficient liquidity.'
    : `Amount < min order size (${market.minOrderSize} ${base}).`

  const isTransactionCompleted = numberOfCompletedTransactions >= index + 1
  const transactionState = getTransactionState({
    rebalanceStep,
    isTransactionCompleted,
  })

  return (
    <Stroke showBorder={!isLastTransaction}>
      {transactionState && (
        <Row width={'2rem'}>
          {transactionState === 'pending' ? (
            <Loading color={'#F29C38'} size={'2rem'} />
          ) : transactionState === 'failed' ? (
            <SvgIcon src={RedCross} width={'2rem'} height={'2rem'} />
          ) : (
            <SvgIcon src={GreenCheckMark} width={'2rem'} height={'2rem'} />
          )}
        </Row>
      )}
      <Row width={'calc(45% - 4rem)'} margin={'0 0 0 2rem'}>
        <BlockForCoins symbol={symbol} side={side} />
      </Row>
      <Row width={'calc(55%)'} justify={'flex-end'} margin={'0 0 0 0rem'}>
        {showError ? (
          <StyledTextColumnContainer style={{ justifyContent: 'flex-end' }}>
            <Row justify={'flex-end'} padding={'.3rem 0'}>
              <Text
                color={theme.palette.red.main}
                style={{
                  whiteSpace: 'nowrap',
                  paddingRight: '1rem',
                  fontSize: '1.3rem',
                }}
              >
                {errorText}
              </Text>
            </Row>
            <Row padding={'.3rem 0'}>
              <Text
                color={theme.palette.red.main}
                style={{
                  whiteSpace: 'nowrap',
                  paddingRight: '1rem',
                  fontSize: '1.3rem',
                }}
              >
                This trade will be skipped.
              </Text>
            </Row>
          </StyledTextColumnContainer>
        ) : (
          <StyledTextColumnContainer style={{ justifyContent: 'flex-end' }}>
            <Row justify={'flex-end'} padding={'.3rem 0'}>
              <Text
                color={theme.palette.grey.new}
                style={{
                  whiteSpace: 'nowrap',
                  paddingRight: '1rem',
                  fontSize: '1.3rem',
                }}
              >
                Est. Price:
              </Text>

              <Text
                style={{
                  whiteSpace: 'nowrap',
                  fontSize: '1.3rem',
                }}
              >
                <Text color={theme.palette.green.main}>
                  <Text
                    color={theme.palette.green.main}
                    style={{ fontFamily: 'Avenir Next Demi' }}
                  >
                    1
                  </Text>{' '}
                  {base}
                </Text>{' '}
                ={' '}
                <Text color={theme.palette.green.main}>
                  <Text
                    color={theme.palette.green.main}
                    style={{ fontFamily: 'Avenir Next Demi' }}
                  >
                    {price ? +stripDigitPlaces(price, 4) : 0}
                  </Text>{' '}
                  {quote}
                </Text>
              </Text>
            </Row>
            <Row justify={'flex-end'} padding={'.3rem 0'}>
              <Text
                color={theme.palette.grey.new}
                style={{
                  whiteSpace: 'nowrap',
                  paddingRight: '1rem',
                  fontSize: '1.3rem',
                }}
              >
                Minimum received:
              </Text>

              <Text
                style={{
                  whiteSpace: 'nowrap',
                  fontSize: '1.3rem',
                }}
              >
                <Text style={{ fontFamily: 'Avenir Next Demi' }}>
                  {isBuySide ? amount : stripDigitPlaces(total, 4)}
                </Text>{' '}
                {isBuySide ? base : quote}
              </Text>
            </Row>
          </StyledTextColumnContainer>
        )}
      </Row>
    </Stroke>
  )
}
