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
  background: ${(props) => props.theme.colors.white6};
  width: 25em;

  @media (max-width: ${BREAKPOINTS.sm}) {
    max-height: 100%;
    margin: 0;
    width: 100%;
    height: 100%;
  }
`

export const SelectorRow = styled(({ ...props }) => (
  <RowContainer {...props} />
))`
  background: ${(props) => props.theme.colors.white5};
  border-radius: 1.2rem;
  margin-bottom: 0.8em;
  padding: 1.5em;
  top: 0px;
  transition: all 0.3s ease-out;

  &:hover {
    background: ${(props) => props.theme.colors.white4};
    transition: all 0.4s ease-out;
  }
`

export const StyledText = styled(({ ...props }) => <Text {...props} />)`
  font-size: ${FONT_SIZES.xsm};
  font-family: ${FONTS.demi};
`

export const TokenButton = styled.button`
  display: flex;
  align-items: center;
  background: ${(props) => props.theme.colors.white5};
  cursor: pointer;

  padding: 0.5em 0.75em;
  margin: 0.2em 0.8em 0.2em 0;

  border: 0;
  border-radius: 0.5em;
  transition: all 0.3s ease-out;

  &:hover {
    background: ${(props) => props.theme.colors.white4};
    transition: all 0.3s ease-out;
  }
`

export const TokenButtonText = styled.span`
  color: ${(props) => props.theme.colors.white1};
  font-family: ${FONTS.demi};
  font-size: ${FONT_SIZES.xsm};
`

export const HeaderContainer = styled(({ ...props }) => (
  <RowContainer {...props} />
))`
  top: 0px;
  position: sticky;
  z-index: 100;
  background: ${(props) => props.theme.colors.white1};
`

export const Container = styled(RowContainer)`
  height: 100%;
`
export const TokensContainer = styled(RowContainer)`
  height: 55vh;
  overflow: auto;

  @media (max-width: ${BREAKPOINTS.sm}) {
    height: 80%;
  }
`
