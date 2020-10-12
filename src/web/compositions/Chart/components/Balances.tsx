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

import TransferPopup from '@sb/compositions/Chart/components/TransferPopup'
import DepositPopup from '@sb/compositions/Chart/components/DepositPopup'

import { CustomCard } from '@sb/compositions/Chart/Chart.styles'
import SvgIcon from '@sb/components/SvgIcon'

import { useBalances, useMarket,  useTokenAccounts,
  getSelectedTokenAccountForMint, useUnmigratedOpenOrdersAccounts } from '@sb/dexUtils/markets'
import { useSendConnection } from '@sb/dexUtils/connection';
import { useWallet } from '@sb/dexUtils/wallet';
import { settleFunds } from '@sb/dexUtils/send';
import { notify } from '@sb/dexUtils/notifications';

import {
  getDecimalCount
} from '@sb/dexUtils/utils'

export const BalanceTitle = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-top: 0.8rem;
  padding: 0 0.5rem;
  border-radius: 0.8rem;
`

export const BalanceValues = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  margin-top: 0;
  padding: 0 0.5rem 1rem;
  text-align: left;
`

export const BalanceQuantity = styled.span`
  color: ${props => props.theme.palette.dark.main};
  font-size: 1rem;
  font-weight: bold;
  letter-spacing: 0.075rem;

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
  font-size: .9rem;
  font-weight: bold;
  padding: 1rem 0 0.35rem 0;
  letter-spacing: 0.1rem;
  text-transform: uppercase;
  text-align: left;
`

export const BalanceFuturesTitle = styled(BalanceFuturesTypography)`
  margin: 0 auto 0 0;
  color: ${(props) => props.theme.palette.grey.text};
`

export const BalanceFuturesValue = styled(BalanceFuturesTypography)`
  color: ${(props) => props.theme.palette.dark.main};
`

export const BalanceFuturesSymbol = styled(BalanceFuturesTypography)`
  color: ${(props) => props.theme.palette.dark.main};
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
}) => {
  const [loading, setLoading] = useState(false)
  const [open, togglePopup] = useState(false)
  const [transferFromSpotToFutures, setTransferFromSpotToFutures] = useState(
    false
  )
  const [openDepositPopup, toggleOpeningDepositPopup] = useState(false)
  const [coinForDepositPopup, chooseCoinForDeposit] = useState('')

  const { market } = useMarket()
  const balances = useBalances()
  const [accounts] = useTokenAccounts();
  const connection = useSendConnection();
  const { wallet } = useWallet();
  const { refresh } = useUnmigratedOpenOrdersAccounts();


  async function onSettleSuccess() { 
    console.log('settled funds success');
    setTimeout(refresh, 5000);
   }

  async function onSettleFunds(market, openOrders) {
    try {
      await settleFunds({
        market,
        openOrders,
        connection,
        wallet,
        baseCurrencyAccount: getSelectedTokenAccountForMint(
          accounts,
          market?.baseMintAddress,
        ),
        quoteCurrencyAccount: getSelectedTokenAccountForMint(
          accounts,
          market?.quoteMintAddress,
        ),
      });

      notify({
        message: 'Settling funds successfully done',
        description: 'No description',
        type: 'success',
      });

    } catch (e) {
      console.log('onSettleFunds e', e)
      notify({
        message: 'Error settling funds',
        description: e.message,
        type: 'error',
      });
      return;
    }
    onSettleSuccess && onSettleSuccess();
  }

  const [baseBalances, quoteBalances] = balances

  let pricePrecision = market?.tickSize && getDecimalCount(market.tickSize);
  let quantityPrecision = market?.minOrderSize && getDecimalCount(market.minOrderSize);

  // getting values for the trading terminal pair
  const funds = pair.map((coin, index) => {
    const asset = getFundsQuery.getFunds.find(
      (el) => el.asset.symbol === pair[index] && el.assetType === marketType
    )
    const quantity = asset !== undefined ? asset.free : 0
    const value = asset !== undefined ? asset.free * asset.asset.priceUSD : 0

    return { quantity, value }
  })

  const [
    USDTFuturesFund = { free: 0, locked: 0, quantity: 0 },
  ] = getFundsQuery.getFunds.filter(
    (el) => +el.assetType === 1 && el.asset.symbol === 'USDT'
  )

  const isSPOTMarket = isSPOTMarketType(marketType)

  return (
    <>
      <TransferPopup
        open={open}
        theme={theme}
        handleClose={() => togglePopup(false)}
        transferFromSpotToFutures={transferFromSpotToFutures}
        selectedAccount={selectedKey.keyId}
        showFuturesTransfer={showFuturesTransfer}
        isFuturesWarsKey={isFuturesWarsKey}
        futuresWarsRoundBet={futuresWarsRoundBet}
        timerForFuturesWars={timerForFuturesWars}
        loading={loading}
        setLoading={setLoading}
      />
      <DepositPopup
        open={openDepositPopup}
        handleClose={() => { toggleOpeningDepositPopup(false); chooseCoinForDeposit('') }}
        baseOrQuote={coinForDepositPopup}

      />
      <CustomCard theme={theme} style={{ borderRight: 'none', borderTop: '0' }}>
        <ChartCardHeader
          theme={theme}
          style={{
            display: 'flex',
            justifyContent: 'flex-start',
            alignItems: 'center',
            paddingLeft: '2rem',
          }}
        >
          <>
            Balances{' '}
            {!isSPOTMarket && (
              <UpdateFuturesBalances keyId={selectedKey.keyId} />
            )}
          </>
        </ChartCardHeader>
        <Grid
          container
          xs={12}
          direction="column"
          wrap={'nowrap'}
          style={{
            height: 'calc(100% - 5rem)',
            padding: '0 .8rem',
            overflowY: 'scroll',
          }}
        >
          {isSPOTMarket ? (
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
                <BalanceTitle>
                  <BalanceSymbol>{pair[0]}</BalanceSymbol>
                  <SvgIcon
                    width={`1.7rem`}
                    height={`1.7rem`}
                    src={importCoinIcon(pair[0])}
                    onError={onErrorImportCoinUrl}
                  />
                </BalanceTitle>
                <BalanceValues>
                  <BalanceFuturesTitle theme={theme}>
                    Wallet balance
                    </BalanceFuturesTitle>
                  <BalanceQuantity theme={theme}>
                    {balances[0]?.wallet ? stripDigitPlaces(balances[0].wallet, 8) : 0} {pair[0]}
                  </BalanceQuantity>
                  <BalanceFuturesTitle theme={theme}>
                    Unsettled balance
                    </BalanceFuturesTitle>
                  <BalanceQuantity theme={theme}>
                    {balances[0]?.wallet ? stripDigitPlaces(balances[0].unsettled, 8) : 0} {pair[0]}
                  </BalanceQuantity>
                </BalanceValues>
                <div
                
                        style={{
                          display: 'flex',
                          justifyContent: 'space-evenly',
                          width: '100%',
                          paddingBottom: '0.8rem',
                        }}
                      >
                        <BtnCustom
                          btnWidth="45%"
                          height="auto"
                          fontSize=".8rem"
                          padding=".5rem 0 .4rem 0;"
                          borderRadius=".8rem"
                          btnColor={theme.palette.white.background}
                          backgroundColor="#57bc7c"
                          hoverColor={theme.palette.white.background}
                          hoverBackground="#50ad72"
                          transition={'all .4s ease-out'}
                          onClick={() => {
                            toggleOpeningDepositPopup(true);
                            chooseCoinForDeposit('base')
                          }}
                        >
                          deposit
                      </BtnCustom>
                        <BtnCustom
                          btnWidth="45%"
                          height="auto"
                          fontSize=".8rem"
                          padding=".5rem 0 .4rem 0;"
                          borderRadius=".8rem"
                          btnColor={theme.palette.white.background}
                          backgroundColor="#46adc7"
                          hoverColor={theme.palette.white.background}
                          hoverBackground="#3992a9"
                          transition={'all .4s ease-out'}
                          onClick={() => {
                            const { market, openOrders } = baseBalances
                            onSettleFunds(market, openOrders)
                          }}
                        >
                          settle
                      </BtnCustom>
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
                <BalanceTitle>
                  <BalanceSymbol>{pair[1]}</BalanceSymbol>
                  <SvgIcon
                    width={`1.7rem`}
                    height={`1.7rem`}
                    src={importCoinIcon(pair[1])}
                    onError={onErrorImportCoinUrl}
                  />
                </BalanceTitle>
                <BalanceValues>
                  <BalanceFuturesTitle theme={theme}>
                    Wallet balance
                    </BalanceFuturesTitle>
                  <BalanceQuantity theme={theme}>
                    {balances[1]?.wallet ? stripDigitPlaces(balances[1].wallet, 8) : 0} {pair[1]}
                  </BalanceQuantity>
                  <BalanceFuturesTitle theme={theme}>
                    Unsettled balance
                    </BalanceFuturesTitle>
                  <BalanceQuantity theme={theme}>
                    {balances[1]?.unsettled ? stripDigitPlaces(balances[1].unsettled, 8) : 0} {pair[1]}
                  </BalanceQuantity>
                </BalanceValues>
                <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-evenly',
                          width: '100%',
                        }}
                      >
                        <BtnCustom
                          btnWidth="45%"
                          height="auto"
                          fontSize=".8rem"
                          padding=".5rem 0 .4rem 0;"
                          borderRadius=".8rem"
                          btnColor={theme.palette.white.background}
                          backgroundColor="#57bc7c"
                          hoverColor={theme.palette.white.background}
                          hoverBackground="#50ad72"
                          transition={'all .4s ease-out'}
                          onClick={() => {
                            toggleOpeningDepositPopup(true);
                            chooseCoinForDeposit('quote')
                          }}
                        >
                          deposit
                      </BtnCustom>
                        <BtnCustom
                          btnWidth="45%"
                          height="auto"
                          fontSize=".8rem"
                          padding=".5rem 0 .4rem 0;"
                          borderRadius=".8rem"
                          btnColor={theme.palette.white.background}
                          backgroundColor="#46adc7"
                          hoverColor={theme.palette.white.background}
                          hoverBackground="#3992a9"
                          transition={'all .4s ease-out'}
                          onClick={() => {
                            const { market, openOrders } = quoteBalances
                            onSettleFunds(market, openOrders)
                          }}
                        >
                          settle
                      </BtnCustom>
                      </div>
              </Grid>
            </>
          ) : (
              <>
                <Grid
                  item
                  xs={9}
                  container
                  alignItems="center"
                  justify="flex-start"
                  style={{ maxWidth: '100%' }}
                >
                  <div style={{ height: '100%', width: '100%' }}>
                    <BalanceFuturesContainer theme={theme}>
                      <BalanceFuturesTitle theme={theme}>
                        Wallet balance
                    </BalanceFuturesTitle>
                      <BalanceFuturesValue theme={theme}>
                        <span style={{ color: theme.palette.blue.main }}>
                          {stripDigitPlaces(USDTFuturesFund.quantity)}
                        </span>{' '}
                        <BalanceFuturesSymbol theme={theme}>
                          USDT
                      </BalanceFuturesSymbol>
                      </BalanceFuturesValue>
                    </BalanceFuturesContainer>
                    <BalanceFuturesContainer theme={theme}>
                      <BalanceFuturesTitle theme={theme}>
                        Availiable
                    </BalanceFuturesTitle>
                      <BalanceFuturesValue theme={theme}>
                        <span style={{ color: theme.palette.blue.main }}>
                          {stripDigitPlaces(USDTFuturesFund.free)}
                        </span>{' '}
                        <BalanceFuturesSymbol theme={theme}>
                          USDT
                      </BalanceFuturesSymbol>
                      </BalanceFuturesValue>
                    </BalanceFuturesContainer>
                  </div>
                </Grid>
                <Grid
                  item
                  xs={3}
                  container
                  direction="column"
                  alignItems="center"
                  justify="space-evenly"
                  style={{
                    maxWidth: '100%',
                    borderTop: theme.palette.border.main,
                  }}
                >
                  {isFuturesWarsKey && (
                    <BtnCustom
                      disabled={isAlreadyJoined}
                      btnWidth="100%"
                      height="auto"
                      fontSize=".8rem"
                      padding="1rem 0 .8rem 0;"
                      borderRadius=".8rem"
                      btnColor={theme.palette.blue.main}
                      backgroundColor={theme.palette.white.background}
                      hoverColor={theme.palette.white.background}
                      hoverBackground={theme.palette.blue.main}
                      transition={'all .4s ease-out'}
                      onClick={() => {
                        togglePopup(true)
                      }}
                    >
                      {isAlreadyJoined ? 'Joined' : `Join`}
                    </BtnCustom>
                  )}
                  {!isFuturesWarsKey && (
                    <>
                      <BalanceFuturesTitle theme={theme}>
                        transfer
                    </BalanceFuturesTitle>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-evenly',
                          width: '100%',
                          paddingBottom: '0.8rem',
                        }}
                      >
                        <BtnCustom
                          btnWidth="45%"
                          height="auto"
                          fontSize=".8rem"
                          padding=".5rem 0 .4rem 0;"
                          borderRadius=".8rem"
                          btnColor={theme.palette.blue.main}
                          backgroundColor={theme.palette.white.background}
                          hoverColor={theme.palette.white.background}
                          hoverBackground={theme.palette.blue.main}
                          transition={'all .4s ease-out'}
                          onClick={() => {
                            setTransferFromSpotToFutures(true)
                            togglePopup(true)
                          }}
                        >
                          in
                      </BtnCustom>
                        <BtnCustom
                          btnWidth="45%"
                          height="auto"
                          fontSize=".8rem"
                          padding=".5rem 0 .4rem 0;"
                          borderRadius=".8rem"
                          btnColor={theme.palette.blue.main}
                          backgroundColor={theme.palette.white.background}
                          hoverColor={theme.palette.white.background}
                          hoverBackground={theme.palette.blue.main}
                          transition={'all .4s ease-out'}
                          onClick={() => {
                            setTransferFromSpotToFutures(false)
                            togglePopup(true)
                          }}
                        >
                          out
                      </BtnCustom>
                      </div>
                    </>
                  )}
                </Grid>
              </>
            )}
        </Grid>
      </CustomCard>
    </>
  )
}
