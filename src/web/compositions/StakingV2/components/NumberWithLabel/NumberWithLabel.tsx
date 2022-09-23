import React from 'react'

import { Container, Label } from './styles'
import { NumberWithLabelProps } from './types'

export const NumberWithLabel: React.FC<NumberWithLabelProps> = (props) => {
  const {
    value = null,
    label,
    size,
    center = false,
    padding = '0 0 0 0.25em',
    needPercenatage = true,
  } = props

  return (
    <Container>
      {value}
      {needPercenatage ? '%' : ''}
      <Label
        padding={padding}
        style={center ? { margin: '0 auto' } : undefined}
        size={size}
        weight="600"
      >
        {label}
      </Label>
    </Container>
  )
}
