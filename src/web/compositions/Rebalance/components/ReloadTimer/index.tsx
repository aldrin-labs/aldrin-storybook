import React, { CSSProperties, useState } from 'react'
import { CountdownCircleTimer } from 'react-countdown-circle-timer'
import styled from 'styled-components'

export const TimerButton = styled.div`
  width: 3rem;
  height: 3rem;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #17181a;
  border-radius: 0.8rem;
  cursor: pointer;
  margin: ${(props: { margin?: string }) => props.margin || '0 3rem 0 0'};
`

export const ReloadTimer = ({
  size = 21,
  duration = 10,
  initialRemainingTime = 10,
  color = '#651CE4',
  trailColor = '#383B45',
  callback,
  margin = '0 3rem 0 0',
  rerenderOnClick = true,
  showTime = false,
  timeStyles = {},
}: {
  size?: number
  duration?: number
  initialRemainingTime?: number
  color?: string
  trailColor?: string
  callback: () => void
  margin?: string
  rerenderOnClick?: boolean
  showTime?: boolean
  timeStyles?: CSSProperties
}) => {
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
        colors={color}
        trailColor={trailColor}
        onComplete={() => {
          callback()
          rerender(rerenderCounter + 1)
          return [true, 0]
        }}
      >
        {({ remainingTime }) =>
          showTime ? (
            <span
              style={{
                color: '#fafafa',
                fontFamily: 'Avenir Next',
                fontSize: '1rem',
                ...timeStyles,
              }}
            >
              {remainingTime % 60}
            </span>
          ) : null
        }
      </CountdownCircleTimer>
    </TimerButton>
  )
}
