import { PublicKey } from '@solana/web3.js'
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
  useFarmersAccountInfo,
} from '@sb/dexUtils/farming'
import { useFarmInfo } from '@sb/dexUtils/farming/hooks/useFarmInfo'
import { getTokenNameByMintAddress } from '@sb/dexUtils/markets'
import { notify } from '@sb/dexUtils/notifications'
import { useRinStakingApr } from '@sb/dexUtils/staking/hooks/useRinStakingApr'
import { useAccountBalance } from '@sb/dexUtils/staking/useAccountBalance'
import {
  useUserTokenAccounts,
  useAssociatedTokenAccount,
} from '@sb/dexUtils/token/hooks'
import { useInterval } from '@sb/dexUtils/useInterval'
import { useWallet } from '@sb/dexUtils/wallet'

import { getDexTokensPrices } from '@core/graphql/queries/pools/getDexTokensPrices'
import { getStakingInfo } from '@core/graphql/queries/staking/getStakingInfo'
import { FARMING_V2_TEST_TOKEN } from '@core/solana'
import { stripByAmountAndFormat } from '@core/utils/chartPageUtils'

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
    getStakingInfoQuery,
    treasuryDailyRewards,
  } = props

  const stakingData = getStakingInfoQuery.getStakingInfo.farming

  const stakingDataMap = toMap(stakingData, (farm) => farm.stakeMint.toString())

  const { data: farms } = useFarmInfo({ stakingDataMap })

  const farm = farms?.get(FARMING_V2_TEST_TOKEN)
  const [totalStakedRIN, refreshTotalStaked] = useAccountBalance({
    publicKey: farm ? new PublicKey(farm.stakeVault) : undefined,
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

  const farmer = farmersInfo?.get(farm?.publicKey.toString() || '')

  const totalStaked = farmer?.totalStaked || '0'

  console.log({ farmersInfo })

  const [allTokenData, refreshAllTokenData] = useUserTokenAccounts()

  const rinHarvest = farm?.harvests.find(
    (harvest) => harvest.mint.toString() === FARMING_V2_TEST_TOKEN
  )

  const { data: apr } = useRinStakingApr({
    totalStaked: totalStakedRIN,
    harvest: rinHarvest,
  })

  const refreshAll = async () => {
    await Promise.all([refreshTotalStaked(), refreshAllTokenData()])
  }

  const { buyBackAmountWithoutDecimals } = stakingPool.apr

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

  useEffect(() => {
    document.title = `Aldrin | Stake RIN | ${apr}% APR`
    return () => {
      document.title = 'Aldrin'
    }
  }, [apr])

  const rinValue = stripByAmountAndFormat(totalStaked)
  const totalStakedValue = isBalancesShowing
    ? rinValue
    : new Array(rinValue.length).fill('∗').join('')

  const stakedInUsd = stripByAmountAndFormat(+totalStaked * tokenPrice || 0, 2)
  const totalStakedUsdValue = isBalancesShowing
    ? stakedInUsd
    : new Array(stakedInUsd.length).fill('∗').join('')

  const isUnstakeLocked =
    parseFloat(farmer?.account.staked.amount.toString() || '0') === 0

  const availableForUnstake = parseFloat(
    farmer?.account.staked.amount.toString() || '0'
  )

  return (
    <>
      <StretchedRow>
        <BlockTitle>Stake RIN</BlockTitle>
        <NumberWithLabel value={toNumber(apr || 0)} label="APR" />
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
                totalStaked={+availableForUnstake}
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
    getStakingInfoQuery,
  } = props

  return (
    <StretchedBlock direction="column">
      <UserStakingInfoContent
        stakingPool={stakingPool}
        currentFarmingState={currentFarmingState}
        getDexTokensPricesQuery={getDexTokensPricesQuery}
        treasuryDailyRewards={treasuryDailyRewards}
        getStakingInfoQuery={getStakingInfoQuery}
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
  }),
  queryRendererHoc({
    query: getStakingInfo,
    name: 'getStakingInfoQuery',
    fetchPolicy: 'cache-and-network',
    withoutLoading: true,
    pollInterval: 60000,
  })
)(UserStakingInfo)
