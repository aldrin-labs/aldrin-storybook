import { PublicKey } from '@solana/web3.js'
import { COLORS } from '@variables/variables'
import dayjs from 'dayjs'
import React, { useCallback, useState } from 'react'

import { SvgIcon } from '@sb/components'
import { Block, BlockContent, BlockTitle } from '@sb/components/Block'
import { Button } from '@sb/components/Button'
import { ConnectWalletWrapper } from '@sb/components/ConnectWalletWrapper'
import { Cell, Row, StretchedBlock } from '@sb/components/Layout'
import { DarkTooltip } from '@sb/components/TooltipCustom/Tooltip'
import { InlineText } from '@sb/components/Typography'
import { dayDuration } from '@sb/compositions/AnalyticsRoute/components/utils'
import { withdrawStaked } from '@sb/dexUtils/common/actions'
import { startStaking } from '@sb/dexUtils/common/actions/startStaking'
import { getStakedTokensFromOpenFarmingTickets } from '@sb/dexUtils/common/getStakedTokensFromOpenFarmingTickets'
import { FarmingState } from '@sb/dexUtils/common/types'
import { useMultiEndpointConnection } from '@sb/dexUtils/connection'
import { notify } from '@sb/dexUtils/notifications'
import { addFarmingRewardsToTickets } from '@sb/dexUtils/pools/addFarmingRewardsToTickets/addFarmingRewardsToTickets'
import { getAvailableToClaimFarmingTokens } from '@sb/dexUtils/pools/getAvailableToClaimFarmingTokens'
import { STAKING_PROGRAM_ADDRESS } from '@sb/dexUtils/ProgramsMultiton/utils'
import { BUY_BACK_RIN_ACCOUNT_ADDRESS } from '@sb/dexUtils/staking/config'
import { isOpenFarmingState } from '@sb/dexUtils/staking/filterOpenFarmingStates'
import { getSnapshotQueueWithAMMFees } from '@sb/dexUtils/staking/getSnapshotQueueWithAMMFees'
import { getTicketsWithUiValues } from '@sb/dexUtils/staking/getTicketsWithUiValues'
import { StakingPool } from '@sb/dexUtils/staking/types'
import { useAccountBalance } from '@sb/dexUtils/staking/useAccountBalance'
import { useAllStakingTickets } from '@sb/dexUtils/staking/useAllStakingTickets'
import { useStakingCalcAccounts } from '@sb/dexUtils/staking/useCalcAccounts'
import { useStakingSnapshotQueues } from '@sb/dexUtils/staking/useStakingSnapshotQueues'
import { useUserTokenAccounts } from '@sb/dexUtils/token/hooks'
import { TokenInfo } from '@sb/dexUtils/types'
import { useInterval } from '@sb/dexUtils/useInterval'
import { useWallet } from '@sb/dexUtils/wallet'

import {
  stripByAmount,
  stripByAmountAndFormat,
} from '@core/utils/chartPageUtils'
import { daysInMonthForDate } from '@core/utils/dateUtils'
import { stripDigitPlaces } from '@core/utils/PortfolioTableUtils'

import InfoIcon from '@icons/inform.svg'

import { restake } from '../../../dexUtils/staking/actions'
import { ImagesPath } from '../../Chart/components/Inputs/Inputs.utils'
import {
  Asterisks,
  BalanceRow,
  BalanceWrap,
  ClaimButtonContainer,
  Digit,
  FormsContainer,
  RestakeButton,
  RewardsBlock,
  RewardsStats,
  RewardsStatsRow,
  RewardsTitle,
  StyledTextDiv,
  TotalStakedBlock,
  WalletAvailableTitle,
  WalletBalanceBlock,
  WalletRow,
} from '../styles'
import { RestakePopup } from './RestakePopup'
import { StakingForm } from './StakingForm'
import { UnstakingForm } from './UnstakingForm'

interface UserBalanceProps {
  value: number
  visible: boolean
  decimals?: number
}

interface StakingInfoProps {
  tokenData: TokenInfo | undefined
  stakingPool: StakingPool
  currentFarmingState: FarmingState
}

const UserBalance: React.FC<UserBalanceProps> = (props) => {
  const { decimals, value, visible } = props
  const formatted = decimals
    ? stripDigitPlaces(value, decimals)
    : stripByAmountAndFormat(value)
  const len = `${formatted}`.length
  let asterisks = ''
  for (let i = 0; i < len; i += 1) {
    asterisks += '*'
  }
  return (
    <BalanceRow>
      <Digit>{visible ? formatted : <Asterisks>{asterisks}</Asterisks>}</Digit>
      &nbsp;RIN
    </BalanceRow>
  )
}

const resolveStakingNotification = (status: 'success' | 'failed' | string) => {
  if (status === 'success') {
    return 'Successfully staked.'
  }
  if (status === 'failed') {
    return 'Staking failed, please try again later or contact us in telegram.'
  }

  return 'Staking cancelled.'
}

const resolveUnstakingNotification = (
  status: 'success' | 'failed' | string
) => {
  if (status === 'success') {
    return 'Successfully unstaked.'
  }
  if (status === 'failed') {
    return 'Unstaking failed, please try again later or contact us in telegram.'
  }

  return 'Unstaking cancelled.'
}

const resolveClaimNotification = (
  status: 'success' | 'failed' | 'rejected' | string
) => {
  if (status === 'success') {
    return 'Successfully claimed rewards.'
  }
  if (status === 'failed') {
    return 'Claim rewards failed, please try again later or contact us in telegram.'
  }
  if (status === 'rejected') {
    return 'Claim rewards cancelled.'
  }

  return 'Operation timeout, please claim rest rewards in a few seconds.'
}

const resolveRestakeNotification = (
  status: 'success' | 'failed' | 'rejected' | string
) => {
  if (status === 'success') {
    return 'Successfully restaked.'
  }
  if (status === 'failed') {
    return 'Restake failed, please try again later or contact us in telegram.'
  }
  if (status === 'rejected') {
    return 'Restake cancelled.'
  }

  return 'Operation timeout, please claim rest rewards in a few seconds.'
}

const UserStakingInfoContent: React.FC<StakingInfoProps> = (props) => {
  const { tokenData, stakingPool, currentFarmingState } = props

  const [isBalancesShowing, setIsBalancesShowing] = useState(true)
  const [isRestakePopupOpen, setIsRestakePopupOpen] = useState(false)
  const [loading, setLoading] = useState({
    stake: false,
    unstake: false,
    claim: false,
  })

  const { wallet } = useWallet()
  const connection = useMultiEndpointConnection()

  const walletAddress = wallet?.publicKey?.toString() || ''

  const [userFarmingTickets, refreshUserFarmingTickets] = useAllStakingTickets({
    wallet,
    connection,
    walletPublicKey: wallet.publicKey,
    // walletPublicKey,
  })

  const { data: calcAccounts, mutate: reloadCalcAccounts } =
    useStakingCalcAccounts()

  const [buyBackAmountOnAccount] = useAccountBalance({
    publicKey: new PublicKey(BUY_BACK_RIN_ACCOUNT_ADDRESS),
  })

  const [_, refreshTotalStaked] = useAccountBalance({
    publicKey: new PublicKey(stakingPool.stakingVault),
  })

  const buyBackAmountWithDecimals =
    buyBackAmountOnAccount * 10 ** currentFarmingState.farmingTokenMintDecimals

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

  const snapshotQueueWithAMMFees = getSnapshotQueueWithAMMFees({
    farmingSnapshotsQueueAddress: currentFarmingState.farmingSnapshots,
    buyBackAmount: buyBackAmountWithDecimals,
    snapshotQueues: allStakingSnapshotQueues,
  })

  // Total rewards, include not finished state
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
      dayDuration * daysInMonthForDate(currentFarmingState.startTime)
  )
  const claimUnlockData = dayjs(claimUnlockDataTimestamp)
    .format('D-MMMM-YYYY')
    .replaceAll('-', ' ')

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
  return (
    <>
      <BlockContent border>
        <WalletRow>
          <div>
            <StretchedBlock align="center">
              <BlockTitle>Your RIN Staking</BlockTitle>
              <SvgIcon
                style={{ cursor: 'pointer' }}
                src={isBalancesShowing ? ImagesPath.eye : ImagesPath.closedEye}
                width="1.5em"
                height="auto"
                onClick={() => {
                  setIsBalancesShowing(!isBalancesShowing)
                }}
              />
            </StretchedBlock>
            <StyledTextDiv>
              {isBalancesShowing ? walletAddress : '***'}
            </StyledTextDiv>
          </div>
          <WalletBalanceBlock>
            <WalletAvailableTitle>Available in wallet:</WalletAvailableTitle>
            <BalanceWrap>
              <UserBalance
                visible={isBalancesShowing}
                value={tokenData?.amount || 0}
              />
            </BalanceWrap>
          </WalletBalanceBlock>
        </WalletRow>
      </BlockContent>
      <BlockContent>
        <Row>
          <Cell colMd={4} colLg={12} colXl={4}>
            <TotalStakedBlock inner>
              <BlockContent>
                <DarkTooltip title={`${stripByAmount(totalStaked)} RIN`}>
                  <RewardsStatsRow>
                    <RewardsTitle>Total staked:</RewardsTitle>
                    <UserBalance
                      visible={isBalancesShowing}
                      value={totalStaked}
                    />
                  </RewardsStatsRow>
                </DarkTooltip>
              </BlockContent>
            </TotalStakedBlock>
          </Cell>
          <Cell colMd={8} colLg={12} colXl={8}>
            <RewardsBlock inner>
              <BlockContent>
                <RewardsStats>
                  <RewardsStatsRow>
                    <RewardsTitle style={{ display: 'flex' }}>
                      Est.Rewards:
                      <DarkTooltip
                        title={
                          <p>
                            Staking rewards are paid on the{' '}
                            <strong> 27th of the every month</strong> based on
                            RIN weekly buy-backs on 1/6th of AMM fees .
                            Estimated rewards are updated{' '}
                            <strong>hourly based on treasury rewards</strong>{' '}
                            and&nbsp;
                            <strong>weekly based on RIN buyback</strong>.
                          </p>
                        }
                      >
                        <div>
                          <SvgIcon
                            src={InfoIcon}
                            width="1.75rem"
                            height="1.75rem"
                            style={{ marginLeft: '0.75rem' }}
                          />
                        </div>
                      </DarkTooltip>
                    </RewardsTitle>
                    <DarkTooltip
                      title={`${stripByAmount(estimatedRewards)} RIN`}
                    >
                      <div>
                        <UserBalance
                          visible={isBalancesShowing}
                          value={estimatedRewards}
                          decimals={2}
                        />
                      </div>
                    </DarkTooltip>
                  </RewardsStatsRow>
                  <DarkTooltip
                    title={`${stripByAmount(availableToClaimTotal)} RIN`}
                  >
                    <RewardsStatsRow>
                      <RewardsTitle>Available to claim:</RewardsTitle>
                      {snapshotsProcessing ? (
                        <InlineText size="sm">Processing...</InlineText>
                      ) : (
                        <UserBalance
                          visible={isBalancesShowing}
                          value={availableToClaimTotal}
                          decimals={2}
                        />
                      )}
                    </RewardsStatsRow>
                  </DarkTooltip>
                  <ClaimButtonContainer>
                    <DarkTooltip
                      delay={0}
                      title={
                        !isClaimDisabled ? (
                          ''
                        ) : (
                          <p>
                            Rewards distribution takes place on the 27th day of
                            each month, you will be able to claim your reward
                            for this period on{' '}
                            <span style={{ color: COLORS.success }}>
                              {claimUnlockData}.
                            </span>
                          </p>
                        )
                      }
                    >
                      <span>
                        <Button
                          $variant="primary"
                          $fontSize="xs"
                          $padding="lg"
                          disabled={isClaimDisabled || loading.claim}
                          $loading={loading.claim}
                          $borderRadius="xxl"
                          onClick={claimRewards}
                        >
                          Claim
                        </Button>
                      </span>
                    </DarkTooltip>
                    <RestakeButton
                      $variant="link"
                      $fontSize="xs"
                      $padding="lg"
                      disabled={isClaimDisabled || loading.claim}
                      $loading={loading.claim}
                      $borderRadius="xxl"
                      onClick={doRestake}
                    >
                      Restake
                    </RestakeButton>
                  </ClaimButtonContainer>
                </RewardsStats>
              </BlockContent>
            </RewardsBlock>
          </Cell>
        </Row>

        <FormsContainer>
          <StakingForm tokenData={tokenData} start={start} loading={loading} />
          <UnstakingForm
            isUnstakeLocked={isUnstakeLocked}
            unlockAvailableDate={unlockAvailableDate}
            totalStaked={totalStaked}
            end={end}
            loading={loading}
          />
        </FormsContainer>
      </BlockContent>
      <RestakePopup
        open={isRestakePopupOpen}
        close={() => setIsRestakePopupOpen(false)}
      />
    </>
  )
}

const UserStakingInfo: React.FC<StakingInfoProps> = (props) => {
  const { tokenData, stakingPool, currentFarmingState } = props
  return (
    <Block>
      <StretchedBlock direction="column">
        <ConnectWalletWrapper>
          <UserStakingInfoContent
            stakingPool={stakingPool}
            tokenData={tokenData}
            currentFarmingState={currentFarmingState}
          />
        </ConnectWalletWrapper>
      </StretchedBlock>
    </Block>
  )
}

export default UserStakingInfo
