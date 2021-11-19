import { stripByAmountAndFormat } from '@core/utils/chartPageUtils'
import { getStakedTokensFromOpenFarmingTickets } from '@sb/dexUtils/common/getStakedTokensFromOpenFarmingTickets'
import { FarmingTicket } from '@sb/dexUtils/common/types'
import { getTokenNameByMintAddress } from '@sb/dexUtils/markets'
import { TokenInfo } from '@sb/dexUtils/types'
import React from 'react'
import { DexTokensPrices, PoolInfo } from '../../../index.types'
import { getTokenDataByMint } from '../../../utils'
import { getUniqueAmountsToClaimMap } from '../../Tables/utils/getUniqueAmountsToClaimMap'
import {
  FarmingBlock,
  FarmingButton,
  FarmingButtonsContainer,
  LiquidityItem,
  LiquidityText,
  LiquidityTitle,
  NoFarmingBlock,
  FarmingButtonWrap
} from './styles'
import ClockIcon from './icons/whiteClock.svg'
import { DarkTooltip } from '@sb/components/TooltipCustom/Tooltip'
import { SvgIcon } from '@sb/components'
import { Text } from '@sb/components/Typography'
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

  const hasFarming = pool.farming?.length !== 0

  if (!hasFarming) {
    return (
      <FarmingBlock>
        <NoFarmingBlock>This pool does not have farming.</NoFarmingBlock>
      </FarmingBlock>
    )
  }


  const { amount: poolTokenAmount } = getTokenDataByMint(
    userTokensData,
    pool.poolTokenMint
  )

  const ticketsForPool = farmingTickets.get(pool.swapToken) || []

  const farming = pool.farming ? pool.farming[0] : null

  const lastFarmingTicket = ticketsForPool.sort((a, b) => parseInt(b.startTime) - parseInt(a.startTime))[0]

  const claimAvailableTs = lastFarmingTicket && farming ?
    parseInt(lastFarmingTicket.startTime) + farming.periodLength + 60 * 20 : 0

  const now = Date.now() / 1000

  const unstakeLocked = claimAvailableTs > now


  const stakedAmount = getStakedTokensFromOpenFarmingTickets(ticketsForPool)

  const availableToClaimMap = getUniqueAmountsToClaimMap({
    farmingTickets: ticketsForPool,
    farmingStates: (pool.farming || []),
  })

  const hasUnstaked = poolTokenAmount > 0
  const hasStaked = stakedAmount > 0

  const availableToClaim = Array.from(availableToClaimMap.values()).map((atc) => {
    const name = getTokenNameByMintAddress(atc.farmingTokenMint)
    const usdValue = (prices.get(name)?.price || 0) * atc.amount

    return { ...atc, name, usdValue }
  })

  const availableToClaimUsd = availableToClaim.reduce((acc, atc) => acc + atc.usdValue, 0)

  return (
    <FarmingBlock>
      <LiquidityItem>
        <LiquidityTitle>Stake LP Tokens</LiquidityTitle>
        <div>
          <LiquidityText weight={600}>
            <LiquidityText color="success">{stripByAmountAndFormat(poolTokenAmount)}</LiquidityText> Unstaked
        </LiquidityText>
        </div>
        <div>
          <LiquidityText color="success">{stripByAmountAndFormat(stakedAmount)}</LiquidityText> Staked
        </div>
        <FarmingButtonsContainer>
          <FarmingButton
            disabled={!hasUnstaked || processing}
            $loading={processing}
            onClick={onStakeClick}
            variant="rainbow"
          >
            Stake LP Tokens
             </FarmingButton>
          <FarmingButton
            variant="error"
            disabled={!hasStaked || processing || unstakeLocked}
            $loading={processing}
            onClick={onUnstakeClick}
          >
            Unstake LP Tokens
          </FarmingButton>
        </FarmingButtonsContainer>
      </LiquidityItem>
      <LiquidityItem>
        <LiquidityTitle>Claimable Rewards:</LiquidityTitle>
        <div>
          <LiquidityText weight={600}>
            {Array.from(availableToClaim.values()).map((atc, idx) =>
              <React.Fragment key={`farming_available_to_claim_${atc.farmingTokenMint}`}>
                {idx !== 0 ? ' + ' : ''}
                <LiquidityText color="success">{stripByAmountAndFormat(atc.amount, 6)}</LiquidityText>&nbsp;
                {getTokenNameByMintAddress(atc.farmingTokenMint)}
              </React.Fragment>
            )}
          </LiquidityText>
        </div>
        <div>
          <LiquidityText color="success">${stripByAmountAndFormat(availableToClaimUsd, 2)}</LiquidityText>
        </div>
        <FarmingButtonWrap>
          <FarmingButton
            variant="rainbow"
            disabled={availableToClaimUsd === 0 || processing}
            $loading={processing}
            onClick={onClaimClick}
          >
            Claim
        </FarmingButton>
          <DarkTooltip title={<ClaimTimeTooltip farmingState={farming} />}>
            <div style={{ height: '1em' }}>
              <SvgIcon
                src={ClockIcon}
                width={'1em'}
                height={'1em'}
              />
            </div>
          </DarkTooltip>
        </FarmingButtonWrap>
      </LiquidityItem>
    </FarmingBlock>
  )
}