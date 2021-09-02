import React, { useState, useEffect } from 'react'
import { Theme } from '@material-ui/core'
import { settleFunds } from '@sb/dexUtils/send'

import useMobileSize from '@webhooks/useMobileSize'

import {
  Container,
  Text,
  DemiText,
  BlackButton,
} from '../TransactionsConfirmationWarningPopup/TransactionsConfirmationWarningPopup.styles'
import { Row, RowContainer } from '@sb/compositions/AnalyticsRoute/index.styles'

import {
  useBalances,
  useMarket,
  useSelectedBaseCurrencyAccount,
  useSelectedOpenOrdersAccount,
  useSelectedQuoteCurrencyAccount,
} from '@sb/dexUtils/markets'
import { useConnection } from '@sb/dexUtils/connection'
import { useWallet } from '@sb/dexUtils/wallet'

export const ProposeToSettlePopup = ({ theme }: { theme: Theme }) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false)
  const balances = useBalances()
  const connection = useConnection()
  const { wallet } = useWallet()
  const baseTokenAccount = useSelectedBaseCurrencyAccount()
  const quoteTokenAccount = useSelectedQuoteCurrencyAccount()
  const { market, baseCurrency, quoteCurrency } = useMarket()
  const openOrders = useSelectedOpenOrdersAccount()

  const isBalanceUnsettled = balances[0]?.unsettled || balances[1]?.unsettled

  useEffect(() => {
    setIsPopupOpen(isBalanceUnsettled)
  }, [isBalanceUnsettled])
  
  const isMobile = useMobileSize()

  if (isMobile || !isPopupOpen) return null

  return (
    <Container
      showOnTheTop={true}
      style={{
        height: '35.5%',
        top: 'auto',
        bottom: '0',
        width: '42%',
        right: '0',
        zIndex: '10',
        borderTopLeftRadius: '1rem',
      }}
      direction="column"
      align="flex-start"
      justify="space-between"
      padding="6rem 4rem"
    >
      <RowContainer
        justify="space-between"
        align={'baseline'}
        direction="column"
        height="100%"
      >
        <DemiText
          theme={theme}
          style={{
            lineHeight: '4rem',
            marginBottom: '2rem',
            fontSize: '3.5rem',
            textAlign: 'left',
            fontFamily: 'Avenir Next Demi',
          }}
        >
          You have an unsettled balance.
        </DemiText>
        <RowContainer align="flex-start" justify="space-between">
          <Row
            height={'100%'}
            direction={'column'}
            justify="space-between"
            align="flex-start"
          >
            <Text
              style={{
                lineHeight: '2rem',
                fontSize: '1.8rem',
              }}
              theme={theme}
            >
              {balances[0].coin}:{' '}
              <span style={{ fontFamily: 'Avenir Next Demi' }}>
                {balances[0].unsettled} {balances[0].coin}
              </span>
            </Text>
            <Text
              style={{
                lineHeight: '2rem',
                fontSize: '1.8rem',
              }}
              theme={theme}
            >
              {balances[1].coin}:{' '}
              <span style={{ fontFamily: 'Avenir Next Demi' }}>
                {balances[1].unsettled} {balances[1].coin}
              </span>
            </Text>
          </Row>
          <BlackButton
            disabled={false}
            theme={theme}
            hoverBackground={'#20292d'}
            width={'auto'}
            fontSize={'1.5rem'}
            style={{ padding: '1rem 5rem' }}
            onClick={async () => {
              await settleFunds({
                market,
                openOrders,
                connection,
                wallet,
                baseCurrency,
                quoteCurrency,
                baseTokenAccount,
                quoteTokenAccount,
                baseUnsettled: balances[0].unsettled,
                quoteUnsettled: balances[1].unsettled,
              })
            }}
          >
            Settle All
          </BlackButton>
        </RowContainer>
      </RowContainer>
    </Container>
  )
}
