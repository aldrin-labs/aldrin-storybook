import React, { useState } from 'react'
import styled from 'styled-components'
import { CountdownCircleTimer } from 'react-countdown-circle-timer'

export const TimerButton = styled.div`
  width: 4rem;
  height: 4rem;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #383b45;
  border-radius: 0.8rem;
  cursor: pointer;
  margin-right: ${(props: { marginRight: string }) =>
    props.marginRight || '3rem'};
`

export const ReloadTimer = ({
  size = 23,
  duration = 10,
  initialRemainingTime = 0,
  color = '#651CE4',
  trailColor = '#383B45',
  callback,
  marginRight = '3rem',
  rerenderOnClick = true,
}: {
  size?: number
  duration?: number
  initialRemainingTime?: number
  color?: string
  trailColor?: string
  callback: () => void
  marginRight?: string
  rerenderOnClick?: boolean
}) => {
  const [rerenderCounter, rerender] = useState(0)

  return (
    <TimerButton
      marginRight={marginRight}
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
        isPlaying={true}
        duration={duration}
        initialRemainingTime={initialRemainingTime}
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
