import React from 'react'
import styled from 'styled-components'
import { Typography } from '@material-ui/core'

export const TypographyWithCustomColor = styled(
  // eslint-disable-next-line react/jsx-props-no-spreading
  ({ textColor, fontSize, ...otherProps }) => <Typography {...otherProps} />
)`
  font-size: ${(props: { fontSize?: string }) =>
    props.fontSize ? props.fontSize : ''};

  color: ${(props: { textColor?: string }) => props.textColor};
`
