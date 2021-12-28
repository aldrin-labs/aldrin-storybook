import { Connection } from '@solana/web3.js'
import { COLORS } from '@variables/variables'
import React, { useEffect, useState } from 'react'

import { StyledTitle } from '@sb/components/TradingTable/TradingTable.styles'
import { RowContainer } from '@sb/compositions/AnalyticsRoute/index.styles'
import { getParsedPairSettings } from '@sb/dexUtils/twamm/getParsedPairSettings'
import { getParsedRunningOrders } from '@sb/dexUtils/twamm/getParsedRunningOrders'
import { WalletAdapter } from '@sb/dexUtils/types'
import { toMap } from '@sb/utils'

import { RedButton } from '../../styles'

export const runningOrdersColumnNames = [
  { label: 'Pair/Side', id: 'pairSide' },
  { label: 'Total Order Amount', id: 'amount' },
  { label: 'Filled %', id: 'filled' },
  { label: 'Average Filled Price', id: 'avgFilledPrice' },
  { label: 'Sent', id: 'sent' },
  { label: 'Received', id: 'received' },
  { label: 'Remaining Amount', id: 'remainingAmount' },
  { label: 'Remaining Time', id: 'remainingTime' },
  { label: 'Actions', id: 'actions' },
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

export const combineRunningOrdersTable = ({
  wallet,
  connection,
}: {
  wallet: WalletAdapter
  connection: Connection
}) => {
  const [runningOrders, setRunningOrders] = useState()
  const [pairData, setPairData] = useState([])

  useEffect(() => {
    const getRunningOrdersData = async () => {
      const runningOrdersArray = await getParsedRunningOrders({
        connection,
        wallet,
      })
      const pairSettingsData = await getParsedPairSettings({
        connection,
        wallet,
      })
      setRunningOrders(runningOrdersArray)
      setPairData(pairSettingsData)
    }
    getRunningOrdersData()
  }, [wallet.publicKey])

  const a = toMap(pairData, (p) => p?.publicKey)

  const runningOrdersArray = runningOrders?.flat()

  return runningOrdersArray.map((el) => {
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
      remainingAmount: {
        render: (
          <StyledTitle color={COLORS.main} fontSize="1.5rem">
            {el.remainingAmount} {quote}
          </StyledTitle>
        ),
        contentToSort: '',
        showOnMobile: false,
      },
      remainingTime: {
        render: (
          <StyledTitle color={COLORS.main} fontSize="1.5rem">
            {el.remainingTime}
          </StyledTitle>
        ),
        contentToSort: '',
        showOnMobile: false,
      },
      actions: {
        render: <RedButton>Stop</RedButton>,
        contentToSort: '',
        showOnMobile: false,
      },
    }
  })
}
