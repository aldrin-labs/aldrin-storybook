import React from 'react'
import { FarmingState } from '@sb/dexUtils/common/types'
import { InlineText } from '@sb/components/Typography'
import { TooltipText } from './styles'

interface ClaimTimeTooltipProps {
  farmingState?: FarmingState | null
}

export const ClaimTimeTooltip: React.FC<ClaimTimeTooltipProps> = (props) => {
  const hasVesting = props.farmingState?.vestingPeriod !== 0

  return (
    <div>
      <TooltipText>Rewards are updated once every <InlineText color="success"> 1-3 hours.</InlineText> </TooltipText>
      {hasVesting &&
        <>
          <TooltipText>
            The pool creator set up the vesting.
          </TooltipText>
          <TooltipText>
            This means that you will receive <InlineText color="success">25%</InlineText> of your reward
            <InlineText color="success">every 24 hours,</InlineText>
             while the remaining <InlineText color="success">75%</InlineText>  of your reward will come
             <InlineText color="success">every 3 days</InlineText>.
          </TooltipText>
        </>
      }
    </div>
  )
}