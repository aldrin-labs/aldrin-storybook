import React from 'react'
import styled from 'styled-components'
import { Grid, Typography } from '@material-ui/core'

export const TypographyHeader = styled(Typography)`
  font-family: DM Sans;
  font-style: normal;
  font-weight: 500;
  font-size: 0.875rem;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  color: ${(props) => props.textColor || '#16253d'};
`
export const TypographyTitle = styled(Typography)`
  font-family: DM Sans;
  font-style: normal;
  font-weight: 700;
  font-size: 0.5625rem;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: ${(props) => props.textColor || '#7284a0'};
`
export const TypographyPercentage = styled(Typography)`
  color: ${(props) => props.textColor || '#7284a0'};
`
