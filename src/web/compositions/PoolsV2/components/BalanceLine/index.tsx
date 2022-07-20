import React from 'react'

import { FirstPart, LineContainer, SecondPart } from './index.styles'

export const BalanceLine = ({
  value1,
  value2,
  needRotate,
}: {
  value1: string
  value2: string
  needRotate?: boolean
}) => {
  return (
    <LineContainer needRotate={needRotate}>
      <FirstPart needRotate={needRotate} width={value1} />
      <SecondPart needRotate={needRotate} width={value2} />
    </LineContainer>
  )
}
