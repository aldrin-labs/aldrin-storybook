import { FONT_SIZES, UCOLORS } from '@variables/variables'
import React, { CSSProperties, useState } from 'react'
import { CountdownCircleTimer } from 'react-countdown-circle-timer'
import styled from 'styled-components'

export const TimerButton = styled.div`
  width: 2em;
  height: 2em;
  display: flex;
  justify-content: center;
  align-items: center;
  background: ${(props) => props.theme.colors.white4};
  border-radius: 0.8rem;
  cursor: pointer;
  margin: ${(props: { margin?: string }) => props.margin || '0 3rem 0 0'};
`

export const ReloadTimer = ({
  size = 21,
  duration = 10,
  initialRemainingTime = 10,
  color = UCOLORS.blue3,
  trailColor = UCOLORS.blue1,
  callback,
  margin = '0 3rem 0 0',
  rerenderOnClick = true,
  showTime = false,
  timerStyles = {},
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
  timerStyles?: CSSProperties
  timeStyles?: CSSProperties
}) => {
  const [rerenderCounter, rerender] = useState(0)

  return (
    <TimerButton
      margin={margin}
      style={timerStyles}
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
                fontFamily: 'Avenir Next',
                fontSize: FONT_SIZES.xs,
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
