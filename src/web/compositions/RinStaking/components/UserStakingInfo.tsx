import { toNumber } from 'lodash-es'
import React, { useCallback, useEffect, useState } from 'react'
import { compose } from 'recompose'

import { Block, BlockContentStretched, BlockTitle } from '@sb/components/Block'
import { Cell, FlexBlock, Row, StretchedBlock } from '@sb/components/Layout'
import { queryRendererHoc } from '@sb/components/QueryRenderer'
import SvgIcon from '@sb/components/SvgIcon'
import { InlineText } from '@sb/components/Typography'
import { NumberWithLabel } from '@sb/compositions/Staking/components/NumberWithLabel/NumberWithLabel'
import { useMultiEndpointConnection } from '@sb/dexUtils/connection'
import {
  startFarmingV2,
  stopFarmingV2,
  useFarm,
  useFarmer,
} from '@sb/dexUtils/farming'
import { getTokenNameByMintAddress } from '@sb/dexUtils/markets'
import { notify } from '@sb/dexUtils/notifications'
import { DAYS_TO_CHECK_BUY_BACK } from '@sb/dexUtils/staking/config'
import { useAccountBalance } from '@sb/dexUtils/staking/useAccountBalance'
import { useAllStakingTickets } from '@sb/dexUtils/staking/useAllStakingTickets'
import {
  useUserTokenAccounts,
  useAssociatedTokenAccount,
} from '@sb/dexUtils/token/hooks'
import { useInterval } from '@sb/dexUtils/useInterval'
import { useWallet } from '@sb/dexUtils/wallet'

import { getDexTokensPrices } from '@core/graphql/queries/pools/getDexTokensPrices'
import { FARMING_V2_TEST_TOKEN } from '@core/solana'
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
import { StretchedRow } from './styles'
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

  const farm = useFarm(FARMING_V2_TEST_TOKEN)

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

  const farmer = useFarmer(farm?.publicKey.toString())

  const [userFarmingTickets, refreshUserFarmingTickets] = useAllStakingTickets({
    wallet,
    connection,
    walletPublicKey: wallet.publicKey,
    onlyUserTickets: true,
    // walletPublicKey,
  })

  const totalStaked = farmer?.account.totalStaked || 0

  const [allTokenData, refreshAllTokenData] = useUserTokenAccounts()

  const refreshAll = async () => {
    await Promise.all([
      refreshTotalStaked(),
      refreshUserFarmingTickets(),
      refreshAllTokenData(),
    ])
  }

  const { buyBackAmountWithoutDecimals } = stakingPool.apr

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

      if (!farm) {
        throw new Error('No farm')
      }

      setLoading((prev) => ({ ...prev, stake: true }))
      const result = await startFarmingV2({
        wallet,
        connection,
        amount,
        farm,
        userTokens: allTokenData,
        farmer: farmer?.publicKey,
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

    if (!farm) {
      throw new Error('No farm')
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

  const totalApr = buyBackAPR + treasuryAPR

  const formattedAPR =
    Number.isFinite(buyBackAPR) &&
    buyBackAPR > 0 &&
    Number.isFinite(treasuryAPR)
      ? stripByAmount(totalApr, 2)
      : '--'

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

  return (
    <>
      <StretchedRow>
        <BlockTitle>Stake RIN</BlockTitle>
        <NumberWithLabel value={toNumber(formattedAPR)} label="APR" />
      </StretchedRow>
      <Row style={{ height: 'auto' }}>
        <Cell colMd={12} colXl={6} col={12} colSm={12}>
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
        <Cell colMd={12} colXl={6} col={12} colSm={12}>
          <Block inner>
            <BlockContentStretched>
              <FlexBlock alignItems="center" justifyContent="space-between">
                <InlineText size="sm">Rewards Earned</InlineText>
                <DarkTooltip
                  title={
                    <>
                      <p>
                        Staking rewards are autocompounded to your total stake
                        once per 10 minutes.
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
                <InlineText>{0} </InlineText> <InlineText>RIN</InlineText>
              </BigNumber>
              <StretchedBlock align="flex-end">
                <InlineText size="sm">
                  <InlineText>$</InlineText>&nbsp;
                  {0}
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
                tokenPrice={tokenPrice}
              />{' '}
              <UnstakingForm
                isUnstakeLocked={isUnstakeLocked}
                unlockAvailableDate={unlockAvailableDate}
                totalStaked={totalStaked}
                end={end}
                loading={loading}
                mint={currentFarmingState.farmingTokenMint}
                tokenPrice={tokenPrice}
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
