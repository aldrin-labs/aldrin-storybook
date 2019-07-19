import React from 'react'
import styled from 'styled-components'
import LinearProgress from '@material-ui/core/LinearProgress'
import {
  Grid,
  Typography,
  Card,
  CardContent,
  CardHeader,
  ExpansionPanelSummary,
} from '@material-ui/core'

export const LinearProgressCustom = styled(
  ({ width, height, color, ...rest }) => <LinearProgress {...rest} />
)`
  width: ${(props: { width: string }) => props.width || `100%`};
  background-color: ${(props: { color: string }) => props.color || '#E7ECF3'};
  border-radius: 10px;
  height: ${(props: { height: string }) => props.height};
`
export const GridFlex = styled(({ padding, ...rest }) => <Grid {...rest} />)`
  display: flex;
  padding: ${(props: { padding: string }) => props.padding};
`
export const IconCircle = styled.i`
  font-family: 11px;
  padding-right: 5px;
  color: red;
`

export const TypographyCustom = styled(Typography)`
  font-size: 12px;
  font-weight: 700;
  margin: auto 0;
  text-transform: uppercase;
`
