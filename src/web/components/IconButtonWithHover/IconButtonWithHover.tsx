import React, { SyntheticEvent } from 'react'
import { IconButtonWithHover } from './IconButtonWithHover.styles'

const IconButtonWithHoverComponent = ({
  component,
  hoverColor,
  onClick,
  ...otherProps
}: {
  component: any
  hoverColor: string
  onClick: (e: SyntheticEvent<Element>) => void
}) => (
  <IconButtonWithHover
    hoverColor={hoverColor}
    onClick={onClick}
    {...otherProps}
  >
    {component}
  </IconButtonWithHover>
)

export default IconButtonWithHoverComponent
