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
  font-family: DM Sans Medium;
  text-transform: none;
  text-decoration: none;
  padding: ${(props) => props.padding || 'auto'};
  border-radius: ${(props) => props.borderRadius};
  margin: 'auto';
  color: ${(props) => (props.active ? '#fff' : '#0b1fd1')};
  background: ${(props) => (!props.active ? '#fff' : '#0b1fd1')};
  border: 0.1rem solid #0b1fd1;
  font-size: 1.2rem;
  font-weight: 500;
  letter-spacing: 0.05rem;

  &:hover {
    color: ${(props) => (!props.active ? '#fff' : '#0b1fd1')};
    background: ${(props) => (props.active ? '#fff' : '#0b1fd1')};
    transition: all 0.3s ease-out;
  }
`

export const StyledLink = styled(
  ({ padding, margin, borderRadius, ...rest }) => <Link {...rest} />
)`
  font-family: DM Sans Medium;
  text-transform: none;
  text-decoration: none;
  padding: ${(props) => props.padding || 'auto'};
  border-radius: ${(props) => props.borderRadius};
  margin: 'auto';
  color: ${(props) => (props.active ? '#fff' : '#0b1fd1')};
  background: ${(props) => (!props.active ? '#fff' : '#0b1fd1')};
  border: 0.1rem solid #0b1fd1;
  font-size: 1.2rem;
  font-weight: 500;
  letter-spacing: 0.05rem;

  &:hover {
    color: ${(props) => (!props.active ? '#fff' : '#0b1fd1')};
    background: ${(props) => (props.active ? '#fff' : '#0b1fd1')};
    transition: all 0.3s ease-out;
  }
`
