import React, { useState } from 'react'
import styled from 'styled-components'
import { CountdownCircleTimer } from 'react-countdown-circle-timer'

const TimerButton = styled.div`
  width: 4rem;
  height: 4rem;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #383b45;
  border-radius: 0.8rem;
  cursor: pointer;
  margin-right: 3rem;
`

export const ReloadTimer = ({
  size = 23,
  duration = 10,
  color = '#366CE5',
  trailColor = '#383B45',
  callback,
}: {
  size?: number
  duration?: number
  color?: string
  trailColor?: string
  callback: () => void
}) => {
  const [rerenderCounter, rerender] = useState(0)

  return (
    <TimerButton
      onClick={() => {
        callback()
        rerender(rerenderCounter + 1)
      }}
    >
      <CountdownCircleTimer
        key={rerenderCounter}
        size={size}
        strokeWidth={3}
        isPlaying={true}
        duration={duration}
        colors={color}
        trailColor={trailColor}
        onComplete={() => {
          callback()
          return [true, 0]
        }}
      />
    </TimerButton>
  )
}
