import React from 'react'
import styled from 'styled-components'
// import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import { Typography, Button } from '@material-ui/core'

export const TypographyHeading = styled(Typography)`
  border-left: 0.3rem solid #165be0;
  border-radius: 0.4rem 0px 0px 0.4rem;
  padding: 0.5rem 1.2rem 0.5rem 1rem;
  font-family: DM Sans;
  font-style: normal;
  font-weight: 700;
  font-size: 1.4rem;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: ${(props) => props.textColor};
`

export const StyledButton = styled(
  ({ padding, margin, borderRadius, ...rest }) => <Button {...rest} />
)`
  padding: ${(props) => props.padding || 'auto'};
  border-radius: ${(props) => props.borderRadius};
  margin: 'auto';
  color: #165be0;
  border: 1.5px solid #165be0;
  font-size: 1.08rem;
  font-weight: 600;
`
