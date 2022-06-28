import pluralize from 'pluralize'
import React from 'react'

import { InlineText } from '@sb/components/Typography'

import { estimateTime } from '@core/utils/dateUtils'

import { TooltipText } from './styles'
import { ClaimTimeTooltipProps } from './types'

export const ClaimTimeTooltip: React.FC<ClaimTimeTooltipProps> = (props) => {
  const { farmingState } = props
  const hasVesting = farmingState?.vestingPeriod !== 0

  const estimate = estimateTime(farmingState?.vestingPeriod || 0)

  return (
    <div>
      <TooltipText>
        Rewards are updated once every{' '}
        <InlineText color="green3"> 60-80 minutes.</InlineText>{' '}
      </TooltipText>
      {hasVesting && (
        <>
          <TooltipText>The pool creator set up the vesting.</TooltipText>
          <TooltipText>
            This means that you will receive&nbsp;
            <InlineText color="green3">33.33%</InlineText> of your reward&nbsp;
            <InlineText color="green3">every 24 hours,</InlineText>&nbsp; while
            the remaining &nbsp;
            <InlineText color="green3">66.67%</InlineText> of your reward will
            come&nbsp;
            <InlineText color="green3">
              every{' '}
              {!!estimate.days && (
                <>
                  {estimate.days} {pluralize('day', estimate.days)}
                </>
              )}{' '}
              &nbsp;
              {!!estimate.hours && (
                <>
                  {estimate.hours} {pluralize('hour', estimate.hours)}
                </>
              )}{' '}
            </InlineText>
            .
          </TooltipText>
        </>
      )}
    </div>
  )
}
