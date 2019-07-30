import React from 'react'
import { Button } from '@material-ui/core'
import styled from 'styled-components'

export const SButton = styled(({isActivePage, type, white, black, ...rest}) => <Button {...rest} />)`
  margin: .4rem 1.6rem;
`

export const Marker = styled.span`
  width: 28px;
  height: 6px;
  border-radius: 6px;
  background: ${(props: { color: string }) => props.color};
  position: absolute;
  bottom: -9px;
`
