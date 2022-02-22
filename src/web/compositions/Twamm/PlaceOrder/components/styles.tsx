import React from 'react'
import styled from 'styled-components'

import { Text } from '@sb/compositions/Addressbook'
import { RowContainer } from '@sb/compositions/AnalyticsRoute/index.styles'
import { StyledPaper } from '@sb/compositions/Pools/components/Popups/index.styles'

export const UpdatedPaper = styled(({ ...props }) => (
  <StyledPaper {...props} />
))`
  width: 55rem;
`

export const SelectorRow = styled(({ ...props }) => (
  <RowContainer {...props} />
))`
  border-bottom: 0.1rem solid #383b45;
  height: 5rem;
`

export const StyledText = styled(({ ...props }) => <Text {...props} />)`
  margin: 0 0.5rem;
  font-size: 2em;
  font-family: Avenir Next Demi;
`
