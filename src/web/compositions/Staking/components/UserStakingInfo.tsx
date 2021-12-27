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
import { ClaimRewards } from '@sb/compositions/Pools/components/Popups/ClaimRewards/ClaimRewards'
import { getStakedTokensFromOpenFarmingTickets } from '@sb/dexUtils/common/getStakedTokensFromOpenFarmingTickets'
import { FarmingState } from '@sb/dexUtils/common/types'
import { useMultiEndpointConnection } from '@sb/dexUtils/connection'
import { notify } from '@sb/dexUtils/notifications'
import { addFarmingRewardsToTickets } from '@sb/dexUtils/pools/addFarmingRewardsToTickets/addFarmingRewardsToTickets'
import { getAvailableToClaimFarmingTokens } from '@sb/dexUtils/pools/getAvailableToClaimFarmingTokens'
import { STAKING_PROGRAM_ADDRESS } from '@sb/dexUtils/ProgramsMultiton/utils'
import { BUY_BACK_RIN_ACCOUNT_ADDRESS } from '@sb/dexUtils/staking/config'
import { endStaking } from '@sb/dexUtils/staking/endStaking'
import { isOpenFarmingState } from '@sb/dexUtils/staking/filterOpenFarmingStates'
import { getSnapshotQueueWithAMMFees } from '@sb/dexUtils/staking/getSnapshotQueueWithAMMFees'
import { getTicketsWithUiValues } from '@sb/dexUtils/staking/getTicketsWithUiValues'
import { startStaking } from '@sb/dexUtils/staking/startStaking'
import { StakingPool } from '@sb/dexUtils/staking/types'
import { useAccountBalance } from '@sb/dexUtils/staking/useAccountBalance'
import { useAllStakingTickets } from '@sb/dexUtils/staking/useAllStakingTickets'
import { useCalcAccounts } from '@sb/dexUtils/staking/useCalcAccounts'
import { useStakingSnapshotQueues } from '@sb/dexUtils/staking/useStakingSnapshotQueues'
import { withdrawStaked } from '@sb/dexUtils/staking/withdrawStaked'
import {
  AsyncRefreshVoidFunction,
  RefreshFunction,
  TokenInfo,
} from '@sb/dexUtils/types'
import { useInterval } from '@sb/dexUtils/useInterval'
import { useWallet } from '@sb/dexUtils/wallet'

import {
  stripByAmount,
  stripByAmountAndFormat,
} from '@core/utils/chartPageUtils'
import { daysInMonthForDate } from '@core/utils/dateUtils'
import { stripDigitPlaces } from '@core/utils/PortfolioTableUtils'

import InfoIcon from '@icons/inform.svg'

import { groupBy } from '../../../utils/collection'
import { ImagesPath } from '../../Chart/components/Inputs/Inputs.utils'
import {
  Asterisks,
  BalanceRow,
  BalanceWrap,
  ClaimButtonContainer,
  Digit,
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

interface UserBalanceProps {
  value: number
  visible: boolean
  decimals?: number
}

interface StakingInfoProps {
  allTokenData: TokenInfo[]
  tokenData: TokenInfo | undefined
  stakingPool: StakingPool
  refreshAllTokenData: RefreshFunction
  refreshTotalStaked: AsyncRefreshVoidFunction
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

// const walletPublicKey = new PublicKey(
//   '5FbM2CWzq33t1gMaYdxYvm4xVjh39nV8KfgdSt5L2ktH'
// )

const UserStakingInfoContent: React.FC<StakingInfoProps> = (props) => {
  const {
    tokenData,
    stakingPool,
    refreshAllTokenData,
    refreshTotalStaked,
    allTokenData,
    currentFarmingState,
  } = props

  const [isBalancesShowing, setIsBalancesShowing] = useState(true)
  const [isRestakePopupOpen, setIsRestakePopupOpen] = useState(false)
  const [loading, setLoading] = useState({ stake: false, unstake: false })
  const [
    isClaimRewardsAndRestakePopupOpen,
    setIsClaimRewardsAndRestakePopupOpen,
  ] = useState(false)

  const [isClaimRewardsPopupOpen, setIsClaimRewardsPopupOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const { wallet } = useWallet()
  const connection = useMultiEndpointConnection()

  const walletAddress = wallet?.publicKey?.toString() || ''

  const [userFarmingTickets, refreshUserFarmingTickets] = useAllStakingTickets({
    wallet,
    connection,
    walletPublicKey: wallet.publicKey,
    // walletPublicKey,
  })

  const [calcAccounts, reloadCalcAccounts] = useCalcAccounts({
    wallet,
    connection,
    walletPublicKey: wallet.publicKey,
    // walletPublicKey,
  })

  const [buyBackAmountOnAccount] = useAccountBalance({
    publicKey: new PublicKey(BUY_BACK_RIN_ACCOUNT_ADDRESS),
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

  const refreshAll = async () => {
    await Promise.all([
      refreshTotalStaked(),
      refreshUserFarmingTickets(),
      refreshAllStakingSnapshotQueues(),
      refreshAllTokenData(),
      reloadCalcAccounts(),
    ])
  }

  const start = useCallback(
    async (amount: number) => {
      if (!tokenData?.address) {
        notify({ message: 'Account does not exists' })
        return false
      }

      console.log(
        'tokenData.address',
        tokenData?.address,
        connection,
        wallet,
        amount,
        stakingPool
      )

      setLoading({ stake: true, unstake: false })
      const result = await startStaking({
        connection,
        wallet,
        amount,
        userPoolTokenAccount: new PublicKey(tokenData.address),
        stakingPool,
        farmingTickets: userFarmingTickets,
      })

      notify({
        type: result === 'success' ? 'success' : 'error',
        message: resolveStakingNotification(result),
      })

      console.log('stake result: ', result)

      if (result === 'success') {
        await refreshAll()
      }

      setLoading({ stake: false, unstake: false })
      return true
    },
    [connection, wallet, tokenData, refreshAll]
  )

  const end = async () => {
    if (!tokenData?.address) {
      notify({ message: 'Create RIN token account please.' })
      return false
    }

    setLoading({ stake: false, unstake: true })

    const result = await endStaking({
      connection,
      wallet,
      userPoolTokenAccount: new PublicKey(tokenData.address),
      farmingTickets: userFarmingTickets,
      stakingPool,
    })

    notify({
      type: result === 'success' ? 'success' : 'error',
      message: resolveUnstakingNotification(result),
    })

    if (result === 'success') {
      await refreshAll()
    }

    setLoading({ stake: false, unstake: false })
    return true
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

  console.log('availableToClaimOnTickets: ', availableToClaimOnTickets)

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

  const farmingTicketsMap = groupBy(
    availableToClaimTickets,
    (ticket) => ticket.pool
  )

  const isClaimDisabled = availableToClaimTotal === 0

  useInterval(() => {
    refreshAll()
  }, 30000)

  const toggleIsLoading = useCallback(() => {
    setIsLoading(!isLoading)
  }, [isLoading])

  const claimUnlockDataTimestamp = dayjs.unix(
    currentFarmingState.startTime +
      dayDuration * daysInMonthForDate(currentFarmingState.startTime)
  )
  const claimUnlockData = dayjs(claimUnlockDataTimestamp)
    .format('D-MMMM-YYYY')
    .replaceAll('-', ' ')
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
                          disabled={isClaimDisabled}
                          $loading={isLoading}
                          $borderRadius="xxl"
                          onClick={() => setIsClaimRewardsPopupOpen(true)}
                        >
                          Claim
                        </Button>
                      </span>
                    </DarkTooltip>
                    {/* <Button
                      fontSize="xs"
                      padding="lg"
                      variant={isClaimDisabled ? 'disabledLink' : 'link'}
                      disabled={isClaimDisabled}
                      onClick={() => setIsClaimRewardsAndRestakePopupOpen(true)}
                    >
                      Restake
                    </Button> */}
                  </ClaimButtonContainer>
                </RewardsStats>
              </BlockContent>
            </RewardsBlock>
          </Cell>
        </Row>

        <StakingForm
          isUnstakeLocked={isUnstakeLocked}
          unlockAvailableDate={unlockAvailableDate}
          tokenData={tokenData}
          totalStaked={totalStaked}
          start={start}
          end={end}
          loading={loading}
        />
      </BlockContent>
      <RestakePopup
        open={isRestakePopupOpen}
        close={() => setIsRestakePopupOpen(false)}
      />
      {(isClaimRewardsPopupOpen || isClaimRewardsAndRestakePopupOpen) && (
        <ClaimRewards
          close={() => {
            setIsLoading(false)
            if (isClaimRewardsPopupOpen) {
              setIsClaimRewardsPopupOpen(false)
            } else {
              setIsClaimRewardsAndRestakePopupOpen(false)
            }
          }}
          selectedPool={stakingPoolWithClosedFarmings}
          programId={STAKING_PROGRAM_ADDRESS}
          allTokensData={allTokenData}
          farmingTicketsMap={farmingTicketsMap}
          snapshotQueues={snapshotQueueWithAMMFees}
          refreshTokensWithFarmingTickets={refreshAll}
          setPoolWaitingForUpdateAfterOperation={toggleIsLoading}
          withdrawFunction={withdrawStaked}
          hideMaintenanceWarning
          callback={async () => {
            setIsLoading(false)
            if (isClaimRewardsAndRestakePopupOpen) {
              if (!tokenData) {
                throw new Error('No token data!')
              }
              await startStaking({
                wallet,
                connection,
                amount: availableToClaimTotal,
                userPoolTokenAccount: new PublicKey(tokenData.address),
                stakingPool,
                farmingTickets: userFarmingTickets,
              })
            }
            return true
          }}
        />
      )}
    </>
  )
}

const UserStakingInfo: React.FC<StakingInfoProps> = (props) => {
  const {
    tokenData,
    stakingPool,
    refreshAllTokenData,
    refreshTotalStaked,
    allTokenData,
    currentFarmingState,
  } = props
  return (
    <Block>
      <StretchedBlock direction="column">
        <ConnectWalletWrapper>
          <UserStakingInfoContent
            allTokenData={allTokenData}
            stakingPool={stakingPool}
            tokenData={tokenData}
            currentFarmingState={currentFarmingState}
            refreshAllTokenData={refreshAllTokenData}
            refreshTotalStaked={refreshTotalStaked}
          />
        </ConnectWalletWrapper>
      </StretchedBlock>
    </Block>
  )
}

export default UserStakingInfo
