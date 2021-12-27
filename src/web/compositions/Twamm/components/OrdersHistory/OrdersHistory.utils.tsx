import { COLORS } from '@variables/variables'
import React from 'react'

import { StyledTitle } from '@sb/components/TradingTable/TradingTable.styles'
import { RowContainer } from '@sb/compositions/AnalyticsRoute/index.styles'

export const ordersHistoryColumnNames = [
  { label: 'Pair/Side', id: 'pairSide' },
  { label: 'Total Order Amount', id: 'amount' },
  { label: 'Filled %', id: 'filled' },
  { label: 'Average Filled Price', id: 'avgFilledPrice' },
  { label: 'Sent', id: 'sent' },
  { label: 'Received', id: 'received' },
  { label: 'Date Started', id: 'started' },
  { label: 'Date Finished', id: 'finished' },
]

const mock = [
  {
    side: 'Buy',
    pair: 'SOL/wUSDT',
    amount: '10000.0000',
    filledPers: '28%',
    price: '198.42',
    sent: '3000.00',
    received: '240000.00',
    remainingAmount: '9904.0421',
    remainingTime: '126h 25m',
    actions: '',
  },
  {
    side: 'Sell',
    pair: 'SOL/USDC',
    amount: '10000.0000',
    filledPers: '28%',
    price: '198.42',
    sent: '3000.00',
    received: '240000.00',
    remainingAmount: '9904.0421',
    remainingTime: '126h 25m',
    actions: '',
  },
  {
    side: 'Buy',
    pair: 'SOL/USDT',
    amount: '10000.0000',
    filledPers: '28%',
    price: '198.42',
    sent: '3000.00',
    received: '240000.00',
    remainingAmount: '9904.0421',
    remainingTime: '126h 25m',
    actions: '',
  },
]

export const combineOrdersHistoryTable = ({ wallet, connection }) => {
  return mock.map((el) => {
    const [base, quote] = el.pair.split('/')

    return {
      id: el.pair,
      pairSide: {
        render: (
          <RowContainer direction="column" align="flex-start">
            <StyledTitle color={COLORS.main} fontSize="1.5rem">
              {el.pair}
            </StyledTitle>
            <StyledTitle
              fontSize="1.5rem"
              color={el.side === 'Buy' ? COLORS.success : COLORS.errorAlt}
            >
              {el.side} {base}
            </StyledTitle>
          </RowContainer>
        ),
        contentToSort: '',
        showOnMobile: false,
      },
      amount: {
        render: (
          <StyledTitle color={COLORS.main} fontSize="1.5rem">
            {el.amount} {el.side === 'Buy' ? quote : base}
          </StyledTitle>
        ),
        contentToSort: '',
        showOnMobile: false,
      },
      filled: {
        render: (
          <StyledTitle color={COLORS.success} fontSize="1.5rem">
            {el.filledPers}
          </StyledTitle>
        ),
        contentToSort: '',
        showOnMobile: false,
      },
      avgFilledPrice: {
        render: (
          <StyledTitle color={COLORS.main} fontSize="1.5rem">
            {el.price}
            {quote}
          </StyledTitle>
        ),
        contentToSort: '',
        showOnMobile: false,
      },
      sent: {
        render: (
          <StyledTitle color={COLORS.success} fontSize="1.5rem">
            {el.sent}
          </StyledTitle>
        ),
        contentToSort: '',
        showOnMobile: false,
      },
      received: {
        render: (
          <StyledTitle color={COLORS.success} fontSize="1.5rem">
            {el.received}
          </StyledTitle>
        ),
        contentToSort: '',
        showOnMobile: false,
      },
      started: {
        render: (
          <RowContainer direction="column" align="flex-start">
            <StyledTitle color={COLORS.main} fontSize="1.5rem">
              {el.pair}
            </StyledTitle>
            <StyledTitle
              fontSize="1.5rem"
              color={el.side === 'Buy' ? COLORS.success : COLORS.errorAlt}
            >
              {el.side} {base}
            </StyledTitle>
          </RowContainer>
        ),
        contentToSort: '',
        showOnMobile: false,
      },
      finished: {
        render: (
          <RowContainer direction="column" align="flex-start">
            <StyledTitle color={COLORS.main} fontSize="1.5rem">
              {el.pair}
            </StyledTitle>
            <StyledTitle
              fontSize="1.5rem"
              color={el.side === 'Buy' ? COLORS.success : COLORS.errorAlt}
            >
              {el.side} {base}
            </StyledTitle>
          </RowContainer>
        ),
        contentToSort: '',
        showOnMobile: false,
      },
    }
  })
}
