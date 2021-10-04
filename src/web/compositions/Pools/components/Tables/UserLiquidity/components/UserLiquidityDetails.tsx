import React from 'react'
import { RowContainer, Row } from '@sb/compositions/AnalyticsRoute/index.styles'
import { BlueButton } from '@sb/compositions/Chart/components/WarningPopup'
import { getTokenNameByMintAddress } from '@sb/dexUtils/markets'
import {
  AmountText,
  GreenButton,
  RowDataTdText,
  WhiteText,
} from '../../index.styles'
import { useWallet } from '@sb/dexUtils/wallet'
import { Theme } from '@material-ui/core'
import { PoolInfo } from '@sb/compositions/Pools/index.types'
import { TokenInfo } from '@sb/compositions/Rebalance/Rebalance.types'
import { calculateWithdrawAmount } from '@sb/dexUtils/pools'
import {
  formatNumberToUSFormat,
  stripDigitPlaces,
} from '@core/utils/PortfolioTableUtils'

export const UserLiquidityDetails = ({
  theme,
  pool,
  allTokensDataMap,
  selectPool,
  setIsWithdrawalPopupOpen,
  setIsAddLiquidityPopupOpen,
  setIsStakePopupOpen,
  setIsUnstakePopupOpen,
}: {
  theme: Theme
  pool: PoolInfo
  allTokensDataMap: Map<string, TokenInfo>
  selectPool: (pool: PoolInfo) => void
  setIsWithdrawalPopupOpen: (value: boolean) => void
  setIsAddLiquidityPopupOpen: (value: boolean) => void
  setIsStakePopupOpen: (value: boolean) => void
  setIsUnstakePopupOpen: (value: boolean) => void
}) => {
  const { wallet } = useWallet()

  const poolTokenAmount = allTokensDataMap.get(pool.poolTokenMint)?.amount || 0
  const stakedTokens = 0

  // if has pool tokens or staked
  const hasPoolTokens = poolTokenAmount > 0
  const hasStakedTokens = stakedTokens > 0

  const hasLiquidity = hasPoolTokens || hasStakedTokens

  const [baseTokenAmount, quoteTokenAmount] = calculateWithdrawAmount({
    selectedPool: pool,
    poolTokenAmount,
  })

  return (
    <RowContainer margin="1rem 0" style={{ background: '#222429' }}>
      <Row
        style={{
          borderRight: `0.2rem solid #383B45`,
        }}
        justify="space-between"
        width="60%"
      >
        <Row align="flex-start" direction="column" width="25%">
          <RowDataTdText
            theme={theme}
            color={theme.palette.grey.new}
            style={{ marginBottom: '1rem' }}
          >
            Your Liquitity:
          </RowDataTdText>

          {hasLiquidity ? (
            <RowDataTdText
              color={'#A5E898'}
              fontFamily="Avenir Next Medium"
              theme={theme}
            >
              {formatNumberToUSFormat(stripDigitPlaces(baseTokenAmount, 8))}{' '}
              <WhiteText>{getTokenNameByMintAddress(pool.tokenA)}</WhiteText> /{' '}
              {formatNumberToUSFormat(stripDigitPlaces(quoteTokenAmount, 8))}{' '}
              <WhiteText>{getTokenNameByMintAddress(pool.tokenB)}</WhiteText> (
              <WhiteText>$</WhiteText>
              <span>{formatNumberToUSFormat(stripDigitPlaces(1000, 2))}</span>)
            </RowDataTdText>
          ) : (
            <RowDataTdText
              color={'#A5E898'}
              fontFamily="Avenir Next Medium"
              theme={theme}
            >
              0$
            </RowDataTdText>
          )}
        </Row>

        {hasLiquidity && (
          <Row align="flex-start" direction="column" width="25%">
            <RowDataTdText
              theme={theme}
              color={theme.palette.grey.new}
              style={{ marginBottom: '1rem' }}
            >
              Fees Earned:
            </RowDataTdText>
            <RowDataTdText
              color={'#A5E898'}
              fontFamily="Avenir Next Medium"
              theme={theme}
            >
              100{' '}
              <span style={{ color: '#fbf2f2' }}>
                {getTokenNameByMintAddress(pool.tokenA)}
              </span>{' '}
              / 2{' '}
              <span style={{ color: '#fbf2f2' }}>
                {getTokenNameByMintAddress(pool.tokenB)}
              </span>{' '}
              (<span style={{ color: '#fbf2f2' }}>$</span>1,000){' '}
            </RowDataTdText>
          </Row>
        )}

        {hasLiquidity && (
          <Row align="flex-start" direction="column" width="25%">
            <RowDataTdText
              theme={theme}
              color={theme.palette.grey.new}
              style={{ marginBottom: '1rem' }}
            >
              Pool Tokens:
            </RowDataTdText>
            <RowDataTdText
              color={'#A5E898'}
              fontFamily="Avenir Next Medium"
              theme={theme}
            >
              <span style={{ color: '#fbf2f2' }}>Total:</span> {poolTokenAmount}{' '}
              <span style={{ color: '#fbf2f2' }}>Staked:</span> 200
            </RowDataTdText>
          </Row>
        )}

        <Row direction="column" width="25%">
          <BlueButton
            theme={theme}
            style={{ marginBottom: hasLiquidity ? '1rem' : '0' }}
            onClick={() => {
              if (!wallet.connected) {
                wallet.connect()
                return
              }

              selectPool(pool)
              setIsAddLiquidityPopupOpen(true)
            }}
          >
            {wallet.connected ? 'Deposit Liquidity' : 'Connect Wallet'}
          </BlueButton>

          {hasLiquidity && (
            <BlueButton
              theme={theme}
              disabled={pool.locked}
              onClick={() => {
                if (!wallet.connected) {
                  wallet.connect()
                  return
                }

                selectPool(pool)
                setIsWithdrawalPopupOpen(true)
              }}
            >
              {!wallet.connected
                ? 'Connect Wallet'
                : 'Withdraw Liquidity + Fees'}
            </BlueButton>
          )}
        </Row>
      </Row>
      <Row justify="space-between" width="40%" padding="0 0 0 4rem">
        <Row align="flex-start" direction="column" width="60%">
          {hasStakedTokens ? (
            <RowDataTdText
              fontFamily={'Avenir Next Medium'}
              style={{ marginBottom: '3.5rem' }}
            >
              Staked:{' '}
              <span style={{ color: '#A5E898', padding: '0 0.5rem' }}>200</span>{' '}
              Pool Tokens ($
              <span style={{ color: '#A5E898', padding: '0 0.5rem' }}>
                1000
              </span>
              )
            </RowDataTdText>
          ) : (
            <RowDataTdText
              theme={theme}
              fontFamily={'Avenir Next Medium'}
              style={{ marginBottom: '3.5rem' }}
            >
              Farming
            </RowDataTdText>
          )}

          <RowContainer justify="flex-start" theme={theme}>
            {hasStakedTokens ? (
              <RowContainer justify="space-between">
                <GreenButton
                  onClick={() => {
                    if (!wallet.connected) {
                      wallet.connect()
                      return
                    }

                    selectPool(pool)
                    setIsStakePopupOpen(true)
                  }}
                  theme={theme}
                  style={{ width: '48%' }}
                >
                  {!wallet.connected ? 'Connect Wallet' : 'Stake Pool Token'}
                </GreenButton>
                <GreenButton
                  theme={theme}
                  disabled={pool.locked || !wallet.connected}
                  style={{ width: '48%' }}
                  onClick={() => {
                    if (!wallet.connected) {
                      wallet.connect()
                      return
                    }

                    selectPool(pool)
                    setIsUnstakePopupOpen(true)
                  }}
                >
                  {!wallet.connected
                    ? 'Connect Wallet'
                    : pool.locked
                    ? 'Locked until Oct 16, 2021'
                    : 'Unstake Pool Token'}
                </GreenButton>
              </RowContainer>
            ) : hasPoolTokens ? (
              <RowDataTdText>
                Stake your pool tokens to start
                <span style={{ color: '#A5E898', padding: '0 0.5rem' }}>
                  RIN
                </span>
                farming
              </RowDataTdText>
            ) : (
              <RowDataTdText>
                Deposit liquidity to farm{' '}
                <span style={{ color: '#A5E898' }}>RIN</span>
              </RowDataTdText>
            )}
          </RowContainer>
        </Row>

        {hasPoolTokens && (
          <Row direction="column" width="40%" align="flex-end">
            <RowDataTdText
              theme={theme}
              fontFamily={'Avenir Next Medium'}
              style={{ marginBottom: '2rem' }}
            >
              <span style={{ color: '#A5E898', padding: '0 0.5rem' }}>0</span>{' '}
              RIN
            </RowDataTdText>
            <GreenButton
              onClick={() => {
                if (!wallet.connected) {
                  wallet.connect()
                  return
                }

                selectPool(pool)
                setIsStakePopupOpen(true)
              }}
            >
              {wallet.connected ? 'Stake Pool Token' : 'Connect Wallet'}
            </GreenButton>
          </Row>
        )}
      </Row>
    </RowContainer>
  )
}
