import React from 'react'
import styled from 'styled-components'
import { IconButton } from '@material-ui/core'

export const IconButtonWithHover = styled(({ hoverColor, ...rest }) => (
  <IconButton {...rest} />
))`
  will-change: color;

  &:hover {
    color: ${(props: { hoverColor: string }) => props.hoverColor};
  }

  && {
    padding: 0.4rem;
  }
`
