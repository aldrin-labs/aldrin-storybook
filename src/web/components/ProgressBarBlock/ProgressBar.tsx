import React from 'react'

import { InlineText } from '../Typography'
import { Progress, ProgressBarContainer } from './styles'

export const ProgressBar = ({
  children,
  width,
}: {
  children: any
  width: string
}) => {
  return (
    <ProgressBarContainer>
      <Progress width={width}>
        <InlineText size="sm" weight={600}>
          {children}
        </InlineText>
      </Progress>
    </ProgressBarContainer>
  )
}
