import { Grid, Theme } from '@material-ui/core'
import React, { useState } from 'react'
import styled, { useTheme } from 'styled-components'

import { Button } from '@sb/components/Button'
import ChartCardHeader from '@sb/components/ChartCardHeader'
import { Loading } from '@sb/components/Loading/Loading'
import { RowContainer } from '@sb/compositions/AnalyticsRoute/index.styles'
import { CustomCard } from '@sb/compositions/Chart/Chart.styles'
import DepositPopup from '@sb/compositions/Chart/components/DepositPopup'
import { useConnection } from '@sb/dexUtils/connection'
import {
  useBalances,
  useMarket,
  useSelectedBaseCurrencyAccount,
  useSelectedQuoteCurrencyAccount,
} from '@sb/dexUtils/markets'
import { notify } from '@sb/dexUtils/notifications'
import { settleFunds } from '@sb/dexUtils/send'
import { RINProviderURL, formatNumberWithSpaces } from '@sb/dexUtils/utils'
import { useWallet } from '@sb/dexUtils/wallet'

import { Key, FundsType } from '@core/types/ChartTypes'

export const BalanceTitle = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-top: 0.6rem;
  padding: 0 0.4rem;
  border-radius: 0.8rem;
`

export const BalanceValues = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  margin-top: 0;
  padding: 0 0.5rem;
  text-align: left;
`

export const BalanceQuantity = styled.span`
  color: ${(props) => props.theme.colors.gray1};
  font-size: 1.2rem;
  font-family: Avenir Next Demi;
  letter-spacing: 0.01rem;

  text-align: left;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  width: 100%;
`

export const BalanceValue = styled.span`
  font-size: 1rem;
  color: #29ac80;
`

export const BalanceSymbol = styled.span`
  color: #7284a0;
  font-size: 1.2rem;
  font-weight: bold;
`

export const BalanceFuturesContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 33%;
  padding: 0.8rem 0;
  border-bottom: ${(props) => props.theme.palette.border.main};

  ${({ needBorder }: { needBorder?: boolean }) =>
    needBorder &&
    'border-top: .1rem solid #e0e5ec; border-bottom: .1rem solid #e0e5ec;'}
`

export const BalanceFuturesTypography = styled.span`
  font-size: 1.2rem;
  font-family: Avenir Next Demi;
  padding: 0 0 0.35rem 0;
  letter-spacing: 0.01rem;
  text-transform: capitalize;
`

export const BalanceFuturesTitle = styled(BalanceFuturesTypography)`
  color: ${(props) => props.theme.colors.gray0};
`

export const BalanceFuturesValue = styled(BalanceFuturesTypography)`
  color: ${(props) => props.theme.palette.dark.main};
`

export const BalanceFuturesSymbol = styled(BalanceFuturesTypography)`
  color: ${(props) => props.theme.palette.dark.main};
`

const BalanceValuesContainer = styled(RowContainer)`
  padding: 0.4rem;
  background: ${(props) => props.theme.colors.gray5};
  border-radius: 0.4rem;
  justify-content: flex-start;
  margin-bottom: ${(props) => (props.needMargin ? '0.8rem' : '0')};
`

export const Balances = ({
  getFundsQuery,
  pair,
  theme,
  marketType,
  selectedKey,
  showFuturesTransfer = false,
  timerForFuturesWars = {},
  isAlreadyJoined = false,
  isFuturesWarsKey = false,
  futuresWarsRoundBet = 0,
  setShowTokenNotAdded = () => {},
}: {
  getFundsQuery: {
    getFunds: FundsType[]
  }
  theme: Theme
  pair: string[]
  marketType: 0 | 1
  selectedKey: Key
  showFuturesTransfer: boolean
  timerForFuturesWars: {
    isEnabled: boolean
    startedAt: number
  }
  isAlreadyJoined: boolean
  isFuturesWarsKey: boolean
  futuresWarsRoundBet: number
  setShowTokenNotAdded: (show: boolean) => void
}) => {
  const [openDepositPopup, toggleOpeningDepositPopup] = useState(false)
  const [showLoading, setShowLoading] = useState(false)
  const [coinForDepositPopup, chooseCoinForDeposit] = useState('')

  const balances = useBalances()
  const connection = useConnection()

  const newTheme = useTheme()

  const { wallet, providerUrl } = useWallet()
  const { market, baseCurrency, quoteCurrency } = useMarket()

  const baseTokenAccount = useSelectedBaseCurrencyAccount()
  const quoteTokenAccount = useSelectedQuoteCurrencyAccount()

  const isBaseCoinExistsInWallet = market ? baseTokenAccount : true
  const isQuoteCoinExistsInWallet = market ? quoteTokenAccount : true

  async function onSettleFunds(market, openOrders) {
    if (!wallet.connected) {
      notify({
        message: 'Please, connect your wallet first.',
        type: 'error',
      })

      wallet.connect()

      return
    }

    if (balances[0].unsettled === 0 && balances[1].unsettled === 0) {
      notify({
        message: 'You have no funds to settle.',
        type: 'error',
      })

      return
    }
    setShowLoading(true)
    // add loading

    try {
      const result = await settleFunds({
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

      console.log('settleFunds result', result)

      if (result) {
        notify({
          message: 'Settling funds successfully done',
          type: 'success',
        })
      }
    } catch (e) {
      console.log('onSettleFunds e', e)
      notify({
        message: 'Insufficient SOL balance for settling.',
        description: e.message,
        type: 'error',
      })
      // remove loading
      setShowLoading(false)
      return
    }

    // remove loading
    setShowLoading(false)
  }

  const [baseBalances, quoteBalances] = balances
  const isCCAIWallet = providerUrl === RINProviderURL
  const showSettle = !wallet.connected || !wallet.autoApprove
  const quote = pair[1].toUpperCase()
  const isQuoteUSDT =
    quote === 'USDT' ||
    quote === 'USDC' ||
    quote === 'WUSDT' ||
    quote === 'WUSDC'

  return (
    <>
      <DepositPopup
        open={openDepositPopup}
        handleClose={() => {
          toggleOpeningDepositPopup(false)
          chooseCoinForDeposit('')
        }}
        baseOrQuote={coinForDepositPopup}
      />
      <CustomCard
        data-tut="balances"
        style={{ borderRight: 'none', borderTop: '0' }}
      >
        <ChartCardHeader
          padding="0.6rem 0"
          style={{
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'center',
            padding: '0.5rem 0',
          }}
        >
          Balances
        </ChartCardHeader>
        <Grid
          container
          xs={12}
          direction="column"
          wrap="nowrap"
          style={{
            height: 'calc(100% - 3rem)',
            padding: '0 .8rem .4rem .8rem',
            overflowY: 'auto',
          }}
        >
          <>
            <Grid
              item
              container
              direction="column"
              justify="center"
              align="flex-start"
              xs={6}
              style={{
                borderBottom: newTheme.colors.border,
                maxWidth: '100%',
              }}
            >
              {/* <BalanceTitle>
                <BalanceSymbol>{pair[0]}</BalanceSymbol>
                <SvgIcon
                  width={`1.5rem`}
                  height={`1.5rem`}
                  src={importCoinIcon(pair[0])}
                  onError={onErrorImportCoinUrl}
                />
              </BalanceTitle> */}
              <BalanceValues>
                <BalanceValuesContainer needMargin>
                  <BalanceFuturesTitle>{pair[0]} Wallet</BalanceFuturesTitle>
                  <BalanceQuantity>
                    {balances[0]?.wallet
                      ? formatNumberWithSpaces(balances[0].wallet.toFixed(8))
                      : (0).toFixed(8)}
                  </BalanceQuantity>
                </BalanceValuesContainer>
                <BalanceValuesContainer
                  needMargin={
                    wallet.connected &&
                    (showSettle || !isBaseCoinExistsInWallet)
                  }
                >
                  <BalanceFuturesTitle>{pair[0]} Unsettled</BalanceFuturesTitle>
                  <BalanceQuantity>
                    {balances[0]?.unsettled
                      ? formatNumberWithSpaces(balances[0].unsettled.toFixed(8))
                      : (0).toFixed(8)}
                  </BalanceQuantity>
                </BalanceValuesContainer>
              </BalanceValues>
              <div
                style={{
                  display: 'flex',
                  justifyContent: !showSettle ? 'flex-start' : 'space-between',
                  width: '100%',
                  padding: '0 0.5rem',
                }}
              >
                {!wallet.connected ? null : (
                  <>
                    {!isBaseCoinExistsInWallet ? (
                      <Button
                        $variant="primary"
                        $fontSize="lg"
                        $padding="sm"
                        $width="xl"
                        onClick={() => {
                          setShowTokenNotAdded(true)
                        }}
                      >
                        Add to the wallet
                      </Button>
                    ) : (
                      showSettle && (
                        <Button
                          $variant="primary"
                          $fontSize="lg"
                          $padding="sm"
                          $width="xl"
                          disabled={showLoading}
                          onClick={() => {
                            const { market, openOrders } = baseBalances
                            onSettleFunds(market, openOrders)
                          }}
                        >
                          {showLoading ? (
                            <Loading centerAligned color="#fff" size="1rem" />
                          ) : (
                            'settle'
                          )}
                        </Button>
                      )
                    )}
                  </>
                )}
              </div>
            </Grid>
            <Grid
              container
              direction="column"
              justify="center"
              item
              xs={6}
              style={{ maxWidth: '100%' }}
            >
              {/* <BalanceTitle>
                <BalanceSymbol>{pair[1]}</BalanceSymbol>
                <SvgIcon
                  width={`1.5rem`}
                  height={`1.5rem`}
                  src={importCoinIcon(pair[1])}
                  onError={onErrorImportCoinUrl}
                />
              </BalanceTitle> */}
              <BalanceValues>
                <BalanceValuesContainer needMargin>
                  <BalanceFuturesTitle>{pair[1]} Wallet</BalanceFuturesTitle>
                  <BalanceQuantity>
                    {balances[1]?.wallet
                      ? formatNumberWithSpaces(
                          balances[1].wallet.toFixed(isQuoteUSDT ? 2 : 8)
                        )
                      : (0).toFixed(isQuoteUSDT ? 2 : 8)}
                  </BalanceQuantity>
                </BalanceValuesContainer>
                <BalanceValuesContainer
                  needMargin={
                    wallet.connected &&
                    (showSettle || isQuoteCoinExistsInWallet)
                  }
                >
                  <BalanceFuturesTitle>{pair[1]} Unsettled</BalanceFuturesTitle>
                  <BalanceQuantity>
                    {balances[1]?.unsettled
                      ? formatNumberWithSpaces(
                          balances[1].unsettled.toFixed(isQuoteUSDT ? 2 : 8)
                        )
                      : (0).toFixed(isQuoteUSDT ? 2 : 8)}
                  </BalanceQuantity>
                </BalanceValuesContainer>
              </BalanceValues>
              <div
                style={{
                  display: 'flex',
                  justifyContent: !showSettle ? 'flex-start' : 'space-between',
                  width: '100%',
                  padding: '0 0.5rem',
                }}
              >
                {!wallet.connected ? null : (
                  <>
                    {!isQuoteCoinExistsInWallet ? (
                      <Button
                        $variant="primary"
                        $fontSize="lg"
                        $padding="sm"
                        $width="xl"
                        onClick={() => {
                          setShowTokenNotAdded(true)
                        }}
                      >
                        Add to the wallet
                      </Button>
                    ) : (
                      showSettle && (
                        <Button
                          $variant="primary"
                          $fontSize="lg"
                          $padding="sm"
                          $width="xl"
                          disabled={showLoading}
                          onClick={() => {
                            const { market, openOrders } = quoteBalances
                            onSettleFunds(market, openOrders)
                          }}
                        >
                          {showLoading ? (
                            <Loading centerAligned color="#fff" size="1rem" />
                          ) : (
                            'settle'
                          )}
                        </Button>
                      )
                    )}
                  </>
                )}
              </div>
            </Grid>
          </>
        </Grid>
      </CustomCard>
    </>
  )
}
