import { stripByAmountAndFormat } from '@core/utils/chartPageUtils'
import { estimateTime } from '@core/utils/dateUtils'
import { SvgIcon } from '@sb/components'
import { DarkTooltip } from '@sb/components/TooltipCustom/Tooltip'
import { Text } from '@sb/components/Typography'
import { getStakedTokensFromOpenFarmingTickets } from '@sb/dexUtils/common/getStakedTokensFromOpenFarmingTickets'
import { getTokenNameByMintAddress } from '@sb/dexUtils/markets'
import { useWallet } from '@sb/dexUtils/wallet'
import pluralize from 'pluralize'
import React, { useState } from 'react'
import LightLogo from '@icons/lightLogo.svg'

import { filterOpenFarmingStates } from '@sb/dexUtils/pools/filterOpenFarmingStates'
import { getTokenDataByMint } from '../../utils'
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
import { UserFarmingRewards } from '../Tables/UserFarmingRewards'
import { PoolRewardRemain, UserFarmingBlockProps } from './types'

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
  } = props

  const { wallet } = useWallet()

  const [extendFarmingModalOpen, setExtendFarmingModalOpen] = useState(false)

  const farmings = filterOpenFarmingStates(pool.farming || [])
  const hasFarming = farmings.length > 0
  const hadFarming = (pool.farming || []).length > 0

  const isPoolOwner = wallet.publicKey?.toString() === pool.initializerAccount

  const farming = farmings[0]

  const { amount: poolTokenAmount } = getTokenDataByMint(
    userTokensData,
    pool.poolTokenMint
  )

  const ticketsForPool = farmingTickets.get(pool.swapToken) || []

  const lastFarmingTicket = ticketsForPool.sort(
    (a, b) => parseInt(b.startTime, 10) - parseInt(a.startTime, 10)
  )[0]

  const claimAvailableTs =
    lastFarmingTicket && farming
      ? parseInt(lastFarmingTicket.startTime, 10) +
        farming.periodLength +
        60 * 20
      : 0

  const now = Date.now() / 1000

  const unstakeLocked = claimAvailableTs > now

  const stakedAmount = getStakedTokensFromOpenFarmingTickets(ticketsForPool)

  const availableToClaimMap = getUniqueAmountsToClaimMap({
    farmingTickets: ticketsForPool,
    farmingStates: pool.farming || [],
  })

  const hasUnstaked = poolTokenAmount > 0
  const hasStaked = stakedAmount > 0

  const availableToClaim = Array.from(availableToClaimMap.values()).map(
    (atc) => {
      const name = getTokenNameByMintAddress(atc.farmingTokenMint)
      const usdValue = (prices.get(name)?.price || 0) * atc.amount

      return { ...atc, name, usdValue }
    }
  )

  const availableToClaimUsd = availableToClaim.reduce(
    (acc, atc) => acc + atc.usdValue,
    0
  )

  if (
    !hadFarming || // No farming were created
    (!hasFarming && !availableToClaimUsd && !hasStaked) // Farming ended and nothing to withdraw/claim
  ) {
    return (
      <FarmingBlock>
        <NoFarmingBlock>
          <div>
            <SvgIcon src={LightLogo} height="6rem" width="6rem" />
          </div>
          <Text> No farming available for this pool now.</Text>

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
          />
        )}
      </FarmingBlock>
    )
  }

  const tokenNames = Array.from(
    new Set(
      farmings.map((fs) => getTokenNameByMintAddress(fs.farmingTokenMint))
    ).values()
  ).join(' and ')

  const tooltipText =
    !hasUnstaked && !hasStaked
      ? `Deposit Liquidity and stake pool tokens to farm ${tokenNames}`
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
  const prolongationEnabled = !!farmings.find(
    (fs) => fs.tokensTotal - fs.tokensUnlocked < fs.tokensPerPeriod
  )

  return (
    <FarmingBlock>
      {isPoolOwner ? (
        <>
          <FarmingBlockInner>
            <LiquidityItem>
              <LiquidityTitle>Remaining Supply</LiquidityTitle>
              {farmingTokens.map((mint) => (
                <div key={`farming_reward_${mint}`}>
                  <LiquidityText weight={600}>
                    <LiquidityText color="success">
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
                {!!estimatedTime.days && (
                  <LiquidityText>
                    <LiquidityText color="success">
                      {estimatedTime.days}{' '}
                    </LiquidityText>
                    <LiquidityText>
                      {pluralize('day', estimatedTime.days)}
                    </LiquidityText>
                  </LiquidityText>
                )}
                {!!estimatedTime.hours && (
                  <LiquidityText>
                    <LiquidityText color="success">
                      {' '}
                      {estimatedTime.hours}{' '}
                    </LiquidityText>
                    <LiquidityText>
                      {pluralize('hour', estimatedTime.hours)}
                    </LiquidityText>
                  </LiquidityText>
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
                <LiquidityText color="success">
                  {stripByAmountAndFormat(poolTokenAmount)}
                </LiquidityText>{' '}
                Unstaked
              </LiquidityText>
            </div>
            <div>
              <LiquidityText weight={600}>
                <LiquidityText color="success">
                  {stripByAmountAndFormat(stakedAmount)}
                </LiquidityText>{' '}
                Staked
              </LiquidityText>
            </div>
            <FarmingButtonsContainer>
              <DarkTooltip title={tooltipText}>
                <span>
                  <FarmingButton
                    disabled={!hasUnstaked || processing || !hasFarming}
                    $loading={processing}
                    onClick={onStakeClick}
                    $variant="rainbow"
                  >
                    Stake LP Tokens
                  </FarmingButton>
                </span>
              </DarkTooltip>
              <DarkTooltip title={tooltipText}>
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
                    disabled={availableToClaimUsd === 0 || processing}
                    $loading={processing}
                    onClick={onClaimClick}
                  >
                    Claim
                  </FarmingButton>
                </span>
              </DarkTooltip>
              <DarkTooltip title={<ClaimTimeTooltip farmingState={farming} />}>
                <div style={{ height: '1em' }}>
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
        />
      )}
    </FarmingBlock>
  )
}
