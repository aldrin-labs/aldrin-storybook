import React from 'react'
import styled from 'styled-components'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import { Grid, Typography } from '@material-ui/core'

export const TypographyHeading = styled(Typography)`
  border-left: 3px solid #165be0;
  border-radius: 4px 0px 0px 4px;
  padding-left: 15px;

  font-family: DM Sans;
  font-style: normal;
  font-weight: 700;
  font-size: 0.875rem;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: ${(props) => props.textColor};
`
