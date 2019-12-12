import React from 'react'
import styled from 'styled-components'
import { Typography } from '@material-ui/core'

export const StyledTypography = styled(({ color, ...rest }) => (
  <Typography {...rest} />
))`
  text-transform: uppercase;
  font-size: 1.1rem;
  font-weight: bold;
  color: ${(props) => props.color};
`
