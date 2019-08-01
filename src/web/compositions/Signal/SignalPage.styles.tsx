import React from 'react'
import styled from 'styled-components'
import { Grid, Typography } from '@material-ui/core'

export const SignalName = styled(Typography)`
  font-family: DM Sans;
  font-style: normal;
  font-weight: 700;
  font-size: 0.875rem;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  color: ${(props) => props.textColor};
`

export const TypographyTitle = styled(Typography)`
  font-family: DM Sans;
  font-style: normal;
  font-weight: 700;
  font-size: ${(props) => props.fontSize || '0.5625rem'};
  letter-spacing: 1px;
  text-transform: uppercase;
  color: ${(props) => props.textColor || '#7284a0'};
`
export const TypographyPercentage = styled(Typography)`
  color: ${(props) => props.textColor || '#7284a0'};
`

export const FolioValuesCell = styled(Grid)`
  height: '48px';
  width: '92px';
  padding: 10px;
  background: ${(props) => props.bgColor || '#F9FBFD'};
  border: ${(props) => props.borderCell || '1px solid #E0E5EC'};
  border-radius: ${props => props.borderRadius || '12px'};
`
