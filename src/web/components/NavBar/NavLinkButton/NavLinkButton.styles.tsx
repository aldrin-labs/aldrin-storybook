import React from 'react'
import { Button } from '@material-ui/core'
import { fade } from '@material-ui/core/styles/colorManipulator'
import styled from 'styled-components'

export const SButton = styled(({isActivePage, type, white, black, ...rest}) => <Button {...rest} />)`
  margin: 0.5rem 1rem;
  color: ${({
    isActivePage,
    type,
    white,
    black,
  }: {
    isActivePage: boolean
    type: string
    white: string
    black: string
  }) => (isActivePage ? '' : type ? fade(white, 0.5) : fade(black, 0.5))};
`

export const Marker = styled.span`
  width: 28px;
  height: 6px;
  border-radius: 6px;
  background: ${(props: { color: string }) => props.color};
  position: absolute;
  bottom: -9px;
`
