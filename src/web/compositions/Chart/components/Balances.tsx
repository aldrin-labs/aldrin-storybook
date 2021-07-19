import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { Grid, Theme } from '@material-ui/core'

import ChartCardHeader from '@sb/components/ChartCardHeader'
import { BtnCustom } from '@sb/components/BtnCustom/BtnCustom.styles'

import {
  formatNumberToUSFormat,
  stripDigitPlaces,
} from '@core/utils/PortfolioTableUtils'

import { Key, FundsType } from '@core/types/ChartTypes'

import { addMainSymbol } from '@sb/components/index'
import { isSPOTMarketType } from '@core/utils/chartPageUtils'
import {
  importCoinIcon,
  onErrorImportCoinUrl,
} from '@core/utils/MarketCapUtils'
import UpdateFuturesBalances from '@core/components/UpdateFuturesBalances/UpdateFuturesBalances'

import DepositPopup from '@sb/compositions/Chart/components/DepositPopup'

import { CustomCard } from '@sb/compositions/Chart/Chart.styles'
import SvgIcon from '@sb/components/SvgIcon'
import RefreshBtn from '@icons/refresh.svg'

import {
  useBalances,
  useMarket,
  useTokenAccounts,
  getSelectedTokenAccountForMint,
  useUnmigratedOpenOrdersAccounts,
  useSelectedTokenAccounts,
  useSelectedQuoteCurrencyAccount,
  useSelectedBaseCurrencyAccount,
} from '@sb/dexUtils/markets'
import { useConnection } from '@sb/dexUtils/connection'
import { useBalanceInfo, useWallet } from '@sb/dexUtils/wallet'
import { settleFunds } from '@sb/dexUtils/send'
import { CCAIProviderURL } from '@sb/dexUtils/utils'
import { notify } from '@sb/dexUtils/notifications'

import { getDecimalCount } from '@sb/dexUtils/utils'
import ConnectWalletDropdown from '@sb/components/ConnectWalletDropdown/index'
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
  pair,
  theme,
  marketType,
  isDefaultTerminalViewMode,
  setShowTokenNotAdded = () => {},
}: {
  theme: Theme
  pair: string[]
  marketType: 0 | 1
  isDefaultTerminalViewMode: boolean
  setShowTokenNotAdded: (show: boolean) => void
}) => {
  const [openDepositPopup, toggleOpeningDepositPopup] = useState(false)
  const [coinForDepositPopup, chooseCoinForDeposit] = useState('')

  const balances = useBalances()
  const [accounts] = useTokenAccounts()
  const [selectedTokenAccounts] = useSelectedTokenAccounts()
  const connection = useConnection()
  const { wallet, providerUrl } = useWallet()
  const { refresh } = useUnmigratedOpenOrdersAccounts()
  const { market, baseCurrency, quoteCurrency } = useMarket()

  const baseAccount = useSelectedBaseCurrencyAccount()
  const quoteAccount = useSelectedQuoteCurrencyAccount()

  const isBaseCoinExistsInWallet = market ? baseAccount : true
  const isQuoteCoinExistsInWallet = market ? quoteAccount : true

  const balanceInfo = useBalanceInfo(wallet.publicKey)

  let { amount, decimals } = balanceInfo || {
    amount: 0,
    decimals: 8,
    mint: null,
    tokenName: 'Loading...',
    tokenSymbol: '--',
  }

  const SOLAmount = amount / Math.pow(10, decimals)

  async function onSettleSuccess() {
    console.log('settled funds success')

    setTimeout(refresh, 5000)
  }
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

    try {
      const result = await settleFunds({
        market,
        openOrders,
        connection,
        wallet,
        baseCurrencyAccount: getSelectedTokenAccountForMint(
          accounts,
          market?.baseMintAddress
        ),
        quoteCurrencyAccount: getSelectedTokenAccountForMint(
          accounts,
          market?.quoteMintAddress
        ),
        tokenAccounts: accounts,
        selectedTokenAccounts,
        baseCurrency,
        quoteCurrency,
        baseUnsettled: balances[0].unsettled,
        quoteUnsettled: balances[1].unsettled,
      })

      console.log('settleFunds result', result)

      if (!!result) {
        notify({
          message: 'Settling funds successfully done',
          description: 'No description',
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
      return
    }
    onSettleSuccess && onSettleSuccess()
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

  const quotePrecision = isQuoteUSDT ? 2 : 8

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
              {!isDefaultTerminalViewMode ? (
                <BalanceValues>
                  <BalanceValuesContainer theme={theme}>
                    <BalanceFuturesTitle theme={theme}>
                      On Wallet
                    </BalanceFuturesTitle>
                    <BalanceQuantity theme={theme}>
                      <span style={{ color: theme.palette.green.main }}>
                        {balances[0]?.wallet
                          ? balances[0].wallet.toFixed(8)
                          : (0).toFixed(8)}
                      </span>{' '}
                      {pair[0]}
                    </BalanceQuantity>
                  </BalanceValuesContainer>
                  <BalanceValuesContainer theme={theme}>
                    <BalanceFuturesTitle theme={theme}>
                      In Order
                    </BalanceFuturesTitle>
                    <BalanceQuantity theme={theme}>
                      <span style={{ color: theme.palette.green.main }}>
                        {balances[0]?.orders
                          ? balances[0].orders.toFixed(8)
                          : (0).toFixed(8)}
                      </span>{' '}
                      {pair[0]}
                    </BalanceQuantity>
                  </BalanceValuesContainer>
                </BalanceValues>
              ) : (
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
              )}
              <div
                style={{
                  display: 'flex',
                  justifyContent: !showSettle ? 'flex-start' : 'space-between',
                  width: '100%',
                  padding: '0 0.5rem',
                }}
              >
                {!wallet.connected ? null : isBaseCoinExistsInWallet ? (
                  !isDefaultTerminalViewMode ? null : ( // /> //   containerStyle={{ padding: '0' }} //   id={'connectButtonBase'} //   height={'2rem'} //   showOnTop={true} //   theme={theme} // <ConnectWalletDropdown
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
                          onClick={() => {
                            const { market, openOrders } = baseBalances
                            onSettleFunds(market, openOrders)
                          }}
                        >
                          settle
                        </BtnCustom>
                      )}
                    </>
                  )
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
              {!isDefaultTerminalViewMode ? (
                <BalanceValues>
                  <BalanceValuesContainer theme={theme}>
                    <BalanceFuturesTitle theme={theme}>
                      On Wallet
                    </BalanceFuturesTitle>
                    <BalanceQuantity theme={theme}>
                      <span style={{ color: theme.palette.green.main }}>
                        {balances[1]?.wallet
                          ? balances[1].wallet.toFixed(quotePrecision)
                          : (0).toFixed(quotePrecision)}
                      </span>{' '}
                      {pair[1]}
                    </BalanceQuantity>
                  </BalanceValuesContainer>
                  <BalanceValuesContainer theme={theme}>
                    <BalanceFuturesTitle theme={theme}>
                      In Order
                    </BalanceFuturesTitle>
                    <BalanceQuantity theme={theme}>
                      <span style={{ color: theme.palette.green.main }}>
                        {balances[1]?.orders
                          ? balances[1].orders.toFixed(quotePrecision)
                          : (0).toFixed(quotePrecision)}
                      </span>{' '}
                      {pair[1]}
                    </BalanceQuantity>
                  </BalanceValuesContainer>
                </BalanceValues>
              ) : (
                <BalanceValues>
                  <BalanceValuesContainer theme={theme}>
                    <BalanceFuturesTitle theme={theme}>
                      {pair[1]} Wallet
                    </BalanceFuturesTitle>
                    <BalanceQuantity theme={theme}>
                      {balances[1]?.wallet
                        ? balances[1].wallet.toFixed(quotePrecision)
                        : (0).toFixed(quotePrecision)}
                    </BalanceQuantity>
                  </BalanceValuesContainer>
                  <BalanceValuesContainer theme={theme}>
                    <BalanceFuturesTitle theme={theme}>
                      {pair[0]} Unsettled
                    </BalanceFuturesTitle>
                    <BalanceQuantity theme={theme}>
                      {balances[1]?.unsettled
                        ? balances[1].unsettled.toFixed(quotePrecision)
                        : (0).toFixed(quotePrecision)}
                    </BalanceQuantity>
                  </BalanceValuesContainer>
                </BalanceValues>
              )}
              <div
                style={{
                  display: 'flex',
                  justifyContent: !showSettle ? 'flex-start' : 'space-between',
                  width: '100%',
                  padding: '0 0.5rem',
                }}
              >
                {!wallet.connected ? null : isQuoteCoinExistsInWallet ? (
                  !isDefaultTerminalViewMode ? (
                    <RowContainer
                      padding={'.4rem 0'}
                      style={{
                        background: theme.palette.green.main,
                        borderRadius: '.6rem',
                      }}
                    >
                      <span
                        style={{
                          color: theme.palette.white.background,
                          fontFamily: 'Avenir Next',
                          fontSize: '1.4rem',
                        }}
                      >
                        {formatNumberToUSFormat(stripDigitPlaces(SOLAmount, 3))}{' '}
                        <span style={{ fontFamily: 'Avenir Next Demi' }}>
                          SOL
                        </span>
                      </span>
                    </RowContainer>
                  ) : (
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
                          onClick={() => {
                            const { market, openOrders } = quoteBalances
                            onSettleFunds(market, openOrders)
                          }}
                        >
                          settle
                        </BtnCustom>
                      )}
                    </>
                  )
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
