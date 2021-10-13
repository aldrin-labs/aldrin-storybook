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
import {
  DexTokensPrices,
  FeesEarned,
  PoolInfo,
} from '@sb/compositions/Pools/index.types'
import { TokenInfo } from '@sb/compositions/Rebalance/Rebalance.types'
import { calculateWithdrawAmount } from '@sb/dexUtils/pools'
import {
  formatNumberToUSFormat,
  stripDigitPlaces,
} from '@core/utils/PortfolioTableUtils'
import { calculatePoolTokenPrice } from '@sb/dexUtils/pools/calculatePoolTokenPrice'
import {
  FarmingTicket,
  filterClosedFarmingTickets,
} from '@sb/dexUtils/pools/endFarming'
import { getStakedTokensForPool } from '@sb/dexUtils/pools/getStakedTokensForPool'
import { getAvailableFarmingTokensForPool } from '@sb/dexUtils/pools/getAvailableFarmingTokensForPool'
import { withdrawFarmed } from '@sb/dexUtils/pools/withdrawFarmed'
import { useConnection } from '@sb/dexUtils/connection'
import { DarkTooltip } from '@sb/components/TooltipCustom/Tooltip'
import { SvgIcon } from '@sb/components'
import Info from '@icons/TooltipImg.svg'
import { dayDuration } from '@sb/compositions/AnalyticsRoute/components/utils'
import { estimatedTime } from '@core/utils/dateUtils'

export const UserLiquidityDetails = ({
  theme,
  pool,
  allTokensDataMap,
  dexTokensPricesMap,
  farmingTicketsMap,
  earnedFeesInPoolForUserMap,
  selectPool,
  refreshAllTokensData,
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
  earnedFeesInPoolForUserMap: Map<string, FeesEarned>
  selectPool: (pool: PoolInfo) => void
  refreshAllTokensData: () => void
  setIsWithdrawalPopupOpen: (value: boolean) => void
  setIsAddLiquidityPopupOpen: (value: boolean) => void
  setIsStakePopupOpen: (value: boolean) => void
  setIsUnstakePopupOpen: (value: boolean) => void
}) => {
  const { wallet } = useWallet()
  const connection = useConnection()

  const poolTokenAmount = allTokensDataMap.get(pool.poolTokenMint)?.amount || 0
  const stakedTokens = getStakedTokensForPool({ pool, farmingTicketsMap })

  const availableToClaimFarmingTokens = getAvailableFarmingTokensForPool({
    pool,
    farmingTicketsMap,
  })

  // if has pool tokens or staked
  const hasPoolTokens = poolTokenAmount > 0
  const hasStakedTokens = stakedTokens > 0

  const hasLiquidity = hasPoolTokens || hasStakedTokens
  const hasFarming = pool.farming && pool.farming.length > 0
  const hasTokensToClaim = availableToClaimFarmingTokens > 0

  const [baseUserTokenAmount, quoteUserTokenAmount] = calculateWithdrawAmount({
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
  const isUnstakeDisabled =
    isUnstakeLocked || filterClosedFarmingTickets(farmingTickets).length === 0

  const baseSymbol = getTokenNameByMintAddress(pool.tokenA)
  const quoteSymbol = getTokenNameByMintAddress(pool.tokenB)

  const baseTokenPrice = dexTokensPricesMap.get(baseSymbol)?.price || 10
  const quoteTokenPrice = dexTokensPricesMap.get(quoteSymbol)?.price || 10

  const earnedFeesInPoolForUser = earnedFeesInPoolForUserMap.get(
    pool.swapToken
  ) || { totalBaseTokenFee: 0, totalQuoteTokenFee: 0 }

  const earnedFeesUSD =
    earnedFeesInPoolForUser.totalBaseTokenFee * baseTokenPrice +
    earnedFeesInPoolForUser.totalQuoteTokenFee * quoteTokenPrice

  const userLiquidityUSD =
    baseTokenPrice * baseUserTokenAmount +
    quoteTokenPrice * quoteUserTokenAmount

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
        width="55%"
      >
        <Row align="flex-start" direction="column" width="50%">
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
                {formatNumberToUSFormat(
                  stripDigitPlaces(baseUserTokenAmount, 8)
                )}{' '}
                <WhiteText>{getTokenNameByMintAddress(pool.tokenA)}</WhiteText>{' '}
                /{' '}
                {formatNumberToUSFormat(
                  stripDigitPlaces(quoteUserTokenAmount, 8)
                )}{' '}
                <WhiteText>{getTokenNameByMintAddress(pool.tokenB)}</WhiteText>{' '}
                <WhiteText>($</WhiteText>
                <span>
                  {formatNumberToUSFormat(
                    stripDigitPlaces(userLiquidityUSD, 2)
                  )}
                </span>
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
                {formatNumberToUSFormat(
                  stripDigitPlaces(earnedFeesInPoolForUser.totalBaseTokenFee, 8)
                )}{' '}
                <WhiteText>{getTokenNameByMintAddress(pool.tokenA)}</WhiteText>{' '}
                /{' '}
                {formatNumberToUSFormat(
                  stripDigitPlaces(
                    earnedFeesInPoolForUser.totalQuoteTokenFee,
                    8
                  )
                )}{' '}
                <WhiteText>{getTokenNameByMintAddress(pool.tokenB)}</WhiteText>{' '}
                <WhiteText>($</WhiteText>
                {formatNumberToUSFormat(stripDigitPlaces(earnedFeesUSD, 2))}
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
              <WhiteText>Total:</WhiteText>{' '}
              {formatNumberToUSFormat(
                stripDigitPlaces(poolTokenAmount + stakedTokens, 2)
              )}{' '}
              <WhiteText>Staked:</WhiteText>{' '}
              {formatNumberToUSFormat(stripDigitPlaces(stakedTokens, 2))}
            </RowDataTdText>
          </Row>
        )}

        <Row direction="column" width="25%" style={{ paddingRight: '2rem' }}>
          <BlueButton
            theme={theme}
            btnWidth={'100%'}
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
              btnWidth={'100%'}
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
      <Row justify="space-between" width="45%" padding="0 1rem 0 2rem">
        <Row align="flex-start" direction="column" width="45%">
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
            ) : hasStakedTokens || availableToClaimFarmingTokens > 0 ? (
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
                  Stake Pool Tokens
                </GreenButton>
                <GreenButton
                  theme={theme}
                  disabled={isUnstakeDisabled}
                  style={{ width: '48%' }}
                  onClick={() => {
                    selectPool(pool)
                    setIsUnstakePopupOpen(true)
                  }}
                >
                  {isUnstakeLocked
                    ? `Locked until ${dayjs
                        .unix(unlockAvailableDate)
                        .format('MMM DD, YYYY')}`
                    : 'Unstake Pool Tokens'}
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

        {hasFarming && (hasPoolTokens || hasTokensToClaim) && (
          <Row direction="column" width="55%" align="flex-end">
            <RowDataTdText
              theme={theme}
              fontFamily={'Avenir Next Medium'}
              style={{ marginBottom: '3.5rem' }}
            >
              <DarkTooltip
                title={
                  <span>
                    The founder has set up vesting. You will be able to claim
                    33% of your daily reward every day, the remaining 67% will
                    become available for withdrawal after{' '}
                    {estimatedTime(farmingState.vestingPeriod)}.
                  </span>
                }
              >
                <div style={{ display: 'inline' }}>
                  <SvgIcon
                    src={Info}
                    width={'1.5rem'}
                    height={'auto'}
                    style={{ marginRight: '1rem' }}
                  />
                </div>
              </DarkTooltip>
              Available to claim:
              <AmountText style={{ padding: '0 0.5rem' }}>
                {formatNumberToUSFormat(
                  stripDigitPlaces(availableToClaimFarmingTokens, 2)
                )}
              </AmountText>{' '}
              {getTokenNameByMintAddress(farmingState.farmingTokenMint)}
            </RowDataTdText>
            <GreenButton
              theme={theme}
              btnWidth={'auto'}
              padding={'0 2rem'}
              disabled={hasStakedTokens && !hasTokensToClaim}
              onClick={async () => {
                if (hasTokensToClaim) {
                  // add loader
                  await withdrawFarmed({
                    wallet,
                    connection,
                    pool,
                    allTokensDataMap,
                    farmingTickets,
                  })

                  await setTimeout(() => refreshAllTokensData(), 7500)
                } else {
                  selectPool(pool)
                  setIsStakePopupOpen(true)
                }
              }}
            >
              {hasStakedTokens || hasTokensToClaim
                ? 'Claim reward'
                : 'Stake Pool Token'}
            </GreenButton>
          </Row>
        )}
      </Row>
    </RowContainer>
  )
}
