import React, { ReactNode } from 'react'
import { ConfirmationBlock, ConfirmationRow, SvgIconContainer, Warning, WarningIcon } from './styles'
import { InlineText } from '@sb/components/Typography'
import { DarkTooltip } from '@sb/components/TooltipCustom/Tooltip'
import ScalesIcon from '@icons/scales.svg'
import { SvgIcon } from '@sb/components'
import Attention from '@icons/attention.svg'
import { CreatePoolFormType } from './types'
import { getTokenNameByMintAddress } from '@sb/dexUtils/markets'

interface PoolConfirmationDataProps {
  values: CreatePoolFormType
  price: ReactNode
  farmingRewardPerDay: ReactNode
}

export const STABLE_POOLS_TOOLTIP = `Stable pools are designed specifically for pegged assets that trade at a similar price. e.g. 
mSOL/SOL (SOL-pegged), USDC/USDT (USD-pegged) etc.`

export const PoolConfirmationData: React.FC<PoolConfirmationDataProps> = (props) => {
  const {
    values,
    values: { firstDeposit, farming },
    price,
    farmingRewardPerDay,
  } = props


  const baseName = getTokenNameByMintAddress(values.baseToken.mint)
  const quoteName = getTokenNameByMintAddress(values.quoteToken.mint)
  const farmingTokenName = getTokenNameByMintAddress(values.farming.token.mint)

  return (
    <div>
      <ConfirmationBlock border>
        <ConfirmationRow>
          <InlineText>Pool:</InlineText>
          <InlineText weight={600}>
            {baseName}/{quoteName}
            {values.stableCurve &&
              <DarkTooltip title={STABLE_POOLS_TOOLTIP}>
                <SvgIconContainer>
                  <SvgIcon src={ScalesIcon} width="15px" height="15px" />
                </SvgIconContainer>
              </DarkTooltip>
            }

          </InlineText>

        </ConfirmationRow>
        <ConfirmationRow>
          <InlineText>Initial Price:</InlineText>
          <InlineText weight={600}>
            1 {baseName} = {price} {quoteName}
          </InlineText>
        </ConfirmationRow>
        <ConfirmationRow>
          <InlineText>Initial Liquidity:</InlineText>
          <InlineText weight={600}>
            {firstDeposit.baseTokenAmount} {baseName} + {firstDeposit.quoteTokenAmount} {quoteName}
          </InlineText>
        </ConfirmationRow>
        <ConfirmationRow>
          <InlineText>Farming Token:</InlineText>
          <InlineText weight={600}>
            {values.farmingEnabled ? farmingTokenName : '-'}
          </InlineText>
        </ConfirmationRow>
        <ConfirmationRow>
          <InlineText>Farming Period:</InlineText>
          <InlineText weight={600}>
            {values.farmingEnabled ? `${farming.farmingPeriod} days` : '-'}
          </InlineText>
        </ConfirmationRow>
        <ConfirmationRow>
          <InlineText>Farming Supply:</InlineText>
          <InlineText weight={600}>
            {values.farmingEnabled ?
              <>
                {farming.tokenAmount} {farmingTokenName} ({farmingRewardPerDay}  {farmingTokenName} / day)
            </> : '-'}
          </InlineText>
        </ConfirmationRow>
        <ConfirmationRow>
          <InlineText>Vesting:</InlineText>
          <InlineText weight={600}>
            {values.farmingEnabled && values.farming.vestingEnabled ?
              <>
                33.3% per day + 66.6% after {farming.vestingPeriod} days
            </> : '-'}
          </InlineText>
        </ConfirmationRow>
      </ConfirmationBlock>
      <ConfirmationBlock>
        <ConfirmationRow>
          <InlineText>Est. pool creation fee:</InlineText>
          <InlineText weight={600}>
            <InlineText color="success">{values.farmingEnabled ? '0.3' : '0.03'}</InlineText>
            <InlineText> SOL</InlineText>
          </InlineText>
        </ConfirmationRow>
      </ConfirmationBlock>

      <Warning>
        <WarningIcon>
          <SvgIcon src={Attention} height="40px" />
        </WarningIcon>
        <InlineText>
          Please make sure you have enough SOL to proceed transaction.
          You will need to sign several transactions, and then your pool will appear in the list of pools
          and in the "Your Liquidity" tab.
      </InlineText>
      </Warning>
    </div>
  )
}