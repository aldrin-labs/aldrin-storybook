import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { Grid } from '@material-ui/core'

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
import { CustomCard } from '@sb/compositions/Chart/Chart.styles'
import SvgIcon from '@sb/components/SvgIcon'

export const BalanceTitle = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.8rem;
  padding: 0.5rem 0.8rem;
  border-radius: 0.8rem;
  background-color: #e0e5ec;
`

export const BalanceValues = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  margin-top: 2.5rem;
  padding: 0 1rem;
  text-align: center;
`

export const BalanceQuantity = styled.span`
  color: #16253d;
  font-size: 1.3rem;
  font-weight: bold;
  letter-spacing: 0.075rem;

  text-align: right;
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
  border-bottom: 0.1rem solid #e0e5ec;

  ${({ needBorder }: { needBorder?: boolean }) =>
    needBorder &&
    'border-top: .1rem solid #e0e5ec; border-bottom: .1rem solid #e0e5ec;'}
`

export const BalanceFuturesTypography = styled.span`
  font-size: 1rem;
  font-weight: bold;
  padding: 0.35rem 0;
  letter-spacing: 0.1rem;
  text-transform: uppercase;
`

export const BalanceFuturesTitle = styled(BalanceFuturesTypography)`
  color: #7284a0;
`

export const BalanceFuturesValue = styled(BalanceFuturesTypography)`
  color: #16253d;
`

export const BalanceFuturesSymbol = styled(BalanceFuturesTypography)`
  color: #16253d;
`

export const Balances = ({
  getFundsQuery,
  pair,
  marketType,
  selectedKey,
  subscribeToMore,
  showFuturesTransfer = false,
  timerForFuturesWars = {},
  isAlreadyJoined = false,
  isFuturesWarsKey = false,
  futuresWarsRoundBet = 0,
}: {
  getFundsQuery: {
    getFunds: FundsType[]
  }
  pair: string[]
  marketType: 0 | 1
  selectedKey: Key
  subscribeToMore: () => () => void
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

  const firstValuePair =
    stripDigitPlaces(funds[0].value) === null
      ? funds[0].value
      : formatNumberToUSFormat(stripDigitPlaces(funds[0].value))

  const secondValuePair =
    stripDigitPlaces(funds[1].value) === null
      ? funds[1].value
      : formatNumberToUSFormat(stripDigitPlaces(funds[1].value))

  return (
    <>
      <TransferPopup
        open={open}
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
      <CustomCard>
        <ChartCardHeader
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
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
                xs={6}
                style={{
                  borderBottom: '.1rem solid #e0e5ec',
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
                  <BalanceQuantity>
                    {funds[0].quantity.toFixed(8)}
                  </BalanceQuantity>
                  <BalanceValue>
                    {addMainSymbol(firstValuePair, true)}
                  </BalanceValue>
                </BalanceValues>
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
                  <BalanceQuantity>
                    {funds[1].quantity.toFixed(8)}
                  </BalanceQuantity>
                  <BalanceValue>
                    {addMainSymbol(secondValuePair, true)}
                  </BalanceValue>
                </BalanceValues>
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
                  <BalanceFuturesContainer>
                    <BalanceFuturesTitle>Wallet balance</BalanceFuturesTitle>
                    <BalanceFuturesValue>
                      <span style={{ color: '#0B1FD1' }}>
                        {stripDigitPlaces(USDTFuturesFund.quantity)}
                      </span>{' '}
                      <BalanceFuturesSymbol>USDT</BalanceFuturesSymbol>
                    </BalanceFuturesValue>
                  </BalanceFuturesContainer>
                  <BalanceFuturesContainer>
                    <BalanceFuturesTitle>Availiable</BalanceFuturesTitle>
                    <BalanceFuturesValue>
                      <span style={{ color: '#0B1FD1' }}>
                        {stripDigitPlaces(USDTFuturesFund.free)}
                      </span>{' '}
                      <BalanceFuturesSymbol>USDT</BalanceFuturesSymbol>
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
                  borderTop: '.1rem solid #e0e5ec',
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
                    btnColor={'#0B1FD1'}
                    backgroundColor={'#fff'}
                    hoverColor={'#fff'}
                    hoverBackground={'#0B1FD1'}
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
                    <BalanceFuturesTitle>transfer</BalanceFuturesTitle>
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
                        btnColor={'#0B1FD1'}
                        backgroundColor={'#fff'}
                        hoverColor={'#fff'}
                        hoverBackground={'#0B1FD1'}
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
                        btnColor={'#0B1FD1'}
                        backgroundColor={'#fff'}
                        hoverColor={'#fff'}
                        hoverBackground={'#0B1FD1'}
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
