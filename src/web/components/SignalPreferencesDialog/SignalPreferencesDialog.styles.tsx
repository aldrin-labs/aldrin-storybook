import React from 'react'
import styled from 'styled-components'
import { Grid, Typography, IconButton } from '@material-ui/core'
import {
  TypographySectionTitle,
  StyledInput,
  ShareButton,
} from '@sb/components/SharePortfolioDialog/SharePortfolioDialog.styles'

export const SignalPropertyGrid = styled(Grid)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
`

export const SectionTitle = styled(TypographySectionTitle)`
  color: #7284a0;
`

export const RefreshButton = styled(IconButton)`
  color: #165be0;
  padding: 0.5rem;
`

export const PropertyName = styled(Typography)`
  padding: 0.5rem 0;
  font-family: DM Sans;
  font-style: normal;
  font-weight: 600;
  font-size: 1.2rem;
  line-height: 23px;
  letter-spacing: 1px;
  text-transform: uppercase;
  white-space: nowrap;
  color: #16253d;
  width: 20%;

  @media (min-width: 1921px) {
    font-size: 1.05rem;
  }

  @media (min-width: 2560px) {
    font-size: 1rem;
  }
`

export const PropertyInput = styled(StyledInput)`
  margin: 0 auto;
`

export const SaveButton = styled(ShareButton)`
  color: #2f7619;
  border-color: #2f7619;
`
