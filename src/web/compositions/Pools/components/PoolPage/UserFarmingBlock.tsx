import { ApolloQueryResult } from 'apollo-client'
import dayjs from 'dayjs'
import pluralize from 'pluralize'
import React, { useState } from 'react'

import { SvgIcon } from '@sb/components'
import { LoadingBlock } from '@sb/components/Loader/LoadingBlock'
import { DarkTooltip } from '@sb/components/TooltipCustom/Tooltip'
import { Text } from '@sb/components/Typography'
import { MIN_POOL_TOKEN_AMOUNT_TO_SHOW_LIQUIDITY } from '@sb/dexUtils/common/config'
import { getTokenNameByMintAddress } from '@sb/dexUtils/markets'
import { useFarmingCalcAccounts } from '@sb/dexUtils/pools/hooks'
import { useTokenInfos } from '@sb/dexUtils/tokenRegistry'
import { sleep } from '@sb/dexUtils/utils'
import { useWallet } from '@sb/dexUtils/wallet'
import { useRegionRestriction } from '@sb/hooks/useRegionRestriction'
import { uniq } from '@sb/utils/collection'

import { ADDITIONAL_POOL_OWNERS } from '@core/config/dex'
import {
  UNLOCK_STAKED_AFTER,
  getStakedTokensTotal,
  filterOpenFarmingStates,
} from '@core/solana'
import { stripByAmountAndFormat } from '@core/utils/chartPageUtils'
import { estimateTime, MINUTE } from '@core/utils/dateUtils'

import LightLogo from '@icons/lightLogo.svg'

import { PoolInfo } from '../../index.types'
import { getTokenDataByMint } from '../../utils'
import { UserFarmingRewards } from '../Tables/UserFarmingRewards'
import { getUniqueAmountsToClaimMap } from '../Tables/utils/getUniqueAmountsToClaimMap'
import { ExtendFarmingModal } from './ExtendFarmingModal'
import ClockIcon from './icons/whiteClock.svg'
import {
  ExtendFarmingButton,
  FarmingBlock,
  FarmingBlockInner,
  FarmingButton,
  FarmingButtonsContainer,
  FarmingButtonWrap,
  LiquidityItem,
  LiquidityText,
  LiquidityTitle,
  NoFarmingBlock,
} from './styles'
import { ClaimTimeTooltip } from './Tooltips'
import { PoolRewardRemain, UserFarmingBlockProps } from './types'

const waitForPoolsUpdate = async (
  refetchPools: () => Promise<ApolloQueryResult<{ getPoolsInfo: PoolInfo[] }>>,
  poolSwapToken: string,
  statesSize: number,
  retries: number = 15
): Promise<boolean> => {
  if (retries === 0) {
    return false
  }
  let retriesMade = 0
  while (retriesMade < retries) {
    const {
      data: { getPoolsInfo },
    } = await refetchPools()
    const newSize =
      getPoolsInfo.find((p) => p.swapToken === poolSwapToken)?.farming
        ?.length || 0
    if (newSize > statesSize) {
      return true
    }
    await sleep(20_000)
    retriesMade += 1
  }
  return false
}

export const UserFarmingBlock: React.FC<UserFarmingBlockProps> = (props) => {
  const {
    pool,
    farmingTickets,
    userTokensData,
    prices,
    onStakeClick,
    onClaimClick,
    onUnstakeClick,
    processing,
    refetchPools,
  } = props
  const tokensInfo = useTokenInfos()
  const { wallet } = useWallet()
  const isRegionRestricted = useRegionRestriction()
  const [farmingExtending, setFarmingExtending] = useState(false)
  const [extendFarmingModalOpen, setExtendFarmingModalOpen] = useState(false)

  const { data: calcAccounts } = useFarmingCalcAccounts()

  const farmings = filterOpenFarmingStates(pool.farming || [])
  const hasFarming = farmings.length > 0
  const hadFarming = (pool.farming || []).length > 0

  const additionalPoolOwners = ADDITIONAL_POOL_OWNERS[pool.poolTokenMint] || []
  const isPoolOwner =
    wallet.publicKey?.toString() === pool.initializerAccount ||
    additionalPoolOwners.includes(wallet.publicKey?.toString())

  const farming = farmings[0]

  const { amount } = getTokenDataByMint(userTokensData, pool.poolTokenMint)

  // Hide tiny balances (we cannot withdraw all LP tokens so...)
  const poolTokenAmount =
    amount <= MIN_POOL_TOKEN_AMOUNT_TO_SHOW_LIQUIDITY ? 0 : amount
  const ticketsForPool = farmingTickets.get(pool.swapToken) || []

  const lastFarmingTicket = ticketsForPool.sort(
    (a, b) => parseInt(b.startTime, 10) - parseInt(a.startTime, 10)
  )[0]

  const claimAvailableTs =
    lastFarmingTicket && farming
      ? parseInt(lastFarmingTicket.startTime, 10) +
        farming.periodLength +
        UNLOCK_STAKED_AFTER
      : 0

  const now = Date.now() / 1000

  const unstakeLocked = claimAvailableTs > now

  const stakedAmount = getStakedTokensTotal(ticketsForPool)

  const availableToClaimMap = getUniqueAmountsToClaimMap({
    farmingTickets: ticketsForPool,
    farmingStates: pool.farming || [],
    calcAccounts,
  })

  const hasUnstaked = poolTokenAmount > 0
  const hasStaked = stakedAmount > 0

  const availableToClaim = Array.from(availableToClaimMap.values())
    .map((atc) => {
      const name = getTokenNameByMintAddress(atc.farmingTokenMint)
      const usdValue = (prices.get(name)?.price || 0) * atc.amount

      return { ...atc, name, usdValue }
    })
    .filter((atc) => atc.amount > 0)

  const availableToClaimUsd = availableToClaim.reduce(
    (acc, atc) => acc + atc.usdValue,
    0
  )

  const haveTokensToClaim = !!availableToClaim.find((atc) => atc.amount > 0)

  const onExtendSuccess = async () => {
    setFarmingExtending(true)
    const totalFarmings = (pool.farming || []).length
    // Refetch backend until states does not updated
    await waitForPoolsUpdate(refetchPools, pool.swapToken, totalFarmings)
    setFarmingExtending(false)
  }

  if (
    !hadFarming || // No farming were created
    (!hasFarming && !availableToClaimUsd && !hasStaked && !isPoolOwner) // Farming ended and nothing to withdraw/claim
  ) {
    return (
      <FarmingBlock>
        <LoadingBlock loading={farmingExtending}>
          <NoFarmingBlock>
            <div>
              <SvgIcon src={LightLogo} height="6rem" width="6rem" />
            </div>
            <Text>No farming available for this pool now.</Text>

            {isPoolOwner ? (
              <FarmingButtonsContainer>
                <ExtendFarmingButton
                  onClick={() => setExtendFarmingModalOpen(true)}
                >
                  Create Farming
                </ExtendFarmingButton>
              </FarmingButtonsContainer>
            ) : (
              <Text size="sm"> But it can be added by pool owner anytime.</Text>
            )}
          </NoFarmingBlock>
          {extendFarmingModalOpen && (
            <ExtendFarmingModal
              pool={pool}
              onClose={() => setExtendFarmingModalOpen(false)}
              title="Create Farming"
              onExtend={onExtendSuccess}
              tokensInfo={tokensInfo}
            />
          )}
        </LoadingBlock>
      </FarmingBlock>
    )
  }

  const tokenNames = uniq(
    farmings.map((fs) => getTokenNameByMintAddress(fs.farmingTokenMint))
  ).join(' and ')

  const showTooltip = (!hasUnstaked && !hasStaked) || isRegionRestricted
  const tooltipText = showTooltip
    ? isRegionRestricted
      ? "Sorry, Aldrin.com doesn't offer its services in your region."
      : `Deposit Liquidity and stake pool tokens to farm ${tokenNames}`
    : null

  const farmingRemain = farmings.reduce((acc, fs) => {
    const value = acc.get(fs.farmingTokenMint) || {
      timeRemain: 0,
      tokensRemain: 0,
    }

    const tokensRemain = fs.tokensTotal - fs.tokensUnlocked
    const timeRemain =
      Math.round(tokensRemain / fs.tokensPerPeriod) * fs.periodLength

    value.tokensRemain =
      tokensRemain / 10 ** fs.farmingTokenMintDecimals + value.tokensRemain
    value.timeRemain = Math.max(value.timeRemain, timeRemain)

    acc.set(fs.farmingTokenMint, value)
    return acc
  }, new Map<string, PoolRewardRemain>())

  const farmingTokens = Array.from(farmingRemain.keys())

  const timesRemain = Array.from(farmingRemain.values()).map(
    (fr) => fr.timeRemain
  )
  const timeRemainMax = Math.max(...timesRemain)

  const estimatedTime = estimateTime(timeRemainMax)

  // Have pool ending soon
  // const prolongationEnabled = !!(pool.farming || []).find(
  //   (fs) => fs.tokensTotal - fs.tokensUnlocked <= fs.tokensPerPeriod
  // )

  const prolongationEnabled = true

  const unstakeTooltipText = unstakeLocked
    ? `Locked until ${dayjs
        .unix(claimAvailableTs)
        .format('HH:mm:ss MMM DD, YYYY')}`
    : tooltipText

  return (
    <FarmingBlock>
      <LoadingBlock loading={farmingExtending}>
        {isPoolOwner ? (
          <>
            <FarmingBlockInner>
              <LiquidityItem>
                <LiquidityTitle>Remaining Supply</LiquidityTitle>
                {farmingTokens.length === 0 && (
                  <LiquidityText>Ended</LiquidityText>
                )}
                {farmingTokens.map((mint) => (
                  <div key={`farming_reward_${mint}`}>
                    <LiquidityText weight={600}>
                      <LiquidityText color="green7">
                        {stripByAmountAndFormat(
                          farmingRemain.get(mint)?.tokensRemain || 0
                        )}{' '}
                      </LiquidityText>
                      {getTokenNameByMintAddress(mint)}
                    </LiquidityText>
                  </div>
                ))}
              </LiquidityItem>
              <LiquidityItem>
                <LiquidityTitle>Remaining Time</LiquidityTitle>

                <div>
                  {timeRemainMax < MINUTE ? (
                    <LiquidityText>Ended</LiquidityText>
                  ) : (
                    <>
                      {!!estimatedTime.days && (
                        <LiquidityText>
                          <LiquidityText color="green7">
                            {estimatedTime.days}{' '}
                          </LiquidityText>
                          <LiquidityText>
                            {pluralize('day', estimatedTime.days)}
                          </LiquidityText>
                        </LiquidityText>
                      )}
                      {!!estimatedTime.hours && (
                        <LiquidityText>
                          <LiquidityText color="green7">
                            {' '}
                            {estimatedTime.hours}{' '}
                          </LiquidityText>
                          <LiquidityText>
                            {pluralize('hour', estimatedTime.hours)}
                          </LiquidityText>
                        </LiquidityText>
                      )}
                      {!!estimatedTime.minutes && (
                        <LiquidityText>
                          <LiquidityText color="green7">
                            {' '}
                            {estimatedTime.minutes}{' '}
                          </LiquidityText>
                          <LiquidityText>
                            {pluralize('minute', estimatedTime.minutes)}
                          </LiquidityText>
                        </LiquidityText>
                      )}
                    </>
                  )}
                </div>
              </LiquidityItem>
            </FarmingBlockInner>
            <FarmingButtonWrap>
              <ExtendFarmingButton
                disabled={!prolongationEnabled}
                onClick={() => setExtendFarmingModalOpen(true)}
              >
                Extend Farming
              </ExtendFarmingButton>
              {!prolongationEnabled && (
                <DarkTooltip title="The option to extend will be unlocked one hour before the end of the farming period.">
                  <div style={{ height: '1em', cursor: 'help' }}>
                    <SvgIcon src={ClockIcon} width="1em" height="1em" />
                  </div>
                </DarkTooltip>
              )}
            </FarmingButtonWrap>
          </>
        ) : (
          <FarmingBlockInner>
            <LiquidityItem>
              <LiquidityTitle>Stake LP Tokens</LiquidityTitle>
              <div>
                <LiquidityText weight={600}>
                  <LiquidityText color="green7">
                    {stripByAmountAndFormat(poolTokenAmount)}
                  </LiquidityText>{' '}
                  Unstaked
                </LiquidityText>
              </div>
              <div>
                <LiquidityText weight={600}>
                  <LiquidityText color="green7">
                    {stripByAmountAndFormat(stakedAmount)}
                  </LiquidityText>{' '}
                  Staked
                </LiquidityText>
              </div>
              <FarmingButtonsContainer>
                <DarkTooltip title={tooltipText}>
                  <span>
                    <FarmingButton
                      disabled={
                        !hasUnstaked ||
                        processing ||
                        !hasFarming ||
                        isRegionRestricted
                      }
                      $loading={processing}
                      onClick={onStakeClick}
                      $variant="rainbow"
                    >
                      Stake LP Tokens
                    </FarmingButton>
                  </span>
                </DarkTooltip>
                <DarkTooltip title={unstakeTooltipText}>
                  <span>
                    <FarmingButton
                      $variant="error"
                      disabled={!hasStaked || processing || unstakeLocked}
                      $loading={processing}
                      onClick={onUnstakeClick}
                    >
                      Unstake LP Tokens
                    </FarmingButton>
                  </span>
                </DarkTooltip>
              </FarmingButtonsContainer>
            </LiquidityItem>
            <LiquidityItem>
              <LiquidityTitle>Claimable Rewards:</LiquidityTitle>
              <UserFarmingRewards availableToClaim={availableToClaim} />
              <FarmingButtonWrap>
                <DarkTooltip title={tooltipText}>
                  <span>
                    <FarmingButton
                      $variant="rainbow"
                      disabled={!haveTokensToClaim || processing}
                      $loading={processing}
                      onClick={onClaimClick}
                    >
                      Claim
                    </FarmingButton>
                  </span>
                </DarkTooltip>
                <DarkTooltip
                  title={<ClaimTimeTooltip farmingState={farming} />}
                >
                  <div style={{ height: '1em', cursor: 'help' }}>
                    <SvgIcon src={ClockIcon} width="1em" height="1em" />
                  </div>
                </DarkTooltip>
              </FarmingButtonWrap>
            </LiquidityItem>
          </FarmingBlockInner>
        )}

        {extendFarmingModalOpen && (
          <ExtendFarmingModal
            pool={pool}
            onClose={() => setExtendFarmingModalOpen(false)}
            onExtend={onExtendSuccess}
            tokensInfo={tokensInfo}
          />
        )}
      </LoadingBlock>
    </FarmingBlock>
  )
}
