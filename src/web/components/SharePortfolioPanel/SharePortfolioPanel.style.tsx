import React from 'react'
import styled from 'styled-components'
// import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import { Typography, Button, Grid } from '@material-ui/core'

export const TypographyHeading = styled(Typography)`
  border-left: 3px solid #165be0;
  border-radius: 4px 0px 0px 4px;
  padding: 8px 15px;
  font-family: DM Sans;
  font-style: normal;
  font-weight: 700;
  font-size: 0.875rem;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: ${(props) => props.textColor};
`

export const StyledButton = styled(({
  padding,
  margin,
  borderRadius,
  ...rest
}) =>
  <Button {...rest} />)`
  padding: ${props => props.padding || 'auto'};
  border-radius: ${props => props.borderRadius};
  margin: 'auto';
  color: #165BE0;
  border: 1.5px solid #165BE0;
  font-size: .675rem;
  font-weight: 600;
`;