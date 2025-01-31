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
  } = props

  const isValidValue = Number.isFinite(value)

  return (
    <Container>
      {isValidValue ? `${value.toFixed(2)}%` : ''}
      <Label
        padding={padding}
        style={center ? { margin: '0 auto' } : undefined}
        size={size}
        weight={isValidValue ? '400' : '600'}
      >
        {label}
      </Label>
    </Container>
  )
}
