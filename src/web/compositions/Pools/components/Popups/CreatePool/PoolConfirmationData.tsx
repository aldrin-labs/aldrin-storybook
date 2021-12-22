import React, { ReactNode } from 'react'
import pluralize from 'pluralize'
import { InlineText } from '@sb/components/Typography'
import { DarkTooltip } from '@sb/components/TooltipCustom/Tooltip'
import ScalesIcon from '@icons/scales.svg'
import { SvgIcon } from '@sb/components'
import Attention from '@icons/attention.svg'
import { getTokenNameByMintAddress } from '@sb/dexUtils/markets'
import { CreatePoolFormType } from './types'
import {
  ConfirmationBlock,
  ConfirmationRow,
  SvgIconContainer,
  Warning,
  WarningIcon,
} from './styles'

interface PoolConfirmationDataProps {
  values: CreatePoolFormType
  price: ReactNode
  farmingRewardPerDay: ReactNode
}

export const STABLE_POOLS_TOOLTIP = `Stable pools are designed specifically for pegged assets that trade at a similar price. e.g.
mSOL/SOL (SOL-pegged), USDC/USDT (USD-pegged) etc.`

export const PoolConfirmationData: React.FC<PoolConfirmationDataProps> = (
  props
) => {
  const {
    values,
    values: {
      firstDeposit,
      farming,
      lockInitialLiquidity,
      initialLiquidityLockPeriod,
    },
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
          <InlineText size="sm">Pool:</InlineText>
          <InlineText size="sm" weight={600}>
            {baseName}/{quoteName}
            {values.stableCurve && (
              <DarkTooltip title={STABLE_POOLS_TOOLTIP}>
                <SvgIconContainer>
                  <SvgIcon src={ScalesIcon} width="15px" height="15px" />
                </SvgIconContainer>
              </DarkTooltip>
            )}
          </InlineText>
        </ConfirmationRow>
        <ConfirmationRow>
          <InlineText size="sm">Initial Price:</InlineText>
          <InlineText size="sm" weight={600}>
            1 {baseName} = {price} {quoteName}
          </InlineText>
        </ConfirmationRow>
        <ConfirmationRow>
          <InlineText size="sm">Initial Liquidity:</InlineText>
          <InlineText size="sm" weight={600}>
            {firstDeposit.baseTokenAmount} {baseName} +{' '}
            {firstDeposit.quoteTokenAmount} {quoteName}
          </InlineText>
        </ConfirmationRow>
        <ConfirmationRow>
          <InlineText size="sm">Initial Liquidity Lock period:</InlineText>
          <InlineText size="sm" weight={600}>
            {lockInitialLiquidity ? (
              <>
                {initialLiquidityLockPeriod}&nbsp;
                {pluralize('day', parseInt(initialLiquidityLockPeriod, 10))}
              </>
            ) : (
              '-'
            )}
          </InlineText>
        </ConfirmationRow>
        <ConfirmationRow>
          <InlineText size="sm">Farming Token:</InlineText>
          <InlineText size="sm" weight={600}>
            {values.farmingEnabled ? farmingTokenName : '-'}
          </InlineText>
        </ConfirmationRow>
        <ConfirmationRow>
          <InlineText size="sm">Farming Period:</InlineText>
          <InlineText size="sm" weight={600}>
            {values.farmingEnabled
              ? `${pluralize('day', parseInt(farming.farmingPeriod, 10))} `
              : '-'}
          </InlineText>
        </ConfirmationRow>
        <ConfirmationRow>
          <InlineText size="sm">Farming Supply:</InlineText>
          <InlineText size="sm" weight={600}>
            {values.farmingEnabled ? (
              <>
                {farming.tokenAmount} {farmingTokenName} ({farmingRewardPerDay}{' '}
                {farmingTokenName} / day)
              </>
            ) : (
              '-'
            )}
          </InlineText>
        </ConfirmationRow>
        <ConfirmationRow>
          <InlineText size="sm">Vesting:</InlineText>
          <InlineText size="sm" weight={600}>
            {values.farmingEnabled && values.farming.vestingEnabled ? (
              <>33.3% per day + 66.6% after {farming.vestingPeriod} days</>
            ) : (
              '-'
            )}
          </InlineText>
        </ConfirmationRow>
      </ConfirmationBlock>
      <ConfirmationBlock>
        <ConfirmationRow>
          <InlineText size="sm">Est. pool creation fee:</InlineText>
          <InlineText size="sm" weight={600}>
            <InlineText size="sm" color="success">
              {values.farmingEnabled ? '0.3' : '0.03'}
            </InlineText>
            <InlineText size="sm"> SOL</InlineText>
          </InlineText>
        </ConfirmationRow>
      </ConfirmationBlock>

      <Warning>
        <WarningIcon>
          <SvgIcon src={Attention} height="40px" />
        </WarningIcon>
        <InlineText size="sm">
          Please make sure you have enough SOL to proceed transaction. You will
          need to sign several transactions, and then your pool will appear in
          the list of pools and in the &quot;Your Liquidity&quot; tab.
        </InlineText>
      </Warning>
    </div>
  )
}
