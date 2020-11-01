import React from 'react'
import { Button } from '@material-ui/core'
import styled from 'styled-components'

const StyledButton = styled(Button)`
  font-size: 12px;

  @media only screen and (max-width: 1100px) {
    font-size: 9px;
  }
  @media only screen and (min-width: 2367px) {
    font-size: 1rem;
  }
`

export const SButton = styled(
  ({ isActivePage, type, white, black, style, ...rest }) => (
    <StyledButton {...rest} />
  )
)`
  && {
    color: ${(props) => (props.isActivePage ? props.blue : props.grey)};
    background: ${(props) =>
      props.isActivePage ? props.borderColor : 'transparent'};
    font-family: Avenir Next Demi;
    letter-spacing: 0.05rem;
    font-size: 1.2rem;
    transition: 0.35s all;
    width: 100%;
    height: 100%;
    padding: 0;
    border-radius: 0.6rem;
    text-transform: capitalize;
    // padding: 0 8px;

    @media only screen and (max-width: 1100px) {
      margin: ${(props) => props.margin || '0'};
    }

    &:hover {
      color: ${(props) => props.blue};
      background: ${(props) => props.borderColor};
    }

    ${(props) => props.style}
  }
`

export const Marker = styled.span`
  width: 28px;
  height: 6px;
  border-radius: 6px;
  background: ${(props: { color: string }) => props.color};
  position: absolute;
  bottom: -9px;
`
