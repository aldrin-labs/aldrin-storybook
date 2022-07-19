import { Theme } from '@material-ui/core'
import useMobileSize from '@webhooks/useMobileSize'
import React, { useState, useEffect } from 'react'

import { Row, RowContainer } from '@sb/compositions/AnalyticsRoute/index.styles'
import { useConnection } from '@sb/dexUtils/connection'
import {
  useBalances,
  useMarket,
  useSelectedBaseCurrencyAccount,
  useSelectedOpenOrdersAccount,
  useSelectedQuoteCurrencyAccount,
} from '@sb/dexUtils/markets'
import { settleFunds } from '@sb/dexUtils/send'
import { useLocalStorageState } from '@sb/dexUtils/utils'
import { useWallet } from '@sb/dexUtils/wallet'

import { stripByAmount } from '@core/utils/chartPageUtils'

import CloseIcon from '@icons/blackCloseIcon.svg'

import SvgIcon from '../SvgIcon'
import {
  Container,
  Text,
  DemiText,
  BlackButton,
  TextButton,
} from '../TransactionsConfirmationWarningPopup/TransactionsConfirmationWarningPopup.styles'

export const ProposeToSettlePopup = ({ theme }: { theme: Theme }) => {
  const [isPopupOpen, setIsPopupOpen] = useLocalStorageState(
    'isSettlePopupOpen',
    true
  )
  const [isPopupTemporaryHidden, setIsPopupTemporaryHidden] = useState(false)
  const [unsettledBalances, setUnsettledBalances] = useState({
    baseUnsettled: 0,
    quoteUnsettled: 0,
  })

  const balances = useBalances()
  const connection = useConnection()
  const { wallet } = useWallet()
  const baseTokenAccount = useSelectedBaseCurrencyAccount()
  const quoteTokenAccount = useSelectedQuoteCurrencyAccount()
  const { market, baseCurrency, quoteCurrency } = useMarket()
  const openOrders = useSelectedOpenOrdersAccount()

  const isBalanceUnsettled = balances[0]?.unsettled || balances[1]?.unsettled
  const isUnsettledBalancesIncreased =
    balances[0]?.unsettled > unsettledBalances.baseUnsettled ||
    balances[1]?.unsettled > unsettledBalances.quoteUnsettled

  useEffect(() => {
    if (isUnsettledBalancesIncreased) {
      setIsPopupTemporaryHidden(false)
      setUnsettledBalances({
        baseUnsettled: balances[0]?.unsettled,
        quoteUnsettled: balances[1]?.unsettled,
      })
    }
    setIsPopupTemporaryHidden(!isBalanceUnsettled)
  }, [isBalanceUnsettled])

  const isMobile = useMobileSize()

  if (!isPopupOpen || isPopupTemporaryHidden) return null

  return (
    <Container
      showOnTheTop
      style={{
        height: isMobile ? '38.5%' : '35%',
        top: 'auto',
        bottom: '0',
        width: isMobile ? '100%' : '42%',
        left: '0',
        zIndex: '100',
        borderTopRightRadius: isMobile ? '0' : '1rem',
      }}
      direction="column"
      align="flex-start"
      justify="space-between"
      padding="6rem 4rem"
    >
      <RowContainer
        justify="space-between"
        align={isMobile ? 'center' : 'baseline'}
        direction="column"
        wrap="nowrap"
        height="100%"
      >
        <RowContainer style={{ marginBottom: '2rem' }} justify="space-between">
          {' '}
          <DemiText
            theme={theme}
            style={{
              lineHeight: '4rem',
              fontSize: '3.5rem',
              textAlign: 'left',
              fontFamily: 'Avenir Next Demi',
            }}
          >
            You have an unsettled balance.
          </DemiText>
          <SvgIcon
            src={CloseIcon}
            onClick={() => {
              setIsPopupTemporaryHidden(true)
            }}
            style={{ cursor: 'pointer', padding: '1rem' }}
            width="3.5rem"
            height="auto"
          />
        </RowContainer>

        <RowContainer
          height={isMobile ? '18%' : 'auto'}
          align="flex-start"
          justify="space-between"
        >
          <Row
            height="100%"
            direction="column"
            justify="space-between"
            align="flex-start"
          >
            <Text
              style={{
                lineHeight: '2rem',
                fontSize: isMobile ? '2.3rem' : '1.8rem',
              }}
              theme={theme}
            >
              {balances[0].coin}:{' '}
              <span style={{ fontFamily: 'Avenir Next Demi' }}>
                {stripByAmount(balances[0].unsettled)} {balances[0].coin}
              </span>
            </Text>
            <Text
              style={{
                lineHeight: '2rem',
                fontSize: isMobile ? '2.3rem' : '1.8rem',
              }}
              theme={theme}
            >
              {balances[1].coin}:{' '}
              <span style={{ fontFamily: 'Avenir Next Demi' }}>
                {stripByAmount(balances[1].unsettled)} {balances[1].coin}
              </span>
            </Text>
          </Row>
          {!isMobile && (
            <Row>
              <TextButton onClick={() => setIsPopupOpen(false)}>
                Never show again.
              </TextButton>
              <BlackButton
                disabled={false}
                hoverBackground="#20292d"
                width="auto"
                fontSize="1.5rem"
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
                    focusPopup: true,
                  })
                }}
              >
                Settle All
              </BlackButton>
            </Row>
          )}
        </RowContainer>
        {isMobile && (
          <BlackButton
            disabled={false}
            hoverBackground="#20292d"
            width="100%"
            fontSize="2rem"
            style={{ padding: '4rem 5rem' }}
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
                focusPopup: true,
              })
            }}
          >
            Settle All
          </BlackButton>
        )}
      </RowContainer>
    </Container>
  )
}
