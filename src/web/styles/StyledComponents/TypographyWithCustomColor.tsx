import React from 'react'
import styled from 'styled-components'
import { Typography } from '@material-ui/core'

export const TypographyWithCustomColor = styled(
  ({ textColor, fontSize, ...otherProps }) => <Typography {...otherProps} />
)`
  font-size: ${(props: { fontSize?: string }) => props.fontSize ? props.fontSize : ''};
  
  color: ${(props: { textColor?: string }) => props.textColor};
`
