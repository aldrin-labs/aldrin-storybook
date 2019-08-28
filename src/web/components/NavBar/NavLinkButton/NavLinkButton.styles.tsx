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
  ({ isActivePage, type, white, black, ...rest }) => <StyledButton {...rest} />
)`
  margin: 0 1rem;
  font-weight: 500;
  letter-spacing: 1px;
  transition: 0.35s all;

  @media only screen and (max-width: 1100px) {
    margin: 0;
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
