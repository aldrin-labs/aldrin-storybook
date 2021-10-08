import React from 'react'
import dayjs from 'dayjs'
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
import { DexTokensPrices, PoolInfo } from '@sb/compositions/Pools/index.types'
import { TokenInfo } from '@sb/compositions/Rebalance/Rebalance.types'
import { calculateWithdrawAmount } from '@sb/dexUtils/pools'
import {
  formatNumberToUSFormat,
  stripDigitPlaces,
} from '@core/utils/PortfolioTableUtils'
import { calculatePoolTokenPrice } from '@sb/dexUtils/pools/calculatePoolTokenPrice'
import { FarmingTicket } from '@sb/dexUtils/pools/endFarming'
import { getStakedTokensForPool } from '@sb/dexUtils/pools/getStakedTokensForPool'
import { getAvailableFarmingTokensForPool } from '@sb/dexUtils/pools/getAvailableFarmingTokensForPool'
import { withdrawFarmed } from '@sb/dexUtils/pools/withdrawFarmed'
import { useConnection } from '@sb/dexUtils/connection'

export const UserLiquidityDetails = ({
  theme,
  pool,
  allTokensDataMap,
  dexTokensPricesMap,
  farmingTicketsMap,
  earnedFeesInPoolForUserMap,
  selectPool,
  setIsWithdrawalPopupOpen,
  setIsAddLiquidityPopupOpen,
  setIsStakePopupOpen,
  setIsUnstakePopupOpen,
}: {
  theme: Theme
  pool: PoolInfo
  allTokensDataMap: Map<string, TokenInfo>
  farmingTicketsMap: Map<string, FarmingTicket[]>
  dexTokensPricesMap: Map<string, DexTokensPrices>
  earnedFeesInPoolForUserMap: Map<string, number>
  selectPool: (pool: PoolInfo) => void
  setIsWithdrawalPopupOpen: (value: boolean) => void
  setIsAddLiquidityPopupOpen: (value: boolean) => void
  setIsStakePopupOpen: (value: boolean) => void
  setIsUnstakePopupOpen: (value: boolean) => void
}) => {
  const { wallet } = useWallet()
  const connection = useConnection()

  const poolTokenAmount = allTokensDataMap.get(pool.poolTokenMint)?.amount || 0
  const stakedTokens = getStakedTokensForPool({ pool, farmingTicketsMap })
  const earnedFees = earnedFeesInPoolForUserMap.get(pool.swapToken) || 0
  const availableToClaimFarmingTokens = getAvailableFarmingTokensForPool({
    pool,
    farmingTicketsMap,
  })

  // if has pool tokens or staked
  const hasPoolTokens = poolTokenAmount > 0
  const hasStakedTokens = stakedTokens > 0

  const hasLiquidity = hasPoolTokens || hasStakedTokens
  const hasFarming = pool.farming && pool.farming.length > 0

  const [baseTokenAmount, quoteTokenAmount] = calculateWithdrawAmount({
    selectedPool: pool,
    poolTokenAmount,
  })

  const poolTokenPrice = calculatePoolTokenPrice({
    pool,
    dexTokensPricesMap,
  })

  const farmingTickets = farmingTicketsMap.get(pool.swapToken) || []
  const lastFarmingTicket =
    farmingTickets.length > 0
      ? farmingTickets?.sort((a, b) => b.startTime - a.startTime)[0]
      : null

  const farmingState = pool.farming && pool.farming[0]
  const unlockAvailableDate = lastFarmingTicket
    ? +lastFarmingTicket.startTime + +farmingState?.periodLength
    : 0

  const isUnstakeLocked = unlockAvailableDate > Date.now() / 1000

  return (
    <RowContainer
      height="12rem"
      margin="1rem 0"
      style={{ background: '#222429' }}
    >
      <Row
        style={{
          borderRight: `0.2rem solid #383B45`,
        }}
        justify="space-between"
        width="60%"
      >
        <Row align="flex-start" direction="column" width="40%">
          <RowDataTdText
            theme={theme}
            color={theme.palette.grey.new}
            style={{ marginBottom: '1rem' }}
          >
            Your Liquitity:
          </RowDataTdText>

          {hasLiquidity ? (
            <>
              <RowDataTdText
                color={'#A5E898'}
                fontFamily="Avenir Next Medium"
                theme={theme}
              >
                {formatNumberToUSFormat(stripDigitPlaces(baseTokenAmount, 8))}{' '}
                <WhiteText>{getTokenNameByMintAddress(pool.tokenA)}</WhiteText>{' '}
                /{' '}
                {formatNumberToUSFormat(stripDigitPlaces(quoteTokenAmount, 8))}{' '}
                <WhiteText>{getTokenNameByMintAddress(pool.tokenB)}</WhiteText>{' '}
                <WhiteText>$(</WhiteText>
                <span>{formatNumberToUSFormat(stripDigitPlaces(1000, 2))}</span>
                <WhiteText>)</WhiteText>
              </RowDataTdText>

              <RowDataTdText
                theme={theme}
                color={theme.palette.grey.new}
                style={{ margin: '2rem 0 1rem 0' }}
              >
                Fees Earned:
              </RowDataTdText>
              <RowDataTdText
                color={'#A5E898'}
                fontFamily="Avenir Next Medium"
                theme={theme}
              >
                100{' '}
                <WhiteText>{getTokenNameByMintAddress(pool.tokenA)}</WhiteText>{' '}
                / 2{' '}
                <WhiteText>{getTokenNameByMintAddress(pool.tokenB)}</WhiteText>{' '}
                <WhiteText>$(</WhiteText>
                {formatNumberToUSFormat(stripDigitPlaces(earnedFees, 2))}
                <WhiteText>)</WhiteText>
              </RowDataTdText>
            </>
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
          <Row align="flex-start" direction="column" width="30%">
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
              <WhiteText>Total:</WhiteText>{' '}
              {formatNumberToUSFormat(
                stripDigitPlaces(poolTokenAmount + stakedTokens, 2)
              )}{' '}
              <WhiteText>Staked:</WhiteText>{' '}
              {formatNumberToUSFormat(stripDigitPlaces(stakedTokens, 2))}
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
          {hasStakedTokens && hasFarming ? (
            <RowDataTdText
              fontFamily={'Avenir Next Medium'}
              style={{ marginBottom: '3.5rem' }}
            >
              Staked:{' '}
              <AmountText style={{ padding: '0 0.5rem' }}>
                {formatNumberToUSFormat(stripDigitPlaces(stakedTokens, 2))}
              </AmountText>{' '}
              <span>
                Pool Tokens
                <AmountText style={{ padding: '0 0.5rem' }}>
                  <WhiteText>($</WhiteText>
                  {stakedTokens * poolTokenPrice}
                  <WhiteText>)</WhiteText>
                </AmountText>
              </span>
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
            {!hasFarming ? (
              <RowDataTdText>No farming available in this pool.</RowDataTdText>
            ) : hasStakedTokens ? (
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
                  disabled={isUnstakeLocked || !wallet.connected}
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
                    : isUnstakeLocked
                    ? // todo test
                      `Locked until ${dayjs
                        .unix(unlockAvailableDate)
                        .format('MMM DD, YYYY')}`
                    : 'Unstake Pool Token'}
                </GreenButton>
              </RowContainer>
            ) : hasPoolTokens ? (
              <RowDataTdText>
                Stake your pool tokens to start
                <AmountText style={{ padding: '0 0.5rem' }}>
                  {getTokenNameByMintAddress(farmingState.farmingTokenMint)}
                </AmountText>
                farming
              </RowDataTdText>
            ) : (
              <RowDataTdText>
                Deposit liquidity to farm{' '}
                <AmountText>
                  {getTokenNameByMintAddress(farmingState.farmingTokenMint)}
                </AmountText>
              </RowDataTdText>
            )}
          </RowContainer>
        </Row>

        {hasPoolTokens && hasFarming && (
          <Row direction="column" width="40%" align="flex-end">
            <RowDataTdText
              theme={theme}
              fontFamily={'Avenir Next Medium'}
              style={{ marginBottom: '3.5rem' }}
            >
              {/* info here */}
              <AmountText style={{ padding: '0 0.5rem' }}>
                {availableToClaimFarmingTokens}
              </AmountText>{' '}
              {getTokenNameByMintAddress(farmingState.farmingTokenMint)}
            </RowDataTdText>
            <GreenButton
              onClick={async () => {
                if (!wallet.connected) {
                  wallet.connect()
                  return
                }

                if (availableToClaimFarmingTokens > 0) {
                  // add loader
                  await withdrawFarmed({
                    wallet,
                    connection,
                    pool,
                    allTokensDataMap,
                    farmingTickets,
                  })
                } else {
                  selectPool(pool)
                  setIsStakePopupOpen(true)
                }
              }}
            >
              {wallet.connected
                ? availableToClaimFarmingTokens > 0
                  ? 'Claim reward'
                  : 'Stake Pool Token'
                : 'Connect Wallet'}
            </GreenButton>
          </Row>
        )}
      </Row>
    </RowContainer>
  )
}
