import React from 'react'

import { FirstPart, LineContainer, SecondPart } from './index.styles'

export const BalanceLine = ({
  value1,
  value2,
}: {
  value1: string
  value2: string
}) => {
  return (
    <LineContainer>
      <FirstPart width={value1} />
      <SecondPart width={value2} />
    </LineContainer>
  )
}
