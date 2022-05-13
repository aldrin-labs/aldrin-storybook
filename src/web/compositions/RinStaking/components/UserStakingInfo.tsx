import { PublicKey } from '@solana/web3.js'
import { FONT_SIZES, COLORS } from '@variables/variables'
import dayjs from 'dayjs'
import React, { useCallback, useEffect, useState } from 'react'
import { compose } from 'recompose'

import { Block, GreenBlock, BlockContentStretched } from '@sb/components/Block'
import { Cell, FlexBlock, Row, StretchedBlock } from '@sb/components/Layout'
import { ShareButton } from '@sb/components/ShareButton'
import SvgIcon from '@sb/components/SvgIcon'
import { InlineText } from '@sb/components/Typography'
import { withdrawStaked } from '@sb/dexUtils/common/actions'
import { startStaking } from '@sb/dexUtils/common/actions/startStaking'
import { getStakedTokensFromOpenFarmingTickets } from '@sb/dexUtils/common/getStakedTokensFromOpenFarmingTickets'
import { useMultiEndpointConnection } from '@sb/dexUtils/connection'
import { getTokenNameByMintAddress } from '@sb/dexUtils/markets'
import { notify } from '@sb/dexUtils/notifications'
import { addFarmingRewardsToTickets } from '@sb/dexUtils/pools/addFarmingRewardsToTickets/addFarmingRewardsToTickets'
import { getAvailableToClaimFarmingTokens } from '@sb/dexUtils/pools/getAvailableToClaimFarmingTokens'
import { STAKING_PROGRAM_ADDRESS } from '@sb/dexUtils/ProgramsMultiton/utils'
import {
  BUY_BACK_RIN_ACCOUNT_ADDRESS,
  DAYS_TO_CHECK_BUY_BACK,
} from '@sb/dexUtils/staking/config'
import { isOpenFarmingState } from '@sb/dexUtils/staking/filterOpenFarmingStates'
import { getTicketsWithUiValues } from '@sb/dexUtils/staking/getTicketsWithUiValues'
import { useAccountBalance } from '@sb/dexUtils/staking/useAccountBalance'
import { useAllStakingTickets } from '@sb/dexUtils/staking/useAllStakingTickets'
import { useStakingCalcAccounts } from '@sb/dexUtils/staking/useCalcAccounts'
import { useStakingSnapshotQueues } from '@sb/dexUtils/staking/useStakingSnapshotQueues'
import {
  useUserTokenAccounts,
  useAssociatedTokenAccount,
} from '@sb/dexUtils/token/hooks'
import { useInterval } from '@sb/dexUtils/useInterval'
import { useWallet } from '@sb/dexUtils/wallet'

import { getRINCirculationSupply } from '@core/api'
import { queryRendererHoc } from '@core/components/QueryRenderer'
import { getDexTokensPrices } from '@core/graphql/queries/pools/getDexTokensPrices'
import {
  stripByAmount,
  stripByAmountAndFormat,
  stripToMillions,
} from '@core/utils/chartPageUtils'
import { DAY, daysInMonthForDate } from '@core/utils/dateUtils'
import { stripDigitPlaces } from '@core/utils/PortfolioTableUtils'

import ClockIcon from '@icons/clock.svg'

import { ConnectWalletWrapper } from '../../../components/ConnectWalletWrapper'
import { DarkTooltip } from '../../../components/TooltipCustom/Tooltip'
import { restake } from '../../../dexUtils/staking/actions'
import { getSnapshotQueueWithAMMFees } from '../../../dexUtils/staking/getSnapshotQueueWithAMMFees'
import { toMap } from '../../../utils'
import { ImagesPath } from '../../Chart/components/Inputs/Inputs.utils'
import { BigNumber, FormsWrap } from '../styles'
import { getShareText } from '../utils'
import InfoIcon from './assets/info.svg'
import { StakingForm } from './StakingForm'
import { RestakeButton, ClaimButton } from './styles'
import { StakingInfoProps } from './types'
import { UnstakingForm } from './UnstakingForm'
import {
  resolveStakingNotification,
  resolveClaimNotification,
  resolveRestakeNotification,
  resolveUnstakingNotification,
} from './utils'

const UserStakingInfoContent: React.FC<StakingInfoProps> = (props) => {
  const {
    stakingPool,
    currentFarmingState,
    buyBackAmount,
    getDexTokensPricesQuery,
    treasuryDailyRewards,
  } = props

  const [totalStakedRIN, refreshTotalStaked] = useAccountBalance({
    publicKey: new PublicKey(stakingPool.stakingVault),
  })

  const tokenData = useAssociatedTokenAccount(
    currentFarmingState.farmingTokenMint
  )

  useInterval(() => {
    refreshTotalStaked()
  }, 30000)

  const [loading, setLoading] = useState({
    stake: false,
    unstake: false,
    claim: false,
  })

  const { wallet } = useWallet()
  const connection = useMultiEndpointConnection()

  const [userFarmingTickets, refreshUserFarmingTickets] = useAllStakingTickets({
    wallet,
    connection,
    walletPublicKey: wallet.publicKey,
    onlyUserTickets: true,
    // walletPublicKey,
  })

  const { data: calcAccounts, mutate: reloadCalcAccounts } =
    useStakingCalcAccounts()

  const [allStakingSnapshotQueues, refreshAllStakingSnapshotQueues] =
    useStakingSnapshotQueues({
      wallet,
      connection,
    })

  const totalStaked = getStakedTokensFromOpenFarmingTickets(
    getTicketsWithUiValues({
      tickets: userFarmingTickets,
      farmingTokenMintDecimals: currentFarmingState.farmingTokenMintDecimals,
    })
  )

  const stakingPoolWithClosedFarmings = {
    ...stakingPool,
    farming: stakingPool.farming.filter((state) => !isOpenFarmingState(state)),
  }

  const [allTokenData, refreshAllTokenData] = useUserTokenAccounts()

  const refreshAll = async () => {
    await Promise.all([
      refreshTotalStaked(),
      refreshUserFarmingTickets(),
      refreshAllStakingSnapshotQueues(),
      refreshAllTokenData(),
      reloadCalcAccounts(),
    ])
  }

  const [buyBackAmountOnAccount] = useAccountBalance({
    publicKey: new PublicKey(BUY_BACK_RIN_ACCOUNT_ADDRESS),
  })

  const buyBackAmountWithDecimals =
    buyBackAmountOnAccount * 10 ** currentFarmingState.farmingTokenMintDecimals

  const snapshotQueueWithAMMFees = getSnapshotQueueWithAMMFees({
    farmingSnapshotsQueueAddress: currentFarmingState.farmingSnapshots,
    buyBackAmount: buyBackAmountWithDecimals,
    snapshotQueues: allStakingSnapshotQueues,
  })

  const estimateRewardsTickets = addFarmingRewardsToTickets({
    farmingTickets: userFarmingTickets,
    pools: [stakingPool],
    snapshotQueues: snapshotQueueWithAMMFees,
  })

  const estimatedRewards = getAvailableToClaimFarmingTokens(
    estimateRewardsTickets,
    calcAccounts,
    currentFarmingState.farmingTokenMintDecimals
  )

  // userFarmingTickets.forEach((ft) => console.log('ft: ', ft))
  // calcAccounts.forEach((ca) => console.log('ca: ', ca.farmingState, ca.tokenAmount.toString()))

  // Available to claim rewards
  const availableToClaimTickets = addFarmingRewardsToTickets({
    farmingTickets: userFarmingTickets,
    pools: [stakingPoolWithClosedFarmings],
    snapshotQueues: allStakingSnapshotQueues,
  })

  // Available to claim on tickets & calc accounts
  const availableToClaim = getAvailableToClaimFarmingTokens(
    availableToClaimTickets,
    calcAccounts,
    currentFarmingState.farmingTokenMintDecimals
  )

  // Available to claim on tickets only
  const availableToClaimOnTickets = getAvailableToClaimFarmingTokens(
    availableToClaimTickets
  )

  const snapshotsProcessing = availableToClaimOnTickets !== 0

  // availableToClaimTotal = avail. to claim on clalcs only, if all snapshots processed
  const availableToClaimTotal = snapshotsProcessing
    ? 0
    : availableToClaim - availableToClaimOnTickets

  const lastFarmingTicket = userFarmingTickets.sort(
    (ticketA, ticketB) => +ticketB.startTime - +ticketA.startTime
  )[0]

  const unlockAvailableDate = lastFarmingTicket
    ? +lastFarmingTicket.startTime + +currentFarmingState?.periodLength
    : 0

  const isUnstakeLocked = unlockAvailableDate > Date.now() / 1000

  const isClaimDisabled = availableToClaimTotal === 0

  useInterval(() => {
    refreshAll()
  }, 30_000)

  const claimUnlockDataTimestamp = dayjs.unix(
    currentFarmingState.startTime +
      DAY * daysInMonthForDate(currentFarmingState.startTime)
  )
  const claimUnlockData = dayjs(claimUnlockDataTimestamp)
    .format('D-MMMM-YYYY')
    .replaceAll('-', ' ')

  const [isBalancesShowing, setIsBalancesShowing] = useState(true)

  const start = useCallback(
    async (amount: number) => {
      if (!tokenData?.address) {
        notify({ message: 'Account does not exists' })
        return false
      }

      setLoading((prev) => ({ ...prev, stake: true }))
      const result = await startStaking({
        connection,
        wallet,
        amount,
        userPoolTokenAccount: new PublicKey(tokenData.address),
        stakingPool,
        farmingTickets: userFarmingTickets,
        programAddress: STAKING_PROGRAM_ADDRESS,
      })

      notify({
        type: result === 'success' ? 'success' : 'error',
        message: resolveStakingNotification(result),
      })

      if (result === 'success') {
        await refreshAll()
      }
      setLoading((prev) => ({ ...prev, stake: false }))
      return true
    },
    [connection, wallet, tokenData, refreshAll]
  )

  const end = async (amount: number) => {
    if (!tokenData?.address) {
      notify({ message: 'Create RIN token account please.' })
      return false
    }

    setLoading((prev) => ({ ...prev, unstake: true }))

    // startStaking close all tickets and create one with added amount
    // partial end(amount) = start(-amount)
    const result = await startStaking({
      connection,
      wallet,
      amount: -amount,
      userPoolTokenAccount: new PublicKey(tokenData.address),
      stakingPool,
      farmingTickets: userFarmingTickets,
      programAddress: STAKING_PROGRAM_ADDRESS,
    })

    notify({
      type: result === 'success' ? 'success' : 'error',
      message: resolveUnstakingNotification(result),
    })

    if (result === 'success') {
      await refreshAll()
    }

    setLoading((prev) => ({ ...prev, unstake: false }))
    return true
  }

  const claimRewards = async () => {
    setLoading((prev) => ({ ...prev, claim: true }))
    const result = await withdrawStaked({
      connection,
      wallet,
      stakingPool,
      farmingTickets: userFarmingTickets,
      programAddress: STAKING_PROGRAM_ADDRESS,
      allTokensData: allTokenData,
    })

    notify({
      type: result === 'success' ? 'success' : 'error',
      message: resolveClaimNotification(result),
    })
    await refreshAll()
    setLoading((prev) => ({ ...prev, claim: false }))
  }

  const doRestake = async () => {
    if (!tokenData?.address) {
      notify({ message: 'Create RIN token account please.' })
      return false
    }

    setLoading((prev) => ({ ...prev, claim: true }))
    const result = await restake({
      wallet,
      farmingTickets: userFarmingTickets,
      allTokensData: allTokenData,
      amount: availableToClaimTotal,
      userPoolTokenAccount: new PublicKey(tokenData.address),
      stakingPool,
      connection,
    })

    notify({
      type: result === 'success' ? 'success' : 'error',
      message: resolveRestakeNotification(result),
    })
    await refreshAll()
    setLoading((prev) => ({ ...prev, claim: false }))
  }
  // TODO: separate it to another component

  const [RINCirculatingSupply, setCirculatingSupply] = useState(0)

  useEffect(() => {
    const getRINSupply = async () => {
      const CCAICircSupplyValue = await getRINCirculationSupply()
      setCirculatingSupply(CCAICircSupplyValue)
    }
    getRINSupply()
  }, [])

  const dexTokensPricesMap = toMap(
    getDexTokensPricesQuery?.getDexTokensPrices || [],
    (price) => price.symbol
  )

  const tokenPrice =
    dexTokensPricesMap?.get(
      getTokenNameByMintAddress(currentFarmingState.farmingTokenMint)
    )?.price || 0

  const totalStakedUSD = tokenPrice * totalStakedRIN

  const buyBackAPR =
    (buyBackAmount / DAYS_TO_CHECK_BUY_BACK / totalStakedRIN) * 365 * 100

  const treasuryAPR = (treasuryDailyRewards / totalStakedRIN) * 365 * 100

  const formattedBuyBackAPR =
    Number.isFinite(buyBackAPR) && buyBackAPR > 0
      ? stripByAmount(buyBackAPR, 2)
      : '--'

  const totalStakedPercentageToCircSupply =
    (totalStakedRIN * 100) / RINCirculatingSupply

  const formattedTreasuryAPR = Number.isFinite(treasuryAPR)
    ? stripByAmount(treasuryAPR, 2)
    : '--'

  const formattedAPR =
    Number.isFinite(buyBackAPR) &&
    buyBackAPR > 0 &&
    Number.isFinite(treasuryAPR)
      ? stripByAmount(buyBackAPR + treasuryAPR, 2)
      : '--'

  useEffect(() => {
    document.title = `Aldrin | Stake RIN | ${formattedAPR}% APR`
    return () => {
      document.title = 'Aldrin'
    }
  }, [formattedAPR])

  const shareText = getShareText(formattedAPR)

  const rinValue = stripByAmountAndFormat(totalStaked)
  const totalStakedValue = isBalancesShowing
    ? rinValue
    : new Array(rinValue.length).fill('∗').join('')

  const stakedInUsd = stripByAmountAndFormat(totalStaked * tokenPrice || 0, 2)
  const totalStakedUsdValue = isBalancesShowing
    ? stakedInUsd
    : new Array(stakedInUsd.length).fill('∗').join('')

  const strippedEstRewards = stripByAmountAndFormat(estimatedRewards || 0, 4)

  const userEstRewards = isBalancesShowing
    ? stripByAmountAndFormat(estimatedRewards, 4)
    : new Array(strippedEstRewards.length).fill('∗').join('')

  const strippedEstRewardsUSD = stripByAmountAndFormat(
    estimatedRewards * tokenPrice || 0,
    2
  )

  const userEstRewardsUSD = isBalancesShowing
    ? stripByAmountAndFormat(estimatedRewards * tokenPrice, 2)
    : new Array(strippedEstRewardsUSD.length).fill('∗').join('')

  return (
    <>
      <Row style={{ height: 'auto' }}>
        <Cell colMd={6} colXl={3} col={12}>
          <GreenBlock>
            <BlockContentStretched>
              <FlexBlock alignItems="center" justifyContent="space-between">
                <InlineText color="lightGray" size="sm">
                  Estimated Rewards
                </InlineText>
                <DarkTooltip
                  title={
                    <p>
                      Staking rewards are paid on the{' '}
                      <strong> 27th of the every month</strong> based on RIN
                      weekly buy-backs on 1/6th of AMM fees . Estimated rewards
                      are updated{' '}
                      <strong>hourly based on treasury rewards</strong>{' '}
                      and&nbsp;
                      <strong>weekly based on RIN buyback</strong>.
                    </p>
                  }
                >
                  <span>
                    <SvgIcon src={InfoIcon} width="0.8em" />
                  </span>
                </DarkTooltip>
              </FlexBlock>

              <FlexBlock alignItems="flex-end">
                <InlineText size="lg" weight={700} color="newGreen">
                  {formattedAPR}%{' '}
                  <InlineText
                    weight={400}
                    size="es"
                    style={{ color: 'rgba(38, 159, 19, 50%)' }}
                  >
                    APR
                  </InlineText>
                </InlineText>
              </FlexBlock>

              <StretchedBlock>
                <FlexBlock alignItems="center">
                  <InlineText
                    size="sm"
                    color="lightGray"
                    style={{
                      lineHeight: 'normal',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {formattedTreasuryAPR}% + {formattedBuyBackAPR}%
                  </InlineText>
                </FlexBlock>
                <div>
                  <ShareButton
                    iconFirst
                    text={shareText}
                    buttonStyle={{
                      minWidth: 'auto',
                      border: 'none',
                      fontSize: FONT_SIZES.sm,
                      padding: '0',
                    }}
                  />
                </div>
              </StretchedBlock>
            </BlockContentStretched>
          </GreenBlock>
        </Cell>
        <Cell colMd={6} colXl={3} col={12}>
          <Block>
            <BlockContentStretched>
              <InlineText color="lightGray" size="sm">
                Total staked{' '}
              </InlineText>{' '}
              <BigNumber>
                <InlineText>{stripToMillions(totalStakedRIN)} </InlineText>{' '}
                <InlineText color="primaryGray">RIN</InlineText>
              </BigNumber>
              <StretchedBlock align="flex-end">
                <InlineText size="sm">
                  <InlineText color="lightGray">$</InlineText>&nbsp;
                  {stripToMillions(totalStakedUSD)}
                </InlineText>{' '}
                <InlineText margin="0" size="sm">
                  {stripDigitPlaces(totalStakedPercentageToCircSupply, 0)}% of
                  circulating supply
                </InlineText>
              </StretchedBlock>
            </BlockContentStretched>
          </Block>
        </Cell>

        <Cell colMd={6} colXl={3} col={12}>
          <Block>
            <BlockContentStretched>
              <FlexBlock justifyContent="space-between" alignItems="center">
                <InlineText color="lightGray" size="sm">
                  Your stake
                </InlineText>{' '}
                <SvgIcon
                  style={{ cursor: 'pointer' }}
                  src={
                    isBalancesShowing ? ImagesPath.eye : ImagesPath.closedEye
                  }
                  width="0.9em"
                  height="auto"
                  onClick={() => {
                    setIsBalancesShowing(!isBalancesShowing)
                  }}
                />
              </FlexBlock>
              <BigNumber>
                <InlineText>{totalStakedValue} </InlineText>{' '}
                <InlineText color="primaryGray">RIN</InlineText>
              </BigNumber>
              <StretchedBlock align="flex-end">
                <InlineText size="sm">
                  <InlineText color="lightGray">$</InlineText>&nbsp;
                  {totalStakedUsdValue}
                </InlineText>{' '}
              </StretchedBlock>
            </BlockContentStretched>
          </Block>
        </Cell>
        <Cell colMd={6} colXl={3} col={12}>
          <Block>
            <BlockContentStretched>
              <FlexBlock alignItems="center" justifyContent="space-between">
                <InlineText color="lightGray" size="sm">
                  Your rewards
                </InlineText>
                <DarkTooltip
                  title={
                    <>
                      <p>
                        The first APR is calculated based on fixed “treasury”
                        rewards. These rewards estimation are updated hourly.
                      </p>
                      <p>
                        The second APR is calculated based on last RIN buyback
                        which are weekly.
                      </p>
                    </>
                  }
                >
                  <span>
                    <SvgIcon src={InfoIcon} width="0.8em" />
                  </span>
                </DarkTooltip>
              </FlexBlock>
              <BigNumber>
                <InlineText>{userEstRewards} </InlineText>{' '}
                <InlineText color="primaryGray">RIN</InlineText>
              </BigNumber>
              <StretchedBlock align="flex-end">
                <InlineText size="sm">
                  <InlineText color="lightGray">$</InlineText>&nbsp;
                  {userEstRewardsUSD}
                </InlineText>{' '}
                <FlexBlock>
                  <RestakeButton
                    disabled={isClaimDisabled || loading.claim}
                    $loading={loading.claim}
                    $fontSize="sm"
                    onClick={doRestake}
                  >
                    Restake
                  </RestakeButton>
                  <DarkTooltip
                    delay={0}
                    title={
                      !isClaimDisabled ? (
                        ''
                      ) : (
                        <p>
                          Rewards distribution takes place on the 27th day of
                          each month, you will be able to claim your reward for
                          this period on{' '}
                          <span style={{ color: COLORS.success }}>
                            {claimUnlockData}.
                          </span>
                        </p>
                      )
                    }
                  >
                    <span>
                      <ClaimButton
                        disabled={isClaimDisabled || loading.claim}
                        $loading={loading.claim}
                        $fontSize="sm"
                        onClick={claimRewards}
                      >
                        {isClaimDisabled ? <SvgIcon src={ClockIcon} /> : null}
                        Claim
                      </ClaimButton>
                    </span>
                  </DarkTooltip>
                </FlexBlock>
              </StretchedBlock>
            </BlockContentStretched>
          </Block>
        </Cell>
      </Row>
      <FormsWrap>
        <ConnectWalletWrapper text={null} size="sm">
          <Row>
            <Cell colMd={6} colSm={12}>
              <StakingForm
                tokenData={tokenData}
                start={start}
                loading={loading}
              />
            </Cell>
            <Cell colMd={6} colSm={12}>
              <UnstakingForm
                isUnstakeLocked={isUnstakeLocked}
                unlockAvailableDate={unlockAvailableDate}
                totalStaked={totalStaked}
                end={end}
                loading={loading}
                mint={currentFarmingState.farmingTokenMint}
              />
            </Cell>
          </Row>
        </ConnectWalletWrapper>
      </FormsWrap>
    </>
  )
}

const UserStakingInfo: React.FC<StakingInfoProps> = (props) => {
  const {
    stakingPool,
    currentFarmingState,
    buyBackAmount,
    getDexTokensPricesQuery,
    treasuryDailyRewards,
  } = props

  return (
    <StretchedBlock direction="column">
      <UserStakingInfoContent
        stakingPool={stakingPool}
        currentFarmingState={currentFarmingState}
        buyBackAmount={buyBackAmount}
        getDexTokensPricesQuery={getDexTokensPricesQuery}
        treasuryDailyRewards={treasuryDailyRewards}
      />
    </StretchedBlock>
  )
}

export default compose<InnerProps, OuterProps>(
  queryRendererHoc({
    query: getDexTokensPrices,
    name: 'getDexTokensPricesQuery',
    fetchPolicy: 'cache-and-network',
    withoutLoading: true,
    pollInterval: 60000,
  })
)(UserStakingInfo)
