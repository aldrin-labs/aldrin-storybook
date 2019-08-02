import React from 'react'
import { Button } from '@material-ui/core'
import styled from 'styled-components'

const StyledButton = styled(Button)`
  font-size: 1.375rem;
`

export const SButton = styled(({ isActivePage, type, white, black, ...rest }) => <StyledButton {...rest} />)`
  margin: .4rem 1.6rem;
  font-weight: 500;
  transition: .35s all; 
`

export const Marker = styled.span`
  width: 28px;
  height: 6px;
  border-radius: 6px;
  background: ${(props: { color: string }) => props.color};
  position: absolute;
  bottom: -9px;
`
