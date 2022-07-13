import { BREAKPOINTS, FONTS, FONT_SIZES } from '@variables/variables'
import React from 'react'
import styled from 'styled-components'

import { Text } from '@sb/compositions/Addressbook/index'
import { RowContainer } from '@sb/compositions/AnalyticsRoute/index.styles'
import { StyledPaper } from '@sb/compositions/Pools/components/Popups/index.styles'

export const UpdatedPaper = styled(({ ...props }) => (
  <StyledPaper {...props} />
))`
  font-size: 16px;
  background: ${(props) => props.theme.colors.white5};
  width: 30em;

  @media (max-width: ${BREAKPOINTS.sm}) {
    max-height: 100%;
    margin: 0;
    width: 100%;
  }
`

export const SelectorRow = styled(({ ...props }) => (
  <RowContainer {...props} />
))`
  background: ${(props) => props.theme.colors.white4};
  border-radius: 1.2rem;
  margin-bottom: 0.8em;
  padding: 1.5em;
`

export const StyledText = styled(({ ...props }) => <Text {...props} />)`
  font-size: ${FONT_SIZES.md};
  font-family: ${FONTS.demi};
`
