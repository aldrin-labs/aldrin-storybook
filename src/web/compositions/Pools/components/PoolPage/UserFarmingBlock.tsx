import { stripByAmountAndFormat } from '@core/utils/chartPageUtils'
import { SvgIcon } from '@sb/components'
import { DarkTooltip } from '@sb/components/TooltipCustom/Tooltip'
import { RowContainer } from '@sb/compositions/AnalyticsRoute/index.styles'
import { getStakedTokensFromOpenFarmingTickets } from '@sb/dexUtils/common/getStakedTokensFromOpenFarmingTickets'
import { FarmingTicket } from '@sb/dexUtils/common/types'
import { getTokenNameByMintAddress } from '@sb/dexUtils/markets'
import { TokenInfo } from '@sb/dexUtils/types'
import React from 'react'
import { DexTokensPrices, PoolInfo } from '../../index.types'
import { getTokenDataByMint } from '../../utils'
import { getUniqueAmountsToClaimMap } from '../Tables/utils/getUniqueAmountsToClaimMap'
import ClockIcon from './icons/whiteClock.svg'
import LightLogo from '@icons/lightLogo.svg'

import {
  FarmingBlock,
  FarmingButton,
  FarmingButtonsContainer,
  FarmingButtonWrap,
  LiquidityItem,
  LiquidityText,
  LiquidityTitle,
  NoFarmingBlock,
} from './styles'
import { ClaimTimeTooltip } from './Tooltips'

interface UserFarmingBlockProps {
  pool: PoolInfo
  farmingTickets: Map<string, FarmingTicket[]>
  userTokensData: TokenInfo[]
  prices: Map<string, DexTokensPrices>
  onStakeClick: () => void
  onClaimClick: () => void
  onUnstakeClick: () => void
  processing: boolean
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
  } = props

  const hasFarming = pool.farming && pool.farming?.length !== 0

  if (!hasFarming) {
    return (
      <FarmingBlock>
        <RowContainer direction="column">
          <RowContainer>
            <SvgIcon
              src={LightLogo}
              height={'7rem'}
              width={'7rem'}
            />
          </RowContainer>
          <LiquidityTitle style={{ padding: '1rem 0' }}>
            No farming available for this pool now.
          </LiquidityTitle>
          <span>But it can be added by pool owner anytime.</span>
        </RowContainer>
      </FarmingBlock>
    )
  }

  const { amount: poolTokenAmount } = getTokenDataByMint(
    userTokensData,
    pool.poolTokenMint
  )

  const ticketsForPool = farmingTickets.get(pool.swapToken) || []

  const farming = pool.farming ? pool.farming[0] : null

  const lastFarmingTicket = ticketsForPool.sort(
    (a, b) => parseInt(b.startTime) - parseInt(a.startTime)
  )[0]

  const claimAvailableTs =
    lastFarmingTicket && farming
      ? parseInt(lastFarmingTicket.startTime) + farming.periodLength + 60 * 20
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

  const tokenNames = Array.from(
    new Set(
      (pool.farming || []).map((fs) =>
        getTokenNameByMintAddress(fs.farmingTokenMint)
      )
    ).values()
  ).join(' and ')

  const tooltipText =
    !hasUnstaked && !hasStaked
      ? `Deposit Liquidity and stake pool tokens to farm ${tokenNames}`
      : null

  return (
    <FarmingBlock>
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
                disabled={!hasUnstaked || processing}
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
        <div>
          <LiquidityText weight={600}>
            {Array.from(availableToClaim.values()).map((atc, idx) => (
              <React.Fragment
                key={`farming_available_to_claim_${atc.farmingTokenMint}`}
              >
                {idx !== 0 ? ' + ' : ''}
                <LiquidityText color="success">
                  {stripByAmountAndFormat(atc.amount, 6)}
                </LiquidityText>
                &nbsp;
                {getTokenNameByMintAddress(atc.farmingTokenMint)}
              </React.Fragment>
            ))}
          </LiquidityText>
        </div>
        <div>
          <LiquidityText color="success">
            ${stripByAmountAndFormat(availableToClaimUsd, 2)}
          </LiquidityText>
        </div>
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
              <SvgIcon src={ClockIcon} width={'1em'} height={'1em'} />
            </div>
          </DarkTooltip>
        </FarmingButtonWrap>
      </LiquidityItem>
    </FarmingBlock>
  )
}
