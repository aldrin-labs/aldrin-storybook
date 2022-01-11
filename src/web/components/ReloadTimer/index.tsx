import { COLORS } from '@variables/variables'
import React, { useState } from 'react'
import { CountdownCircleTimer } from 'react-countdown-circle-timer'

import { TimerButton } from './styles'
import { ReloadTimerProps } from './types'

export const ReloadTimer: React.FC<ReloadTimerProps> = (props) => {
  const {
    size = 14,
    duration = 10,
    initialRemainingTime = 10,
    color = 'primary',
    trailColor = 'background',
    callback,
    margin,
    rerenderOnClick = true,
  } = props

  const [rerenderCounter, rerender] = useState(0)

  return (
    <TimerButton
      margin={margin}
      onClick={() => {
        callback()
        if (rerenderOnClick) {
          rerender(rerenderCounter + 1)
        }
      }}
    >
      <CountdownCircleTimer
        key={rerenderCounter}
        size={size}
        strokeWidth={3}
        isPlaying
        duration={duration}
        initialRemainingTime={initialRemainingTime}
        colors={COLORS[color]}
        trailColor={COLORS[trailColor]}
        onComplete={() => {
          callback()
          rerender(rerenderCounter + 1)
          return [true, 0]
        }}
      />
    </TimerButton>
  )
}
