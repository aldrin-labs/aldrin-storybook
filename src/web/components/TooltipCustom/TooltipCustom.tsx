import React from 'react'
import { StyledTooltip } from './TooltipCustom.styles'

import { IProps } from './TooltipCustom.types'

const TooltipCustom = ({
  component,
  title,
  withSpan = false,
  enterDelay = 250,
  leaveDelay = 250,
  ...otherProps
}: IProps) => {
  if (withSpan) {
    return (
      <StyledTooltip
        {...{ enterDelay, leaveDelay, title: `${title}`, ...otherProps }}
      >
        <span>{component}</span>
      </StyledTooltip>
    )
  }

  return (
    <StyledTooltip {...{ enterDelay, leaveDelay, title: `${title}`, ...otherProps }}>
      {component}
    </StyledTooltip>
  )
}

export default TooltipCustom
