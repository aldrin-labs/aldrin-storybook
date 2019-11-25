import React, { CSSProperties } from 'react'
import styled from 'styled-components'

import { TypographyFullWidth } from '@sb/styles/cssUtils'
import { Title } from '@sb/components/OldTable/Table'

export const CardTitle = styled(TypographyFullWidth)`
  font-family: DM Sans;
  font-style: normal;
  font-weight: bold;
  line-height: 1rem;
  text-transform: uppercase;
  letter-spacing: auto;
  font-size: 1rem;
  text-align: center;
  color: #16253d;
`

export const TriggerTitle = styled(Title)`
  height: auto;
  line-height: 1rem;
  position: relative;
  padding: 1rem 0;
  transition: opacity 0.75s ease-in-out;
  background: #f2f4f6;
  border-bottom: 0.1rem solid #e0e5ec;
  border-radius: 0.75rem 0.75rem 0px 0px;

  &:hover {
    opacity: 0.85;
  }
`

const ChartCardHeader = ({
  children,
  style,
}: {
  children?: string
  style?: CSSProperties
}) => {
  return (
    <TriggerTitle>
      <CardTitle style={style} variant="subtitle2">
        {children}
      </CardTitle>
    </TriggerTitle>
  )
}

export default ChartCardHeader
