import React, { useState } from 'react'
import { RowContainer, Row } from '@sb/compositions/AnalyticsRoute/index.styles'
import { BlueButton } from '@sb/compositions/Chart/components/WarningPopup'
import { getTokenNameByMintAddress } from '@sb/dexUtils/markets'
import { GreenButton, RowDataTdText } from '../../index.styles'
import { StakePopup } from '../../../Popups/Staking/StakePopup'
import { UnstakePopup } from '../../../Popups/Unstaking/UnstakePopup'
import { useWallet } from '@sb/dexUtils/wallet'

export const UserLiquidityDetails = ({
  theme,
  pool,
  allTokensData,
  selectPool,
  setIsWithdrawalPopupOpen,
  setIsAddLiquidityPopupOpen,
}) => {
  const { wallet } = useWallet()
  const [isUnstakePopupOpen, setIsUnstakePopupOpen] = useState(false)

  const [isStakePopupOpen, setIsStakePopupOpen] = useState(false)

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
            <span style={{ color: '#fbf2f2' }}>Total:</span> 500{' '}
            <span style={{ color: '#fbf2f2' }}>Staked:</span> 200
          </RowDataTdText>
        </Row>
        <Row direction="column" width="25%">
          <BlueButton
            theme={theme}
            style={{ marginBottom: '1rem' }}
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
              : pool.locked
              ? 'Locked until Oct 16, 2021'
              : 'Withdraw Liquidity + Fees'}
          </BlueButton>
        </Row>
      </Row>
      <Row justify="space-between" width="40%" padding="0 0 0 4rem">
        <Row align="flex-start" direction="column" width="60%">
          {pool.staked ? (
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
            {pool.staked ? (
              <RowContainer justify="space-between">
                <GreenButton
                  onClick={() => {
                    if (!wallet.connected) {
                      wallet.connect()
                      return
                    }
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
            ) : (
              <RowDataTdText>
                Stake your pool tokens to start
                <span style={{ color: '#A5E898', padding: '0 0.5rem' }}>
                  RIN
                </span>
                farming
              </RowDataTdText>
            )}
          </RowContainer>
        </Row>
        {!pool.staked && (
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
                setIsStakePopupOpen(true)
              }}
            >
              {wallet.connected ? 'Stake Pool Token' : 'Connect Wallet'}
            </GreenButton>
          </Row>
        )}
      </Row>
      <StakePopup
        theme={theme}
        open={isStakePopupOpen}
        pool={pool}
        close={() => setIsStakePopupOpen(false)}
        allTokensData={allTokensData}
      />
      <UnstakePopup
        theme={theme}
        open={isUnstakePopupOpen}
        pool={pool}
        close={() => setIsUnstakePopupOpen(false)}
        allTokensData={allTokensData}
      />
    </RowContainer>
  )
}
