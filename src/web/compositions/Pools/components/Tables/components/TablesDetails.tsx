import React, { useEffect, useState } from 'react'
import dayjs from 'dayjs'
import { RowContainer, Row } from '@sb/compositions/AnalyticsRoute/index.styles'
import { getTokenNameByMintAddress } from '@sb/dexUtils/markets'
import {
  AmountText,
  Button,
  RowDataTdText,
  WhiteText,
} from '@sb/compositions/Pools/components/Tables/index.styles'
import { useWallet } from '@sb/dexUtils/wallet'
import { Theme } from '@material-ui/core'
import {
  DexTokensPrices,
  FeesEarned,
  PoolInfo,
  PoolWithOperation,
} from '@sb/compositions/Pools/index.types'
import { TokenInfo } from '@sb/compositions/Rebalance/Rebalance.types'
import { calculateWithdrawAmount } from '@sb/dexUtils/pools'

import { calculatePoolTokenPrice } from '@sb/dexUtils/pools/calculatePoolTokenPrice'
import { getStakedTokensFromOpenFarmingTickets } from '@sb/dexUtils/common/getStakedTokensFromOpenFarmingTickets'
import { getAvailableToClaimFarmingTokens } from '@sb/dexUtils/pools/getAvailableToClaimFarmingTokens'
import { withdrawFarmed } from '@sb/dexUtils/pools/withdrawFarmed'
import { useConnection } from '@sb/dexUtils/connection'

import { stripByAmountAndFormat } from '@core/utils/chartPageUtils'
import { Loader } from '@sb/components/Loader/Loader'
import { ConnectWalletPopup } from '@sb/compositions/Chart/components/ConnectWalletPopup/ConnectWalletPopup'
import { estimatedTime } from '@core/utils/dateUtils'
import { SvgIcon } from '@sb/components'
import InfoIcon from '@icons/inform.svg'
import WhiteTech from '@icons/whiteTech.svg'
import { DarkTooltip } from '@sb/components/TooltipCustom/Tooltip'
import { FarmingTicket } from '@sb/dexUtils/common/types'
import { filterOpenFarmingTickets } from '@sb/dexUtils/common/filterOpenFarmingTickets'
import { notify } from '@sb/dexUtils/notifications'
import { getAvailableFarmingTokensForFarmingState } from '@sb/dexUtils/pools/getAvailableFarmingTokensForFarmingState'
import { filterOpenFarmingStates } from '@sb/dexUtils/pools/filterOpenFarmingStates'
import {
  formatNumberToUSFormat,
  stripDigitPlaces,
} from '@core/utils/PortfolioTableUtils'
import { getTokenDataByMint } from '@sb/compositions/Pools/utils'

export const TablesDetails = ({
  theme,
  pool,
  poolWaitingForUpdateAfterOperation,
  allTokensData,
  dexTokensPricesMap,
  farmingTicketsMap,
  earnedFeesInPoolForUserMap,
  selectPool,
  refreshTokensWithFarmingTickets,
  setPoolWaitingForUpdateAfterOperation,
  setIsWithdrawalPopupOpen,
  setIsAddLiquidityPopupOpen,
  setIsStakePopupOpen,
  setIsUnstakePopupOpen,
  setIsClaimRewardsPopupOpen,
}: {
  theme: Theme
  pool: PoolInfo
  poolWaitingForUpdateAfterOperation: PoolWithOperation
  allTokensData: TokenInfo[]
  farmingTicketsMap: Map<string, FarmingTicket[]>
  dexTokensPricesMap: Map<string, DexTokensPrices>
  earnedFeesInPoolForUserMap: Map<string, FeesEarned>
  selectPool: (pool: PoolInfo) => void
  refreshTokensWithFarmingTickets: () => void
  setPoolWaitingForUpdateAfterOperation: (data: PoolWithOperation) => void
  setIsWithdrawalPopupOpen: (value: boolean) => void
  setIsAddLiquidityPopupOpen: (value: boolean) => void
  setIsStakePopupOpen: (value: boolean) => void
  setIsUnstakePopupOpen: (value: boolean) => void
  setIsClaimRewardsPopupOpen: (value: boolean) => void
}) => {
  const [isConnectWalletPopupOpen, setIsConnectWalletPopupOpen] = useState(
    false
  )
  const { wallet } = useWallet()
  const connection = useConnection()

  const { amount: poolTokenAmount } = getTokenDataByMint(
    allTokensData,
    pool.poolTokenMint
  )
  const farmingTickets = farmingTicketsMap.get(pool.swapToken) || []

  const stakedTokens = getStakedTokensFromOpenFarmingTickets(farmingTickets)
  const availableToClaimFarmingTokens = getAvailableToClaimFarmingTokens(
    farmingTickets
  )

  // if has pool tokens or staked
  const hasPoolTokens = poolTokenAmount > 0
  const hasStakedTokens = stakedTokens > 0

  const hasLiquidity = hasPoolTokens || hasStakedTokens
  const hasFarming = pool.farming && pool.farming.length > 0
  const hasTokensToClaim = availableToClaimFarmingTokens > 0

  const [baseUserTokenAmount, quoteUserTokenAmount] = calculateWithdrawAmount({
    selectedPool: pool,
    poolTokenAmount: poolTokenAmount + stakedTokens,
  })

  const poolTokenPrice = calculatePoolTokenPrice({
    pool,
    dexTokensPricesMap,
  })

  const lastFarmingTicket =
    farmingTickets.length > 0
      ? farmingTickets?.sort((a, b) => b.startTime - a.startTime)[0]
      : null

  const isPoolWithFarming = pool.farming && pool.farming.length > 0
  const openFarmings = isPoolWithFarming
    ? filterOpenFarmingStates(pool.farming)
    : []

  const unlockAvailableDate =
    lastFarmingTicket && isPoolWithFarming
      ? +lastFarmingTicket.startTime + +pool.farming[0].periodLength + 60 * 20
      : 0

  const isUnstakeLocked = unlockAvailableDate > Date.now() / 1000
  const isUnstakeDisabled =
    isUnstakeLocked || filterOpenFarmingTickets(farmingTickets).length === 0

  const baseSymbol = getTokenNameByMintAddress(pool.tokenA)
  const quoteSymbol = getTokenNameByMintAddress(pool.tokenB)

  const baseTokenPrice = dexTokensPricesMap.get(baseSymbol)?.price || 0
  const quoteTokenPrice = dexTokensPricesMap.get(quoteSymbol)?.price || 0

  const earnedFeesInPoolForUser = earnedFeesInPoolForUserMap.get(
    pool.swapToken
  ) || { totalBaseTokenFee: 0, totalQuoteTokenFee: 0 }

  const earnedFeesUSD =
    earnedFeesInPoolForUser.totalBaseTokenFee * baseTokenPrice +
    earnedFeesInPoolForUser.totalQuoteTokenFee * quoteTokenPrice

  const userLiquidityUSD =
    baseTokenPrice * baseUserTokenAmount +
    quoteTokenPrice * quoteUserTokenAmount

  const { operation } = poolWaitingForUpdateAfterOperation

  const isPoolWaitingForUpdateAfterOperation =
    poolWaitingForUpdateAfterOperation.pool === pool.swapToken

  const isPoolWaitingForUpdateAfterDeposit =
    isPoolWaitingForUpdateAfterOperation && operation === 'deposit'

  const isPoolWaitingForUpdateAfterWithdraw =
    isPoolWaitingForUpdateAfterOperation && operation === 'withdraw'

  const isPoolWaitingForUpdateAfterStake =
    isPoolWaitingForUpdateAfterOperation && operation === 'stake'

  const isPoolWaitingForUpdateAfterUnstake =
    isPoolWaitingForUpdateAfterOperation && operation === 'unstake'

  const isPoolWaitingForUpdateAfterClaim =
    isPoolWaitingForUpdateAfterOperation && operation === 'claim'

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
            Your Liquidity:
          </RowDataTdText>

          {hasLiquidity ? (
            <>
              <RowDataTdText
                color={'#53DF11'}
                fontFamily="Avenir Next Medium"
                theme={theme}
              >
                {stripByAmountAndFormat(baseUserTokenAmount)}{' '}
                <WhiteText>{getTokenNameByMintAddress(pool.tokenA)}</WhiteText>{' '}
                / {stripByAmountAndFormat(quoteUserTokenAmount)}{' '}
                <WhiteText>{getTokenNameByMintAddress(pool.tokenB)}</WhiteText>{' '}
                <WhiteText>(</WhiteText>
                <span>${stripByAmountAndFormat(userLiquidityUSD)}</span>
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
                color={'#53DF11'}
                fontFamily="Avenir Next Medium"
                theme={theme}
              >
                {stripByAmountAndFormat(
                  earnedFeesInPoolForUser.totalBaseTokenFee
                )}{' '}
                <WhiteText>{getTokenNameByMintAddress(pool.tokenA)}</WhiteText>{' '}
                /{' '}
                {stripByAmountAndFormat(
                  earnedFeesInPoolForUser.totalQuoteTokenFee
                )}{' '}
                <WhiteText>{getTokenNameByMintAddress(pool.tokenB)}</WhiteText>{' '}
                <WhiteText>(</WhiteText>${stripByAmountAndFormat(earnedFeesUSD)}
                <WhiteText>)</WhiteText>
              </RowDataTdText>
            </>
          ) : (
            <RowDataTdText
              color={'#53DF11'}
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
              color={'#53DF11'}
              fontFamily="Avenir Next Medium"
              theme={theme}
              style={{ marginBottom: '1rem' }}
            >
              <WhiteText>Total:</WhiteText>{' '}
              {stripByAmountAndFormat(poolTokenAmount + stakedTokens)}{' '}
            </RowDataTdText>
            <RowDataTdText
              color={'#53DF11'}
              fontFamily="Avenir Next Medium"
              theme={theme}
            >
              {' '}
              <WhiteText>Staked:</WhiteText>{' '}
              {stripByAmountAndFormat(stakedTokens)}
            </RowDataTdText>
          </Row>
        )}

        <Row direction="column" width="25%" style={{ paddingRight: '2rem' }}>
          <Button
            theme={theme}
            btnWidth={'100%'}
            style={{ marginBottom: hasLiquidity ? '1rem' : '0' }}
            disabled={isPoolWaitingForUpdateAfterDeposit}
            onClick={() => {
              if (!wallet.connected) {
                setIsConnectWalletPopupOpen(true)
                return
              }

              selectPool(pool)
              setIsAddLiquidityPopupOpen(true)
            }}
          >
            {wallet.connected ? (
              isPoolWaitingForUpdateAfterDeposit ? (
                <Loader />
              ) : (
                'Deposit Liquidity'
              )
            ) : (
              'Connect Wallet'
            )}
          </Button>

          {hasLiquidity && (
            <Button
              theme={theme}
              btnWidth={'100%'}
              disabled={isPoolWaitingForUpdateAfterWithdraw}
              onClick={() => {
                if (!wallet.connected) {
                  wallet.connect()
                  return
                }

                selectPool(pool)
                setIsWithdrawalPopupOpen(true)
              }}
            >
              {isPoolWaitingForUpdateAfterWithdraw ? (
                <Loader />
              ) : (
                'Withdraw Liquidity + Fees'
              )}
            </Button>
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
              Staked:
              <AmountText style={{ padding: '0 0.5rem' }}>
                {stripByAmountAndFormat(stakedTokens)}
              </AmountText>
              <span>
                Pool Tokens
                <AmountText style={{ padding: '0 0.5rem' }}>
                  <WhiteText>(</WhiteText>$
                  {stripByAmountAndFormat(stakedTokens * poolTokenPrice)}
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
            {!hasFarming ||
            (openFarmings.length === 0 &&
              !(hasStakedTokens || availableToClaimFarmingTokens > 0)) ? (
              <RowDataTdText>No farming available in this pool.</RowDataTdText>
            ) : hasStakedTokens || availableToClaimFarmingTokens > 0 ? (
              <RowContainer justify="space-between">
                <Button
                  color="#651CE4"
                  disabled={isPoolWaitingForUpdateAfterStake}
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
                  {isPoolWaitingForUpdateAfterStake ? (
                    <Loader />
                  ) : (
                    'Stake Pool Tokens'
                  )}
                </Button>
                <Button
                  theme={theme}
                  color={'#D54D32'}
                  disabled={
                    isUnstakeDisabled || isPoolWaitingForUpdateAfterUnstake
                  }
                  style={{ width: '48%' }}
                  onClick={() => {
                    selectPool(pool)
                    setIsUnstakePopupOpen(true)
                  }}
                >
                  {isPoolWaitingForUpdateAfterUnstake ? (
                    <Loader />
                  ) : isUnstakeLocked ? (
                    `Locked until ${dayjs
                      .unix(unlockAvailableDate)
                      .format('MMM DD, YYYY')}`
                  ) : (
                    'Unstake Pool Tokens'
                  )}
                </Button>
              </RowContainer>
            ) : hasPoolTokens ? (
              <RowDataTdText>
                Stake your pool tokens to start
                <AmountText style={{ padding: '0 0.5rem' }}>
                  {openFarmings.map(
                    (farmingState, i, arr) =>
                      `${getTokenNameByMintAddress(
                        farmingState.farmingTokenMint
                      )}${i !== arr.length - 1 ? ' + ' : ''}`
                  )}
                </AmountText>
                farming
              </RowDataTdText>
            ) : (
              <RowDataTdText>
                Deposit liquidity to farm{' '}
                <AmountText>
                  {openFarmings.map(
                    (farmingState, i, arr) =>
                      `${getTokenNameByMintAddress(
                        farmingState.farmingTokenMint
                      )}${i !== arr.length - 1 ? ' + ' : ''}`
                  )}
                </AmountText>
              </RowDataTdText>
            )}
          </RowContainer>
        </Row>

        {hasFarming ? (
          hasTokensToClaim || (!hasTokensToClaim && hasStakedTokens) ? (
            <Row direction="column" width="55%" align="flex-end">
              <RowDataTdText
                theme={theme}
                fontFamily={'Avenir Next Medium'}
                style={{ marginBottom: '3.5rem', maxWidth: '100%', overflow: 'hidden' }}
              >
                {/* TODO: return later vesting with few farming states */}
                {/* {farmingState.vestingPeriod > 0 && (
                  <DarkTooltip
                    title={
                      <span>
                        The founder has set up vesting. You will be able to
                        claim 33% of your daily reward every day, the remaining
                        67% will become available for withdrawal after{' '}
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
                )} */}
                Available to claim:
                {pool.farming.map((farmingState, i, arr) => {
                  const availableToClaimFromFarmingState = getAvailableFarmingTokensForFarmingState(
                    {
                      farmingTickets,
                      farmingState: farmingState.farmingState,
                    }
                  )
                  return (
                    <>
                      <AmountText style={{ padding: '0 0.5rem' }}>
                        {formatNumberToUSFormat(
                          stripDigitPlaces(availableToClaimFromFarmingState, 2)
                        )}
                      </AmountText>
                      {getTokenNameByMintAddress(farmingState.farmingTokenMint)}
                      <DarkTooltip
                        title={`${stripDigitPlaces(
                          availableToClaimFromFarmingState,
                          8
                        )} ${getTokenNameByMintAddress(
                          farmingState.farmingTokenMint
                        )}`}
                      >
                        <span>
                          <SvgIcon
                            src={InfoIcon}
                            width={'1.5rem'}
                            height={'1.5rem'}
                            style={{ marginLeft: '.5rem' }}
                          />
                        </span>
                      </DarkTooltip>
                      {i !== arr.length - 1 ? ' +' : ''}
                    </>
                  )
                })}
              </RowDataTdText>

              <Button
                theme={theme}
                btnWidth={'16rem'}
                color={
                  hasStakedTokens || hasTokensToClaim
                    ? 'linear-gradient(91.8deg, #651CE4 15.31%, #D44C32 89.64%)'
                    : '#651CE4'
                }
                disabled={
                  // true ||
                  (hasStakedTokens && !hasTokensToClaim) ||
                  isPoolWaitingForUpdateAfterClaim
                }
                onClick={() => {
                  selectPool(pool)
                  setIsClaimRewardsPopupOpen(true)
                }}
              >
                {isPoolWaitingForUpdateAfterClaim ? (
                  <Loader />
                ) : (
                  <span style={{ display: 'flex' }}>Claim reward</span>
                )}
              </Button>
            </Row>
          ) : hasPoolTokens && !hasStakedTokens ? (
            <Row direction="column" width="55%" align="flex-end">
              <Button
                theme={theme}
                btnWidth={'16rem'}
                padding={'0 2rem'}
                disabled={isPoolWaitingForUpdateAfterStake}
                onClick={async () => {
                  selectPool(pool)
                  setIsStakePopupOpen(true)
                }}
              >
                {isPoolWaitingForUpdateAfterStake ? (
                  <Loader />
                ) : (
                  'Stake Pool Token'
                )}
              </Button>
            </Row>
          ) : null
        ) : null}
      </Row>
      <ConnectWalletPopup
        theme={theme}
        open={isConnectWalletPopupOpen}
        onClose={() => setIsConnectWalletPopupOpen(false)}
      />
    </RowContainer>
  )
}
