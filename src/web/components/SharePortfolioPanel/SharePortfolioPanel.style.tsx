import React from 'react'
import styled from 'styled-components'
// import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import { Typography, Button, Grid } from '@material-ui/core'

export const TypographyHeading = styled(Typography)`
  border-left: .3rem solid #165be0;
  border-radius: .4rem 0px 0px .4rem;
  padding: .5rem 1.2rem .5rem 1rem;
  font-family: DM Sans;
  font-style: normal;
  font-weight: 700;
  font-size: 1.4rem;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: ${(props) => props.textColor};
`

export const StyledButton = styled(({
  padding,
  margin,
  borderRadius,
  textTransform = '',
  ...rest
}) =>
  <Button {...rest} />)`
  padding: ${props => props.padding || 'auto'};
  border-radius: ${props => props.borderRadius};
  margin: 'auto';
  color: #165BE0;
  border: 1.5px solid #165BE0;
  font-size: 1.08rem;
  font-weight: 600;
  text-transform: ${props => props.textTransform};
`;
