import React from 'react'

import { Container, Label } from './styles'
import { NumberWithLabelProps } from './types'

export const NumberWithLabel: React.FC<NumberWithLabelProps> = (props) => {
  const { value, label } = props

  return (
    <Container>
      {value.toFixed(2)}%<Label>{label}</Label>
    </Container>
  )
}
