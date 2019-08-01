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

export const GridFlex = styled(({ padding, ...rest }) => <Grid {...rest} />)`
  display: flex;
  padding: ${(props: { padding: string }) => props.padding};
`

export const TypographyCustom = styled(Typography)`
  font-weight: 700;
  margin: auto 0;
  text-transform: uppercase;
  font-size: 1.2rem;
  
  @media screen and (min-device-width: 1920px) and (-webkit-min-device-pixel-ratio: 1) {
    //font-size: 2.4rem;
  }
`
