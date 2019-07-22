import React from 'react'
import styled from 'styled-components'
import LinearProgress from '@material-ui/core/LinearProgress'
import { Grid, Typography, Card } from '@material-ui/core'

export const LinearProgressCustom = styled(
  ({ width, color, height, ...rest }) => <LinearProgress {...rest} />
)`
  width: ${(props) => props.width || `100%`};
  background-color: ${(props) => props.color || '#E7ECF3'};
  border-radius: 10px;
  height: ${(props) => props.height};
  padding: 0;
`
export const GridFlex = styled(({ padding, ...rest }) => <Grid {...rest} />)`
  display: flex;
  padding: ${(props) => props.padding};
`

export const TypographyCustom = styled(Typography)`
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 1.5px;
  margin: auto 0;
  text-transform: uppercase;
`

export const IconCircle = styled.i`
  font-family: 11px;
  padding-right: 5px;
  color: red;
`

export const ChartContainer = styled(({ ...props }) => <Card {...props} />)`
  && {
    height: 100%;
    width: 100%;
  }
`
