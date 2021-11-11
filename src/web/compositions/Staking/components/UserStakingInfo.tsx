import {
  stripByAmount,
  stripByAmountAndFormat,
} from '@core/utils/chartPageUtils'
import { sleep } from '@core/utils/helpers'
import { stripDigitPlaces } from '@core/utils/PortfolioTableUtils'
import { withTheme } from '@material-ui/core/styles'
import { SvgIcon } from '@sb/components'
import { Block, BlockContent, BlockTitle } from '@sb/components/Block'
import { Button } from '@sb/components/Button'
import { ConnectWalletWrapper } from '@sb/components/ConnectWalletWrapper'
import { Cell, Row, StretchedBlock } from '@sb/components/Layout'
import { DarkTooltip } from '@sb/components/TooltipCustom/Tooltip'
import { ClaimRewards } from '@sb/compositions/Pools/components/Popups/ClaimRewards/ClaimRewards'
import { getStakedTokensFromOpenFarmingTickets } from '@sb/dexUtils/common/getStakedTokensFromOpenFarmingTickets'
import { FarmingTicket } from '@sb/dexUtils/common/types'
import { useConnection } from '@sb/dexUtils/connection'
import { notify } from '@sb/dexUtils/notifications'
import { addFarmingRewardsToTickets } from '@sb/dexUtils/pools/addFarmingRewardsToTickets/addFarmingRewardsToTickets'
import { getSnapshotsWithUnclaimedRewards } from '@sb/dexUtils/pools/addFarmingRewardsToTickets/getSnapshotsWithUnclaimedRewards'
import { isOpenFarmingState } from '@sb/dexUtils/pools/filterOpenFarmingStates'
import { getAvailableToClaimFarmingTokens } from '@sb/dexUtils/pools/getAvailableToClaimFarmingTokens'
import { withdrawFarmed } from '@sb/dexUtils/pools/withdrawFarmed'
import { STAKING_PROGRAM_ADDRESS } from '@sb/dexUtils/ProgramsMultiton/utils'
import { calculateAvailableToClaim } from '@sb/dexUtils/staking/calculateAvailableToClaim'
import { calculateUserStakingRewards } from '@sb/dexUtils/staking/calculateUserStakingRewards'
import { endStaking } from '@sb/dexUtils/staking/endStaking'
import { filterFarmingTicketsByUserKey } from '@sb/dexUtils/staking/filterFarmingTicketsByUserKey'
import { getCurrentFarmingStateFromAll } from '@sb/dexUtils/staking/getCurrentFarmingStateFromAll'
import { startStaking } from '@sb/dexUtils/staking/startStaking'
import { StakingPool } from '@sb/dexUtils/staking/types'
import { useStakingSnapshotQueues } from '@sb/dexUtils/staking/useStakingSnapshotQueues'
import { useStakingTicketsWithAvailableToClaim } from '@sb/dexUtils/staking/useStakingTicketsWithAvailableToClaim'
import { RefreshFunction, TokenInfo } from '@sb/dexUtils/types'
import { useInterval } from '@sb/dexUtils/useInterval'
import { useWallet } from '@sb/dexUtils/wallet'
import { PublicKey } from '@solana/web3.js'
import { COLORS } from '@variables/variables'
import React, { useCallback, useState } from 'react'
import { compose } from 'recompose'
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
  tokenData: TokenInfo | undefined
  stakingPool: StakingPool
  refreshAllTokenData: RefreshFunction
  allStakingFarmingTickets: FarmingTicket[]
  refreshAllStakingFarmingTickets: RefreshFunction
  theme: Theme
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

const UserStakingInfoContent: React.FC<StakingInfoProps> = (props) => {
  const {
    tokenData,
    stakingPool,
    refreshAllTokenData,
    allStakingFarmingTickets,
    refreshAllStakingFarmingTickets,
    allTokenData,
    theme,
  } = props
  const [isBalancesShowing, setIsBalancesShowing] = useState(true)
  const [isRestakePopupOpen, setIsRestakePopupOpen] = useState(false)
  const [loading, setLoading] = useState({ stake: false, unstake: false })
  const [isClaimRewardsPopupOpen, setIsClaimRewardsPopupOpen] = useState(false)

  const { wallet } = useWallet()
  const connection = useConnection()

  const walletAddress = wallet?.publicKey?.toString() || ''

  const userFarmingTickets = filterFarmingTicketsByUserKey({
    allFarmingTickets: allStakingFarmingTickets,
    walletPublicKey: wallet.publicKey,
  })

  const [
    allStakingSnapshotQueues,
    refreshAllStakingSnapshotQueues,
  ] = useStakingSnapshotQueues({
    wallet,
    connection,
  })

  const totalStaked = getStakedTokensFromOpenFarmingTickets(userFarmingTickets)
  const stakingPoolWithClosedFarmings = {
    ...stakingPool,
    farming: stakingPool.farming.filter((state) => !isOpenFarmingState(state)),
  }

  console.log('stakingPoolWithClosedFarmings', stakingPoolWithClosedFarmings)

  const refreshAll = async () => {
    await Promise.all([
      refreshAllStakingFarmingTickets(),
      refreshAllStakingSnapshotQueues(),
      refreshAllTokenData(),
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
      })

      notify({
        type: result === 'success' ? 'success' : 'error',
        message: resolveStakingNotification(result),
      })

      if (result === 'success') {
        await sleep(7500)
        await refreshAll()
      }

      setLoading({ stake: false, unstake: false })
      return true
    },
    [connection, wallet, tokenData, refreshAllStakingFarmingTickets]
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
      await sleep(5000)
      await refreshAll()
    }

    setLoading({ stake: false, unstake: false })
    return true
  }

  const [
    stakingTicketsWithAvailableToClaim,
  ] = useStakingTicketsWithAvailableToClaim({
    wallet,
    connection,
    walletPublicKey: wallet.publicKey,
    stakingPool,
    snapshotQueues: allStakingSnapshotQueues,
    allStakingFarmingTickets: userFarmingTickets.map((t) => ({
      ...t,
      tokensFrozen: t.tokensFrozen * 10 ** 9,
    })),
  })

  const userRewards = getAvailableToClaimFarmingTokens(
    stakingTicketsWithAvailableToClaim
  )

  console.log('stakingTicketsWithAvailableToClaim', userFarmingTickets)

  const availableToClaimTotal = getAvailableToClaimFarmingTokens(
    addFarmingRewardsToTickets({
      farmingTickets: userFarmingTickets.map((t) => ({
        ...t,
        tokensFrozen: t.tokensFrozen * 10 ** 9,
      })),
      pools: [stakingPoolWithClosedFarmings],
      snapshotQueues: allStakingSnapshotQueues,
    })
  )

  const lastFarmingTicket = userFarmingTickets.sort(
    (ticketA, ticketB) => +ticketB.startTime - +ticketA.startTime
  )[0]

  const currentFarmingState = getCurrentFarmingStateFromAll(
    stakingPool?.farming || []
  )

  const unlockAvailableDate = lastFarmingTicket
    ? +lastFarmingTicket.startTime + +currentFarmingState?.periodLength
    : 0

  const isUnstakeLocked = unlockAvailableDate > Date.now() / 1000

  const farmingTicketsMap = stakingTicketsWithAvailableToClaim.reduce(
    (acc, farmingTicket) => {
      const { pool } = farmingTicket

      if (acc.has(pool)) {
        acc.set(pool, [...acc.get(pool), farmingTicket])
      } else {
        acc.set(pool, [farmingTicket])
      }

      return acc
    },
    new Map()
  )

  useInterval(() => {
    refreshAllStakingSnapshotQueues()
    refreshAllTokenData()
  }, 60000)

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
                <RewardsStatsRow>
                  <RewardsTitle>Total staked:</RewardsTitle>
                  <UserBalance
                    visible={isBalancesShowing}
                    value={totalStaked}
                  />
                </RewardsStatsRow>
              </BlockContent>
            </TotalStakedBlock>
          </Cell>
          <Cell colMd={8} colLg={12} colXl={8}>
            <RewardsBlock inner>
              <BlockContent>
                <RewardsStats>
                  <DarkTooltip title={`${stripByAmount(userRewards)} RIN`}>
                    <RewardsStatsRow>
                      <RewardsTitle>Rewards:</RewardsTitle>
                      <UserBalance
                        visible={isBalancesShowing}
                        value={userRewards}
                        decimals={2}
                      />
                    </RewardsStatsRow>
                  </DarkTooltip>

                  <RewardsStatsRow>
                    <RewardsTitle>Available to claim:</RewardsTitle>
                    <UserBalance
                      visible={isBalancesShowing}
                      value={availableToClaimTotal}
                    />
                  </RewardsStatsRow>

                  <ClaimButtonContainer>
                    <DarkTooltip
                      title={
                        <p>
                          Rewards distribution takes place on the 27th day of
                          each month, you will be able to claim your reward for
                          this period on{' '}
                          <span style={{ color: COLORS.success }}>
                            27 November 2021.
                          </span>
                        </p>
                      }
                    >
                      <span>
                        <Button
                          variant="disabled"
                          fontSize="xs"
                          padding="lg"
                          borderRadius="xxl"
                          onClick={() => {
                            withdrawFarmed({
                              wallet,
                              connection,
                              allTokensData: allTokenData,
                              farmingTickets: userFarmingTickets,
                              pool: stakingPool,
                              programAddress: STAKING_PROGRAM_ADDRESS,
                            })
                          }}
                        >
                          Claim
                        </Button>
                      </span>
                    </DarkTooltip>
                    <Button
                      fontSize="xs"
                      padding="lg"
                      variant="link"
                      // disabled
                      onClick={() => setIsClaimRewardsPopupOpen(true)}
                    >
                      Restake
                    </Button>
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
      <ClaimRewards
        theme={theme}
        open={isClaimRewardsPopupOpen}
        close={() => setIsClaimRewardsPopupOpen(false)}
        selectedPool={stakingPool}
        programId={STAKING_PROGRAM_ADDRESS}
        allTokensData={allTokenData}
        farmingTicketsMap={farmingTicketsMap}
        snapshotQueues={allStakingSnapshotQueues}
        refreshTokensWithFarmingTickets={refreshAllStakingFarmingTickets}
        setPoolWaitingForUpdateAfterOperation={() => {}}
        callback={() => {
          startStaking({
            wallet,
            connection,
            amount: availableToClaimTotal,
            userPoolTokenAccount: new PublicKey(tokenData.address),
            stakingPool,
          })
        }}
      />
    </>
  )
}

const UserStakingInfo: React.FC<StakingInfoProps> = (props) => {
  const {
    tokenData,
    stakingPool,
    refreshAllTokenData,
    allStakingFarmingTickets,
    refreshAllStakingFarmingTickets,
    allTokenData,
  } = props
  return (
    <Block>
      <StretchedBlock direction="column">
        <ConnectWalletWrapper>
          <UserStakingInfoContent
            stakingPool={stakingPool}
            tokenData={tokenData}
            refreshAllTokenData={refreshAllTokenData}
            allStakingFarmingTickets={allStakingFarmingTickets}
            refreshAllStakingFarmingTickets={refreshAllStakingFarmingTickets}
          />
        </ConnectWalletWrapper>
      </StretchedBlock>
    </Block>
  )
}

export default compose(withTheme())(UserStakingInfo)
