import React from 'react'

import { Container, Label } from './styles'
import { NumberWithLabelProps } from './types'

export const NumberWithLabel: React.FC<NumberWithLabelProps> = (props) => {
  const { value = null, label, size, center = false } = props

  return (
    <Container>
      {value ? `${value.toFixed(2)}%` : ''}
      <Label
        style={center ? { margin: '0 auto' } : undefined}
        size={size}
        weight={value ? '400' : '600'}
      >
        {label}
      </Label>
    </Container>
  )
}
