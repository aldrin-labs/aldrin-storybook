import React from 'react'

import { estimateTime } from '@core/utils/dateUtils'

import { InlineText } from '../Typography'
import { Progress, ProgressBarContainer } from './styles'
import { TimeProgressBarProps, ProgressBarProps } from './types'

export const ProgressBar: React.FC<ProgressBarProps> = (props) => {
  const { children, width, background, padding } = props
  return (
    <ProgressBarContainer background={background}>
      <Progress padding={padding} width={width} />
      <InlineText size="sm" weight={600}>
        {children}
      </InlineText>
    </ProgressBarContainer>
  )
}

export const TimeProgressBar: React.FC<TimeProgressBarProps> = (props) => {
  const {
    startTime,
    duration,
    finishedText = 'Finished',
    background,
    padding,
  } = props

  const endTime = startTime + duration

  const timeLeft = Math.max(0, endTime - Date.now() / 1000)

  const timePassed = Date.now() / 1000 - startTime

  const isFinished = timeLeft === 0

  const progress = timePassed / duration

  const estimatedTime = estimateTime(timeLeft)

  return (
    <ProgressBar
      background={background}
      padding={padding}
      width={`${Math.min(1, progress) * 100}%`}
    >
      {isFinished ? (
        finishedText
      ) : (
        <>
          {!!estimatedTime.days && `${estimatedTime.days}d `}
          {!!estimatedTime.hours && `${estimatedTime.hours}h `}
          {!!estimatedTime.minutes && `${estimatedTime.minutes}m `}
        </>
      )}
    </ProgressBar>
  )
}
