import React from 'react'
import { InlineText } from '@sb/components/Typography'
import { TooltipText } from './styles'
import { ClaimTimeTooltipProps } from './types'

export const ClaimTimeTooltip: React.FC<ClaimTimeTooltipProps> = (props) => {
  const { farmingState } = props
  const hasVesting = farmingState?.vestingPeriod !== 0

  return (
    <div>
      <TooltipText>
        Rewards are updated once every{' '}
        <InlineText color="success"> 60-80 minutes.</InlineText>{' '}
      </TooltipText>
      {hasVesting && (
        <>
          <TooltipText>The pool creator set up the vesting.</TooltipText>
          <TooltipText>
            This means that you will receive&nbsp;
            <InlineText color="success">33.33%</InlineText> of your reward&nbsp;
            <InlineText color="success">every 24 hours,</InlineText>&nbsp; while
            the remaining &nbsp;
            <InlineText color="success">66.67%</InlineText> of your reward will
            come&nbsp;
            <InlineText color="success">every 3 days</InlineText>.
          </TooltipText>
        </>
      )}
    </div>
  )
}
