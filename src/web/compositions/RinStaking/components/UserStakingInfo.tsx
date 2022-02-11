/* eslint-disable no-restricted-globals */
import { PublicKey } from '@solana/web3.js'
import { FONT_SIZES } from '@variables/variables'
import dayjs from 'dayjs'
import React, { useCallback, useEffect, useState } from 'react'
import { compose } from 'recompose'

import { Block, GreenBlock, BlockContentStretched } from '@sb/components/Block'
import { Cell, StretchedBlock } from '@sb/components/Layout'
import { ShareButton } from '@sb/components/ShareButton'
import { InlineText } from '@sb/components/Typography'
import { dayDuration } from '@sb/compositions/AnalyticsRoute/components/utils'
import { RowContainer } from '@sb/compositions/AnalyticsRoute/index.styles'
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
import { getSnapshotQueueWithAMMFees } from '@sb/dexUtils/staking/getSnapshotQueueWithAMMFees'
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
import { daysInMonthForDate } from '@core/utils/dateUtils'
import { stripDigitPlaces } from '@core/utils/PortfolioTableUtils'

import { restake } from '../../../dexUtils/staking/actions'
import { Asterisks, BalanceRow, BigNumber, Digit } from '../styles'
import { getShareText } from '../utils'
import { StakingForm } from './StakingForm'
import { StakingInfoProps } from './types'
import { UnstakingForm } from './UnstakingForm'
import {
  resolveStakingNotification,
  resolveClaimNotification,
  resolveRestakeNotification,
  resolveUnstakingNotification,
} from './utils'

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

  const [isBalancesShowing, setIsBalancesShowing] = useState(true)
  const [isRestakePopupOpen, setIsRestakePopupOpen] = useState(false)
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
    // walletPublicKey,
  })

  const { data: calcAccounts, mutate: reloadCalcAccounts } =
    useStakingCalcAccounts()

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
  // TODO: separate it to another component

  const [RINCirculatingSupply, setCirculatingSupply] = useState(0)

  useEffect(() => {
    const getRINSupply = async () => {
      const CCAICircSupplyValue = await getRINCirculationSupply()
      setCirculatingSupply(CCAICircSupplyValue)
    }
    getRINSupply()
  }, [])

  const dexTokensPricesMap =
    getDexTokensPricesQuery?.getDexTokensPrices?.reduce(
      (acc, tokenPrice) => acc.set(tokenPrice.symbol, tokenPrice),
      new Map()
    )

  const tokenPrice =
    dexTokensPricesMap?.get(
      getTokenNameByMintAddress(currentFarmingState.farmingTokenMint)
    )?.price || 0

  const totalStakedUSD = tokenPrice * totalStakedRIN

  const buyBackAPR =
    (buyBackAmount / DAYS_TO_CHECK_BUY_BACK / totalStakedRIN) * 365 * 100

  const buyBackDailyRewards = buyBackAmount / DAYS_TO_CHECK_BUY_BACK

  const dailyRewards = treasuryDailyRewards + buyBackDailyRewards

  const treasuryAPR = (treasuryDailyRewards / totalStakedRIN) * 365 * 100

  const formattedBuyBackAPR = isFinite(buyBackAPR)
    ? stripByAmount(buyBackAPR, 2)
    : '--'

  const totalStakedPercentageToCircSupply =
    (totalStakedRIN * 100) / RINCirculatingSupply

  const formattedTreasuryAPR = isFinite(treasuryAPR)
    ? stripByAmount(treasuryAPR, 2)
    : '--'

  const formattedAPR =
    isFinite(buyBackAPR) && isFinite(treasuryAPR)
      ? stripByAmount(buyBackAPR + treasuryAPR, 2)
      : '--'

  useEffect(() => {
    document.title = `Aldrin | Stake RIN | ${formattedAPR}% APR`
    return () => {
      document.title = 'Aldrin'
    }
  }, [formattedAPR])

  const shareText = getShareText(formattedAPR)

  return (
    // <>
    //   <BlockContent border>
    //     <WalletRow>
    //       <div>
    //         <StretchedBlock align="center">
    //           <BlockTitle>Your RIN Staking</BlockTitle>
    //           <SvgIcon
    //             style={{ cursor: 'pointer' }}
    //             src={isBalancesShowing ? ImagesPath.eye : ImagesPath.closedEye}
    //             width="1.5em"
    //             height="auto"
    //             onClick={() => {
    //               setIsBalancesShowing(!isBalancesShowing)
    //             }}
    //           />
    //         </StretchedBlock>
    //         <StyledTextDiv>
    //           {isBalancesShowing ? walletAddress : '***'}
    //         </StyledTextDiv>
    //       </div>
    //       <WalletBalanceBlock>
    //         <WalletAvailableTitle>Available in wallet:</WalletAvailableTitle>
    //         <BalanceWrap>
    //           <UserBalance
    //             visible={isBalancesShowing}
    //             value={tokenData?.amount || 0}
    //           />
    //         </BalanceWrap>
    //       </WalletBalanceBlock>
    //     </WalletRow>
    //   </BlockContent>
    //   <BlockContent>
    //     <Row>
    //       <Cell colMd={4} colLg={12} colXl={4}>
    //         <TotalStakedBlock inner>
    //           <BlockContent>
    //             <DarkTooltip title={`${stripByAmount(totalStaked)} RIN`}>
    //               <RewardsStatsRow>
    //                 <RewardsTitle>Total staked:</RewardsTitle>
    //                 <UserBalance
    //                   visible={isBalancesShowing}
    //                   value={totalStaked}
    //                 />
    //               </RewardsStatsRow>
    //             </DarkTooltip>
    //           </BlockContent>
    //         </TotalStakedBlock>
    //       </Cell>
    //       <Cell colMd={8} colLg={12} colXl={8}>
    //         <RewardsBlock inner>
    //           <BlockContent>
    //             <RewardsStats>
    //               <RewardsStatsRow>
    //                 <RewardsTitle style={{ display: 'flex' }}>
    //                   Est.Rewards:
    //                   <DarkTooltip
    //                     title={
    //                       <p>
    //                         Staking rewards are paid on the{' '}
    //                         <strong> 27th of the every month</strong> based on
    //                         RIN weekly buy-backs on 1/6th of AMM fees .
    //                         Estimated rewards are updated{' '}
    //                         <strong>hourly based on treasury rewards</strong>{' '}
    //                         and&nbsp;
    //                         <strong>weekly based on RIN buyback</strong>.
    //                       </p>
    //                     }
    //                   >
    //                     <div>
    //                       <SvgIcon
    //                         src={InfoIcon}
    //                         width="1.75rem"
    //                         height="1.75rem"
    //                         style={{ marginLeft: '0.75rem' }}
    //                       />
    //                     </div>
    //                   </DarkTooltip>
    //                 </RewardsTitle>
    //                 <DarkTooltip
    //                   title={`${stripByAmount(estimatedRewards)} RIN`}
    //                 >
    //                   <div>
    //                     <UserBalance
    //                       visible={isBalancesShowing}
    //                       value={estimatedRewards}
    //                       decimals={2}
    //                     />
    //                   </div>
    //                 </DarkTooltip>
    //               </RewardsStatsRow>
    //               <DarkTooltip
    //                 title={`${stripByAmount(availableToClaimTotal)} RIN`}
    //               >
    //                 <RewardsStatsRow>
    //                   <RewardsTitle>Available to claim:</RewardsTitle>
    //                   {snapshotsProcessing ? (
    //                     <InlineText size="sm">Processing...</InlineText>
    //                   ) : (
    //                     <UserBalance
    //                       visible={isBalancesShowing}
    //                       value={availableToClaimTotal}
    //                       decimals={2}
    //                     />
    //                   )}
    //                 </RewardsStatsRow>
    //               </DarkTooltip>
    //               <ClaimButtonContainer>
    //                 <DarkTooltip
    //                   delay={0}
    //                   title={
    //                     !isClaimDisabled ? (
    //                       ''
    //                     ) : (
    //                       <p>
    //                         Rewards distribution takes place on the 27th day of
    //                         each month, you will be able to claim your reward
    //                         for this period on{' '}
    //                         <span style={{ color: COLORS.success }}>
    //                           {claimUnlockData}.
    //                         </span>
    //                       </p>
    //                     )
    //                   }
    //                 >
    //                   <span>
    //                     <Button
    //                       $variant="primary"
    //                       $fontSize="xs"
    //                       $padding="lg"
    //                       disabled={isClaimDisabled || loading.claim}
    //                       $loading={loading.claim}
    //                       $borderRadius="xxl"
    //                       onClick={claimRewards}
    //                     >
    //                       Claim
    //                     </Button>
    //                   </span>
    //                 </DarkTooltip>
    //                 <RestakeButton
    //                   $variant="link"
    //                   $fontSize="xs"
    //                   $padding="lg"
    //                   disabled={isClaimDisabled || loading.claim}
    //                   $loading={loading.claim}
    //                   $borderRadius="xxl"
    //                   onClick={doRestake}
    //                 >
    //                   Restake
    //                 </RestakeButton>
    //               </ClaimButtonContainer>
    //             </RewardsStats>
    //           </BlockContent>
    //         </RewardsBlock>
    //       </Cell>
    //     </Row>

    //     <FormsContainer>
    //       <StakingForm tokenData={tokenData} start={start} loading={loading} />
    //       <UnstakingForm
    //         isUnstakeLocked={isUnstakeLocked}
    //         unlockAvailableDate={unlockAvailableDate}
    //         totalStaked={totalStaked}
    //         end={end}
    //         loading={loading}
    //       />
    //     </FormsContainer>
    //   </BlockContent>
    //   <RestakePopup
    //     open={isRestakePopupOpen}
    //     close={() => setIsRestakePopupOpen(false)}
    //   />
    // </>
    <>
      <RowContainer>
        <Cell colMd={3} colSm={12}>
          <GreenBlock margin="0 1rem">
            <BlockContentStretched>
              <InlineText color="lightGray" size="sm">
                Estimated Rewards
              </InlineText>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-end',
                  flexWrap: 'nowrap',
                }}
              >
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
              </div>

              <StretchedBlock>
                <div style={{ display: 'flex', alignItems: 'center' }}>
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
                  {/* <DarkTooltip
                    title={
                      <span>
                        <div style={{ marginBottom: '1rem' }}>
                          The first APR is calculated based on fixed “treasury”
                          rewards. These rewards estimation are updated hourly.
                        </div>
                        <div>
                          The second APR is calculated based on the current RIN
                          price and the average AMM fees for the past 7d. The
                          reward estimations are updated weekly.
                        </div>
                      </span>
                    }
                  >
                    <div style={{ display: 'flex' }}>
                      <SvgIcon src={Info} width="1.2em" height="auto" />
                    </div>
                  </DarkTooltip> */}
                </div>
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
        <Cell colMd={3} colSm={12}>
          <Block margin="0 1rem">
            <BlockContentStretched>
              <InlineText color="lightGray" size="sm">
                Total staked{' '}
              </InlineText>{' '}
              <BigNumber>
                <InlineText>{stripToMillions(totalStakedRIN)} </InlineText>{' '}
                <InlineText color="primaryGray">RIN</InlineText>
              </BigNumber>
              <StretchedBlock align="flex-end">
                <InlineText>${stripToMillions(totalStakedUSD)}</InlineText>{' '}
                <InlineText margin="0" size="sm">
                  {stripDigitPlaces(totalStakedPercentageToCircSupply, 0)}% of
                  circulating supply
                </InlineText>
              </StretchedBlock>
            </BlockContentStretched>
          </Block>
        </Cell>

        <Cell colMd={3} colSm={12}>
          <Block margin="0 1rem">
            <BlockContentStretched>
              <InlineText color="lightGray" size="sm">
                Your stake
              </InlineText>{' '}
              <BigNumber>
                <InlineText>{stripByAmountAndFormat(totalStaked)} </InlineText>{' '}
                <InlineText color="primaryGray">RIN</InlineText>
              </BigNumber>
              <StretchedBlock align="flex-end">
                <InlineText>${stripToMillions(5004)}</InlineText>{' '}
              </StretchedBlock>
            </BlockContentStretched>
          </Block>
        </Cell>
        <Cell colMd={3} colSm={12}>
          <Block margin="0 1rem">
            <BlockContentStretched>
              <InlineText color="lightGray" size="sm">
                Your Rewards
              </InlineText>{' '}
              <BigNumber>
                <InlineText>
                  {stripByAmountAndFormat(availableToClaimTotal)}{' '}
                </InlineText>{' '}
                <InlineText color="primaryGray">RIN</InlineText>
              </BigNumber>
              <StretchedBlock align="flex-end">
                <InlineText>${stripToMillions(500)}</InlineText>{' '}
                <InlineText size="sm">
                  {stripDigitPlaces(50, 0)}% of circulating supply
                </InlineText>
              </StretchedBlock>
            </BlockContentStretched>
          </Block>
        </Cell>
      </RowContainer>
      <RowContainer justify="flex-start" margin="0 1rem">
        <Cell style={{ margin: '0 2rem 0 0' }} colMd={5.85} colSm={12}>
          <StakingForm tokenData={tokenData} start={start} loading={loading} />
        </Cell>
        <Cell colMd={5.85} colSm={12}>
          <UnstakingForm
            isUnstakeLocked={isUnstakeLocked}
            unlockAvailableDate={unlockAvailableDate}
            totalStaked={totalStaked}
            end={end}
            loading={loading}
          />
        </Cell>
      </RowContainer>
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
