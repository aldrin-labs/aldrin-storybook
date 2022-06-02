import React from 'react'

import { InlineText } from '../Typography'
import { Progress, ProgressBarContainer } from './styles'

export const ProgressBar = ({
  children,
  width,
  background,
  padding,
}: {
  children: any
  width: string
  background?: string
  padding: string
}) => {
  return (
    <ProgressBarContainer background={background}>
      <Progress padding={padding} $width={width} />
      <InlineText size="sm" weight={600}>
        {children}
      </InlineText>
    </ProgressBarContainer>
  )
}
