import React from 'react'

import { useInterval } from '@sb/dexUtils/useInterval'

import {
  PieTimerCircleInside,
  PieTimerContainer,
  SmalletPieTimerCircleInside,
} from './styles'

interface PieTimerParams {
  duration: number
  size?: number
  callback: () => void
}

const PieTimer = (params: PieTimerParams) => {
  const { duration, size = 32, callback } = params

  const restartAnimation = () => {
    const pieTimerAnimationNode = document.querySelector(
      '.pie-timer-fill-animation'
    )

    if (pieTimerAnimationNode) {
      pieTimerAnimationNode.style.animationName = 'none'

      requestAnimationFrame(() => {
        setTimeout(() => {
          pieTimerAnimationNode.style.animationName = ''
        }, 0)
      })
    }
  }

  const { reset } = useInterval(() => callback(), duration * 1000)

  return (
    <PieTimerContainer
      size={size}
      onClick={() => {
        restartAnimation()
        reset()
        callback()
      }}
    >
      <div className="pie-timer-filled" />
      <div className="pie-timer-fill-animation" />
      <PieTimerCircleInside />
      <SmalletPieTimerCircleInside />
      <div className="svg-overlay">
        <svg
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="3.5 3.5 29 29"
        >
          <path
            d="M18 4C16.1615 4 14.341 4.36212 12.6424 5.06569C10.9439 5.76925 9.40053 6.80049 8.10051 8.10051C6.80049 9.40053 5.76925 10.9439 5.06569 12.6424C4.36212 14.341 4 16.1615 4 18C4 19.8385 4.36212 21.659 5.06569 23.3576C5.76925 25.0561 6.80049 26.5995 8.10051 27.8995C9.40053 29.1995 10.9439 30.2307 12.6424 30.9343C14.341 31.6379 16.1615 32 18 32C19.8385 32 21.659 31.6379 23.3576 30.9343C25.0561 30.2307 26.5995 29.1995 27.8995 27.8995C29.1995 26.5995 30.2307 25.0561 30.9343 23.3576C31.6379 21.659 32 19.8385 32 18C32 16.1615 31.6379 14.341 30.9343 12.6424C30.2307 10.9439 29.1995 9.40052 27.8995 8.1005C26.5995 6.80048 25.0561 5.76925 23.3576 5.06569C21.659 4.36212 19.8385 4 18 4L18 4Z"
            stroke="#181825"
            strokeWidth="4"
            strokeDasharray="1 1"
          />{' '}
        </svg>
      </div>
    </PieTimerContainer>
  )
}

export { PieTimer }
