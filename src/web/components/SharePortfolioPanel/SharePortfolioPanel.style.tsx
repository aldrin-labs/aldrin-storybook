import React from 'react'
import styled from 'styled-components'
// import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import { Typography, Button } from '@material-ui/core'
import { Link } from 'react-router-dom'

export const TypographyHeading = styled(({ textColor, ...rest }) => (
  <Typography {...rest} />
))`
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
  color: #0B1FD1;
  border: .1rem solid #0B1FD1;
  font-size: 1.2rem;
  font-weight: 500;
  letter-spacing: 0.05rem;

  &:hover {
    color: #fff;
    background: #0B1FD1;
    transition: all .3s ease-out;
  }
`

export const StyledLink = styled(
  ({ padding, margin, borderRadius, ...rest }) => <Link {...rest} />
)`
  font-family: DM Sans Medium;
  text-transform: uppercase;
  text-decoration: none;
  padding: ${(props) => props.padding || 'auto'};
  border-radius: ${(props) => props.borderRadius};
  margin: 'auto';
  color: #0B1FD1;
  border: .1rem solid #0B1FD1;
  font-size: 1.2rem;
  font-weight: 500;
  letter-spacing: 0.05rem;

  &:hover {
    color: #fff;
    background: #0B1FD1;
    transition: all .3s ease-out;
  }
`
