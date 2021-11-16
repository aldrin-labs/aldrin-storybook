import React, { useCallback, useEffect, useState } from 'react'
import { compose } from 'recompose'
import {
  stripByAmount,
  stripByAmountAndFormat,
} from '@core/utils/chartPageUtils'
import { sleep } from '@core/utils/helpers'
import { stripDigitPlaces } from '@core/utils/PortfolioTableUtils'
import { Theme, withTheme } from '@material-ui/core/styles'
import { SvgIcon } from '@sb/components'
import { Block, BlockContent, BlockTitle } from '@sb/components/Block'
import { Button } from '@sb/components/Button'
import { ConnectWalletWrapper } from '@sb/components/ConnectWalletWrapper'
import { Cell, Row, StretchedBlock } from '@sb/components/Layout'
import { Loader } from '@sb/components/Loader/Loader'
import { DarkTooltip } from '@sb/components/TooltipCustom/Tooltip'
import { ClaimRewards } from '@sb/compositions/Pools/components/Popups/ClaimRewards/ClaimRewards'
import { getStakedTokensFromOpenFarmingTickets } from '@sb/dexUtils/common/getStakedTokensFromOpenFarmingTickets'
import { FarmingState, FarmingTicket } from '@sb/dexUtils/common/types'
import { useConnection } from '@sb/dexUtils/connection'
import { notify } from '@sb/dexUtils/notifications'
import { addFarmingRewardsToTickets } from '@sb/dexUtils/pools/addFarmingRewardsToTickets/addFarmingRewardsToTickets'
import { getAvailableToClaimFarmingTokens } from '@sb/dexUtils/pools/getAvailableToClaimFarmingTokens'
import { STAKING_PROGRAM_ADDRESS } from '@sb/dexUtils/ProgramsMultiton/utils'
import { endStaking } from '@sb/dexUtils/staking/endStaking'
import { filterFarmingTicketsByUserKey } from '@sb/dexUtils/staking/filterFarmingTicketsByUserKey'
import { isOpenFarmingState } from '@sb/dexUtils/staking/filterOpenFarmingStates'
import { getCurrentFarmingStateFromAll } from '@sb/dexUtils/staking/getCurrentFarmingStateFromAll'
import { getSnapshotQueueWithAMMFees } from '@sb/dexUtils/staking/getSnapshotQueueWithAMMFees'
import { startStaking } from '@sb/dexUtils/staking/startStaking'
import { StakingPool } from '@sb/dexUtils/staking/types'
import { useStakingSnapshotQueues } from '@sb/dexUtils/staking/useStakingSnapshotQueues'
import { useStakingTicketsWithAvailableToClaim } from '@sb/dexUtils/staking/useStakingTicketsWithAvailableToClaim'
import { RefreshFunction, TokenInfo } from '@sb/dexUtils/types'
import { useInterval } from '@sb/dexUtils/useInterval'
import { useWallet } from '@sb/dexUtils/wallet'
import { PublicKey } from '@solana/web3.js'
import { COLORS } from '@variables/variables'
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
import { getTicketsWithUiValues } from '@sb/dexUtils/staking/getTicketsWithUiValues'

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
  allStakingFarmingTickets: FarmingTicket[]
  refreshAllStakingFarmingTickets: RefreshFunction
  theme: Theme
  poolsFees: number
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

const UserStakingInfoContent: React.FC<StakingInfoProps> = (props) => {
  const {
    tokenData,
    stakingPool,
    refreshAllTokenData,
    allStakingFarmingTickets,
    refreshAllStakingFarmingTickets,
    allTokenData,
    theme,
    poolsFees,
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

  const snapshotQueueWithAMMFees = getSnapshotQueueWithAMMFees({
    farmingSnapshotsQueueAddress: currentFarmingState.farmingSnapshots,
    poolsFees,
    snapshotQueues: allStakingSnapshotQueues,
  })

  const [
    stakingTicketsWithAvailableToClaim,
  ] = useStakingTicketsWithAvailableToClaim({
    wallet,
    connection,
    walletPublicKey: wallet.publicKey,
    stakingPool,
    snapshotQueues: snapshotQueueWithAMMFees,
    allStakingFarmingTickets: userFarmingTickets,
  })

  const userRewards = getAvailableToClaimFarmingTokens(
    stakingTicketsWithAvailableToClaim
  )

  const availableToClaimTotal = getAvailableToClaimFarmingTokens(
    addFarmingRewardsToTickets({
      farmingTickets: userFarmingTickets,
      pools: [stakingPoolWithClosedFarmings],
      snapshotQueues: snapshotQueueWithAMMFees,
    })
  )

  const lastFarmingTicket = userFarmingTickets.sort(
    (ticketA, ticketB) => +ticketB.startTime - +ticketA.startTime
  )[0]

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

  const isClaimDisabled = availableToClaimTotal == 0

  useInterval(() => {
    refreshAllStakingSnapshotQueues()
    refreshAllTokenData()
    refreshAll()
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
                    <DarkTooltip
                      title={
                        'Staking awards are calculated based on AMM commissions earned. RIN buyback occurs every 27th of the month at market price. Estimated Rewards are based on the market price at the time of check, so may be different at the time of payment.'
                      }
                    >
                      <RewardsTitle>Est.Rewards:</RewardsTitle>
                    </DarkTooltip>
                    <DarkTooltip title={`${stripByAmount(userRewards)} RIN`}>
                      <div>
                        <UserBalance
                          visible={isBalancesShowing}
                          value={userRewards}
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
                      <UserBalance
                        visible={isBalancesShowing}
                        value={availableToClaimTotal}
                        decimals={2}
                      />
                    </RewardsStatsRow>
                  </DarkTooltip>
                  <ClaimButtonContainer>
                    <DarkTooltip
                      title={
                        !isClaimDisabled ? (
                          ''
                        ) : (
                          <p>
                            Rewards distribution takes place on the 27th day of
                            each month, you will be able to claim your reward
                            for this period on{' '}
                            <span style={{ color: COLORS.success }}>
                              27 November 2021.
                            </span>
                          </p>
                        )
                      }
                    >
                      <span>
                        <Button
                          variant={isClaimDisabled ? 'disabled' : ''}
                          fontSize="xs"
                          padding="lg"
                          borderRadius="xxl"
                          onClick={() => {
                            isClaimDisabled
                              ? null
                              : setIsClaimRewardsPopupOpen(true)
                          }}
                        >
                          {isLoading ? <Loader /> : 'Claim'}
                        </Button>
                      </span>
                    </DarkTooltip>
                    <Button
                      fontSize="xs"
                      padding="lg"
                      variant={isClaimDisabled ? 'disabledLink' : 'link'}
                      disabled={isClaimDisabled}
                      onClick={() => setIsClaimRewardsAndRestakePopupOpen(true)}
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
        open={isClaimRewardsPopupOpen || isClaimRewardsAndRestakePopupOpen}
        close={() => {
          isClaimRewardsPopupOpen
            ? setIsClaimRewardsPopupOpen(false)
            : setIsClaimRewardsAndRestakePopupOpen(false)
        }}
        selectedPool={stakingPoolWithClosedFarmings}
        programId={STAKING_PROGRAM_ADDRESS}
        allTokensData={allTokenData}
        farmingTicketsMap={farmingTicketsMap}
        snapshotQueues={snapshotQueueWithAMMFees}
        refreshTokensWithFarmingTickets={refreshAll}
        setPoolWaitingForUpdateAfterOperation={() => {
          setIsLoading(!isLoading)
        }}
        callback={async () => {
          if (isClaimRewardsAndRestakePopupOpen) {
            const result = await startStaking({
              wallet,
              connection,
              amount: availableToClaimTotal,
              userPoolTokenAccount: new PublicKey(tokenData.address),
              stakingPool,
            })

            return result
          }

          return true
        }}
      />
    </>
  )
}

const UserStakingInfo: React.FC<StakingInfoProps> = (props) => {
  const {
    theme,
    tokenData,
    stakingPool,
    refreshAllTokenData,
    allStakingFarmingTickets,
    refreshAllStakingFarmingTickets,
    allTokenData,
    poolsFees,
    currentFarmingState,
  } = props
  return (
    <Block>
      <StretchedBlock direction="column">
        <ConnectWalletWrapper theme={theme}>
          <UserStakingInfoContent
            theme={theme}
            poolsFees={poolsFees}
            allTokenData={allTokenData}
            stakingPool={stakingPool}
            tokenData={tokenData}
            currentFarmingState={currentFarmingState}
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
