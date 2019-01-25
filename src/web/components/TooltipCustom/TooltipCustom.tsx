import React from 'react'
import Tooltip from '@material-ui/core/Tooltip'

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
      <Tooltip
        {...{ enterDelay, leaveDelay, title: `${title}`, ...otherProps }}
      >
        <span>{component}</span>
      </Tooltip>
    )
  }

  return (
    <Tooltip {...{ enterDelay, leaveDelay, title: `${title}`, ...otherProps }}>
      {component}
    </Tooltip>
  )
}

export default TooltipCustom
