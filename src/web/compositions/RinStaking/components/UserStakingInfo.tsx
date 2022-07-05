import { toNumber } from 'lodash-es'
import React, { useCallback, useEffect, useState } from 'react'
import { compose } from 'recompose'

import { Block, BlockContentStretched, BlockTitle } from '@sb/components/Block'
import { Cell, FlexBlock, Row, StretchedBlock } from '@sb/components/Layout'
import { queryRendererHoc } from '@sb/components/QueryRenderer'
import SvgIcon from '@sb/components/SvgIcon'
import { InlineText } from '@sb/components/Typography'
import { RowContainer } from '@sb/compositions/AnalyticsRoute/index.styles'
import { NumberWithLabel } from '@sb/compositions/Staking/components/NumberWithLabel/NumberWithLabel'
import { useMultiEndpointConnection } from '@sb/dexUtils/connection'
import {
  startFarmingV2,
  stopFarmingV2,
  useFarmersAccountInfo,
  useFarmsInfo,
} from '@sb/dexUtils/farming'
import { getTokenNameByMintAddress } from '@sb/dexUtils/markets'
import { notify } from '@sb/dexUtils/notifications'
import { DAYS_TO_CHECK_BUY_BACK } from '@sb/dexUtils/staking/config'
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

import { getDexTokensPrices } from '@core/graphql/queries/pools/getDexTokensPrices'
import {
  getAvailableToClaimFarmingTokens,
  addFarmingRewardsToTickets,
  getSnapshotQueueWithAMMFees,
  FARMING_V2_TEST_TOKEN,
} from '@core/solana'
import {
  stripByAmount,
  stripByAmountAndFormat,
} from '@core/utils/chartPageUtils'

import EyeIcon from '@icons/eye.svg'

import { ConnectWalletWrapper } from '../../../components/ConnectWalletWrapper'
import { DarkTooltip } from '../../../components/TooltipCustom/Tooltip'
import { toMap } from '../../../utils'
import { ImagesPath } from '../../Chart/components/Inputs/Inputs.utils'
import { BigNumber, FormsWrap } from '../styles'
import InfoIcon from './assets/info.svg'
import { StakingForm } from './StakingForm'
import { StakingInfoProps } from './types'
import { UnstakingForm } from './UnstakingForm'
import {
  resolveStakingNotification,
  resolveUnstakingNotification,
} from './utils'

const UserStakingInfoContent: React.FC<StakingInfoProps> = (props) => {
  const {
    stakingPool,
    currentFarmingState,
    getDexTokensPricesQuery,
    treasuryDailyRewards,
  } = props

  const { data: farms } = useFarmsInfo()
  const farm = farms?.get(FARMING_V2_TEST_TOKEN)

  const [totalStakedRIN, refreshTotalStaked] = useAccountBalance({
    publicKey: farm ? farm.stakeVault : undefined,
  })
  const tokenData = useAssociatedTokenAccount(farm?.stakeMint.toString())

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
  const { data: farmersInfo } = useFarmersAccountInfo()

  const farmer = farmersInfo?.get(farm?.publicKey.toString())

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

  const totalStaked = farmer?.account.vested.amount.toString() || '0'

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

  const { buyBackAmountWithoutDecimals } = stakingPool.apr

  const snapshotQueueWithAMMFees = getSnapshotQueueWithAMMFees({
    farmingSnapshotsQueueAddress: currentFarmingState.farmingSnapshots,
    buyBackAmount: buyBackAmountWithoutDecimals,
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

  const lastFarmingTicket = userFarmingTickets.sort(
    (ticketA, ticketB) => +ticketB.startTime - +ticketA.startTime
  )[0]

  const unlockAvailableDate = lastFarmingTicket
    ? +lastFarmingTicket.startTime + +currentFarmingState?.periodLength
    : 0

  const isUnstakeLocked = unlockAvailableDate > Date.now() / 1000

  useInterval(() => {
    refreshAll()
  }, 30_000)

  const [isBalancesShowing, setIsBalancesShowing] = useState(true)

  const start = useCallback(
    async (amount: number) => {
      if (!tokenData?.address) {
        notify({ message: 'Account does not exists' })
        return false
      }

      if (!farms) {
        throw new Error('No farms')
      }

      setLoading((prev) => ({ ...prev, stake: true }))
      const result = await startFarmingV2({
        wallet,
        connection,
        amount,
        farm,
        userTokens: allTokenData,
        farmer,
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

    const result = await stopFarmingV2({
      wallet,
      connection,
      amount,
      farm,
      userTokens: allTokenData,
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

  const dexTokensPricesMap = toMap(
    getDexTokensPricesQuery?.getDexTokensPrices || [],
    (price) => price.symbol
  )

  const tokenPrice =
    dexTokensPricesMap?.get(
      getTokenNameByMintAddress(currentFarmingState.farmingTokenMint)
    )?.price || 0

  const buyBackAPR =
    (buyBackAmountWithoutDecimals / DAYS_TO_CHECK_BUY_BACK / totalStakedRIN) *
    365 *
    100

  const treasuryAPR = (treasuryDailyRewards / totalStakedRIN) * 365 * 100

  // const formattedBuyBackAPR =
  //   Number.isFinite(buyBackAPR) && buyBackAPR > 0
  //     ? stripByAmount(buyBackAPR, 2)
  //     : '--'

  const totalStakedPercentageToCircSupply =
    (totalStakedRIN * 100) / RINCirculatingSupply

  // const formattedTreasuryAPR = Number.isFinite(treasuryAPR)
  //   ? stripByAmount(treasuryAPR, 2)
  //   : '--'

  const formattedAPR =
    Number.isFinite(buyBackAPR) &&
    buyBackAPR > 0 &&
    Number.isFinite(treasuryAPR)
      ? stripByAmount(totalApr, 2)
      : '--'

  console.log({
    buyBackAPR,
    treasuryAPR,
    buyBackAmountWithoutDecimals,
    DAYS_TO_CHECK_BUY_BACK,
    totalStakedRIN,
  })

  useEffect(() => {
    document.title = `Aldrin | Stake RIN | ${formattedAPR}% APR`
    return () => {
      document.title = 'Aldrin'
    }
  }, [formattedAPR])

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
    ? strippedEstRewardsUSD
    : new Array(strippedEstRewardsUSD.length).fill('∗').join('')

  return (
    <>
      <RowContainer justify="space-between">
        <BlockTitle>Stake RIN</BlockTitle>
        <NumberWithLabel value={toNumber(formattedAPR)} label="APR" />
      </RowContainer>
      <Row style={{ height: 'auto' }}>
        <Cell colMd={6} colXl={3} col={12}>
          <GreenBlock>
            <BlockContentStretched>
              <FlexBlock alignItems="center" justifyContent="space-between">
                <InlineText size="sm">Estimated Rewards</InlineText>
                <DarkTooltip
                  title={
                    <p>
                      Staking rewards are paid on the{' '}
                      <strong> 27th of the every month</strong> based on RIN
                      weekly buy-backs on 1/6th of AMM fees . Estimated rewards
                      are updated <strong>weekly based on RIN buyback</strong>.
                    </p>
                  }
                >
                  <span>
                    <SvgIcon src={InfoIcon} width="0.8em" />
                  </span>
                </DarkTooltip>
              </FlexBlock>

              <StretchedBlock>
                <FlexBlock alignItems="flex-end">
                  <InlineText size="lg" weight={700} color="green7">
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
                <FlexBlock alignItems="flex-end">
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
                </FlexBlock>
              </StretchedBlock>
            </BlockContentStretched>
          </GreenBlock>
        </Cell>
        <Cell colMd={6} colXl={3} col={12}>
          <Block inner>
            <BlockContentStretched>
              <InlineText size="sm">Total staked </InlineText>{' '}
              <BigNumber>
                <InlineText>{stripToMillions(totalStakedRIN)} </InlineText>{' '}
                <InlineText>RIN</InlineText>
              </BigNumber>
              <StretchedBlock align="flex-end">
                <InlineText size="sm">
                  <InlineText>$</InlineText>&nbsp;
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
          <Block inner>
            <BlockContentStretched>
              <FlexBlock justifyContent="space-between" alignItems="center">
                <InlineText size="sm">Your stake</InlineText>{' '}
                <SvgIcon
                  style={{ cursor: 'pointer' }}
                  src={isBalancesShowing ? EyeIcon : ImagesPath.closedEye}
                  width="0.9em"
                  height="auto"
                  onClick={() => {
                    setIsBalancesShowing(!isBalancesShowing)
                  }}
                />
              </FlexBlock>
              <BigNumber>
                <InlineText>{totalStakedValue} </InlineText>{' '}
                <InlineText>RIN</InlineText>
              </BigNumber>
              <StretchedBlock align="flex-end">
                <InlineText size="sm">
                  <InlineText>$</InlineText>&nbsp;
                  {totalStakedUsdValue}
                </InlineText>{' '}
              </StretchedBlock>
            </BlockContentStretched>
          </Block>
        </Cell>
        <Cell colMd={12} colXl={6} col={12}>
          <Block inner>
            <BlockContentStretched>
              <FlexBlock alignItems="center" justifyContent="space-between">
                <InlineText size="sm">Rewards Earned</InlineText>
                <DarkTooltip
                  title={
                    <>
                      <p>
                        APR is calculated based on last RIN buyback which are
                        weekly.
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
                <InlineText>RIN</InlineText>
              </BigNumber>
              <StretchedBlock align="flex-end">
                <InlineText size="sm">
                  <InlineText>$</InlineText>&nbsp;
                  {userEstRewardsUSD}
                </InlineText>{' '}
              </StretchedBlock>
            </BlockContentStretched>
          </Block>
        </Cell>
      </Row>
      <FormsWrap>
        <ConnectWalletWrapper text={null} size="sm">
          <Row>
            <Cell colMd={12} colSm={12}>
              <StakingForm
                tokenData={tokenData}
                start={start}
                loading={loading}
              />{' '}
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
    getDexTokensPricesQuery,
    treasuryDailyRewards,
  } = props

  return (
    <StretchedBlock direction="column">
      <UserStakingInfoContent
        stakingPool={stakingPool}
        currentFarmingState={currentFarmingState}
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
