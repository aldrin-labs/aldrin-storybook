import React from 'react'
import { useTheme } from 'styled-components'

import { useInterval } from '@sb/dexUtils/useInterval'

import OverlayIcon from './OverlayIcon'
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

const PieTimer: React.FC<PieTimerParams> = (params: PieTimerParams) => {
  const { duration, size = 32, callback } = params
  const theme = useTheme()

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
        <OverlayIcon color={theme.colors.white6} />
      </div>
    </PieTimerContainer>
  )
}

export { PieTimer }
