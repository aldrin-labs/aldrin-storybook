import pluralize from 'pluralize'
import React, { ReactNode } from 'react'

import { SvgIcon } from '@sb/components'
import { DarkTooltip } from '@sb/components/TooltipCustom/Tooltip'
import { InlineText } from '@sb/components/Typography'
import { getTokenName } from '@sb/dexUtils/markets'
import { useTokenInfos } from '@sb/dexUtils/tokenRegistry'

import Attention from '@icons/attention.svg'
import ScalesIcon from '@icons/scales.svg'

import {
  ConfirmationBlock,
  ConfirmationRow,
  SvgIconContainer,
  Warning,
  WarningIcon,
} from './styles'
import { CreatePoolFormType } from './types'

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

  const tokenInfo = useTokenInfos()

  const baseName = getTokenName({
    address: values.baseToken.mint,
    tokensInfoMap: tokenInfo,
  })
  const quoteName = getTokenName({
    address: values.quoteToken.mint,
    tokensInfoMap: tokenInfo,
  })
  const farmingTokenName = getTokenName({
    address: values.farming.token.mint,
    tokensInfoMap: tokenInfo,
  })

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
            {values.farmingEnabled ? `${farming.farmingPeriod} days ` : '-'}
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
            <InlineText size="sm" color="green0">
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
        <InlineText color="primaryWhite" size="sm">
          Please make sure you have enough SOL to proceed transaction. You will
          need to sign several transactions, and then your pool will appear in
          the list of pools and in the &quot;Your Liquidity&quot; tab.
        </InlineText>
      </Warning>
    </div>
  )
}
