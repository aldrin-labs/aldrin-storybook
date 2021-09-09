import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { Grid, Theme } from '@material-ui/core'

import ChartCardHeader from '@sb/components/ChartCardHeader'
import { BtnCustom } from '@sb/components/BtnCustom/BtnCustom.styles'

import { Key, FundsType } from '@core/types/ChartTypes'
import DepositPopup from '@sb/compositions/Chart/components/DepositPopup'

import { CustomCard } from '@sb/compositions/Chart/Chart.styles'
import SvgIcon from '@sb/components/SvgIcon'
import RefreshBtn from '@icons/refresh.svg'

import {
  useBalances,
  useMarket,
  useSelectedBaseCurrencyAccount,
  useSelectedQuoteCurrencyAccount,
} from '@sb/dexUtils/markets'
import { useConnection } from '@sb/dexUtils/connection'
import { useWallet } from '@sb/dexUtils/wallet'
import { settleFunds } from '@sb/dexUtils/send'
import { CCAIProviderURL } from '@sb/dexUtils/utils'
import { notify } from '@sb/dexUtils/notifications'

import { Loading } from '@sb/components/Loading/Loading'
import { RowContainer } from '@sb/compositions/AnalyticsRoute/index.styles'

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
  color: ${(props) => props.theme.palette.dark.main};
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
  color: ${(props) => props.theme.palette.grey.text};
`

export const BalanceFuturesValue = styled(BalanceFuturesTypography)`
  color: ${(props) => props.theme.palette.dark.main};
`

export const BalanceFuturesSymbol = styled(BalanceFuturesTypography)`
  color: ${(props) => props.theme.palette.dark.main};
`

const BalanceValuesContainer = styled(RowContainer)`
  padding: 0.4rem;
  background: ${(props) => props.theme.palette.grey.terminal};
  border-radius: 0.4rem;
  justify-content: flex-start;
  margin-bottom: 0.8rem;
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

      if (!!result) {
        notify({
          message: 'Settling funds successfully done',
          type: 'success',
        })
      }
    } catch (e) {
      console.log('onSettleFunds e', e)
      notify({
        message: 'Error settling funds',
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
  const isCCAIWallet = providerUrl === CCAIProviderURL
  const showSettle = !isCCAIWallet || !wallet.connected || !wallet.autoApprove
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
        theme={theme}
        style={{ borderRight: 'none', borderTop: '0' }}
      >
        <ChartCardHeader
          padding={'0.6rem 0'}
          theme={theme}
          style={{
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'center',
            paddingLeft: '2rem',
          }}
        >
          Balances
          <SvgIcon
            src={RefreshBtn}
            style={{ cursor: 'pointer' }}
            width="15%"
            height="auto"
            onClick={async () => {
              await baseBalances.refreshBase()
              await quoteBalances.refreshQuote()
              await notify(
                wallet.connected
                  ? {
                      message: 'Your balances successfully updated',
                      type: 'success',
                    }
                  : { message: 'Connect your wallet first', type: 'error' }
              )
            }}
          />
        </ChartCardHeader>
        <Grid
          container
          xs={12}
          direction="column"
          wrap={'nowrap'}
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
                borderBottom: theme.palette.border.main,
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
                <BalanceValuesContainer theme={theme}>
                  <BalanceFuturesTitle theme={theme}>
                    {pair[0]} Wallet
                  </BalanceFuturesTitle>
                  <BalanceQuantity theme={theme}>
                    {balances[0]?.wallet
                      ? balances[0].wallet.toFixed(8)
                      : (0).toFixed(8)}
                  </BalanceQuantity>
                </BalanceValuesContainer>
                <BalanceValuesContainer theme={theme}>
                  <BalanceFuturesTitle theme={theme}>
                    {pair[0]} Unsettled
                  </BalanceFuturesTitle>
                  <BalanceQuantity theme={theme}>
                    {balances[0]?.unsettled
                      ? balances[0].unsettled.toFixed(8)
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
                {!wallet.connected ? null : isBaseCoinExistsInWallet ? ( // /> //   containerStyle={{ padding: '0' }} //   id={'connectButtonBase'} //   height={'2rem'} //   showOnTop={true} //   theme={theme} // <ConnectWalletDropdown
                  <>
                    <BtnCustom
                      btnWidth={!showSettle ? '100%' : 'calc(50% - .25rem)'}
                      height="auto"
                      fontSize=".8rem"
                      padding=".5rem 0 .4rem 0;"
                      borderRadius=".8rem"
                      btnColor={theme.palette.dark.main}
                      borderColor={theme.palette.blue.serum}
                      backgroundColor={theme.palette.blue.serum}
                      transition={'all .4s ease-out'}
                      onClick={() => {
                        toggleOpeningDepositPopup(true)
                        chooseCoinForDeposit('base')
                      }}
                    >
                      deposit
                    </BtnCustom>
                    {showSettle && (
                      <BtnCustom
                        btnWidth={'calc(50% - .25rem)'}
                        height="auto"
                        fontSize=".8rem"
                        padding=".5rem 0 .4rem 0;"
                        borderRadius=".8rem"
                        btnColor={theme.palette.dark.main}
                        borderColor={theme.palette.blue.serum}
                        backgroundColor={theme.palette.blue.serum}
                        // hoverBackground="#3992a9"
                        transition={'all .4s ease-out'}
                        disabled={showLoading}
                        onClick={() => {
                          const { market, openOrders } = baseBalances
                          onSettleFunds(market, openOrders)
                        }}
                      >
                        {showLoading ? (
                          <Loading
                            centerAligned={true}
                            color={'#fff'}
                            size={'1rem'}
                          />
                        ) : (
                          'settle'
                        )}
                      </BtnCustom>
                    )}
                  </>
                ) : (
                  <BtnCustom
                    btnWidth="100%"
                    height="auto"
                    fontSize=".8rem"
                    padding=".5rem 0 .4rem 0;"
                    borderRadius=".8rem"
                    btnColor={theme.palette.dark.main}
                    borderColor={theme.palette.blue.serum}
                    backgroundColor={theme.palette.blue.serum}
                    // hoverBackground="#3992a9"
                    transition={'all .4s ease-out'}
                    onClick={() => {
                      setShowTokenNotAdded(true)
                    }}
                  >
                    Add to the wallet
                  </BtnCustom>
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
                <BalanceValuesContainer theme={theme}>
                  <BalanceFuturesTitle theme={theme}>
                    {pair[1]} Wallet
                  </BalanceFuturesTitle>
                  <BalanceQuantity theme={theme}>
                    {balances[1]?.wallet
                      ? balances[1].wallet.toFixed(isQuoteUSDT ? 2 : 8)
                      : (0).toFixed(isQuoteUSDT ? 2 : 8)}
                  </BalanceQuantity>
                </BalanceValuesContainer>
                <BalanceValuesContainer theme={theme}>
                  <BalanceFuturesTitle theme={theme}>
                    {pair[1]} Unsettled
                  </BalanceFuturesTitle>
                  <BalanceQuantity theme={theme}>
                    {balances[1]?.unsettled
                      ? balances[1].unsettled.toFixed(isQuoteUSDT ? 2 : 8)
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
                {!wallet.connected ? null : isQuoteCoinExistsInWallet ? (
                  <>
                    <BtnCustom
                      btnWidth={!showSettle ? '100%' : 'calc(50% - .25rem)'}
                      height="auto"
                      fontSize=".8rem"
                      padding=".5rem 0 .4rem 0;"
                      borderRadius=".8rem"
                      btnColor={theme.palette.dark.main}
                      borderColor={theme.palette.blue.serum}
                      backgroundColor={theme.palette.blue.serum}
                      transition={'all .4s ease-out'}
                      onClick={() => {
                        toggleOpeningDepositPopup(true)
                        chooseCoinForDeposit('quote')
                      }}
                    >
                      deposit
                    </BtnCustom>
                    {showSettle && (
                      <BtnCustom
                        btnWidth={'calc(50% - .25rem)'}
                        height="auto"
                        fontSize=".8rem"
                        padding=".5rem 0 .4rem 0;"
                        borderRadius=".8rem"
                        btnColor={theme.palette.dark.main}
                        borderColor={theme.palette.blue.serum}
                        backgroundColor={theme.palette.blue.serum}
                        transition={'all .4s ease-out'}
                        disabled={showLoading}
                        onClick={() => {
                          const { market, openOrders } = quoteBalances
                          onSettleFunds(market, openOrders)
                        }}
                      >
                        {showLoading ? (
                          <Loading
                            centerAligned={true}
                            color={'#fff'}
                            size={'1rem'}
                          />
                        ) : (
                          'settle'
                        )}
                      </BtnCustom>
                    )}
                  </>
                ) : (
                  <BtnCustom
                    btnWidth="100%"
                    height="auto"
                    fontSize=".8rem"
                    padding=".5rem 0 .4rem 0;"
                    borderRadius=".8rem"
                    btnColor={theme.palette.dark.main}
                    borderColor={theme.palette.blue.serum}
                    backgroundColor={theme.palette.blue.serum}
                    // hoverBackground="#3992a9"
                    transition={'all .4s ease-out'}
                    onClick={() => {
                      setShowTokenNotAdded(true)
                    }}
                  >
                    Add to the wallet
                  </BtnCustom>
                )}
              </div>
            </Grid>
          </>
        </Grid>
      </CustomCard>
    </>
  )
}
