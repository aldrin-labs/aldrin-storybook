import React from 'react'

import { InlineText } from '@sb/components/Typography'

export const LabelsTooltips = ({
  type,
  period = '2 days',
  amount = '1 000 000',
}: {
  type: string
  period: string
  amount?: string | number
}) => {
  return (
    <>
      {type === 'New' && (
        <InlineText color="gray0">
          This pool was launched{' '}
          <InlineText color="gray0" weight={600}>
            {period}
          </InlineText>{' '}
          ago.
        </InlineText>
      )}
      {type === 'Locked' && (
        <InlineText color="gray0">
          Pool creator locked their{' '}
          <InlineText color="green4" weight={600}>
            $ {amount}
          </InlineText>{' '}
          worth liquidity till{' '}
          <InlineText color="gray0" weight={600}>
            {period}
          </InlineText>
        </InlineText>
      )}
    </>
  )
}
