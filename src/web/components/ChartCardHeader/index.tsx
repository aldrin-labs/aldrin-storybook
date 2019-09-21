import React from 'react'
import styled from 'styled-components'

import { TypographyFullWidth } from '@sb/styles/cssUtils'
import { Title } from '@sb/components/OldTable/Table'

export const CardTitle = styled(TypographyFullWidth)`
  font-family: Trebuchet MS;
  font-style: normal;
  font-weight: normal;
  text-transform: capitalize;
  letter-spacing: auto;
  font-size: 1.4rem;
  line-height: 2rem;
  padding-top: 2px;
  text-align: center;
  color: #16253d;

  @media (min-width: 2560px) {
    line-height: 3rem;
  }
`

export const TriggerTitle = styled(Title)`
  height: 4rem;
  cursor: pointer;
  position: relative;
  padding: 0;
  transition: opacity 0.75s ease-in-out;
  background: #f2f4f6;
  border-bottom: 1px solid #e0e5ec;

  &:hover {
    opacity: 0.85;
  }

  @media (min-width: 1921px) {
    height: 3rem;
  }

  @media (min-width: 2560px) {
    height: 3.5rem;
  }
`

const ChartCardHeader = ({ children }: { children: string }) => {
  return (
    <TriggerTitle>
      <CardTitle variant="subtitle2">{children}</CardTitle>
    </TriggerTitle>
  )
}

export default ChartCardHeader
