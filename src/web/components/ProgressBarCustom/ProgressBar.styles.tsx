import React from 'react'
import styled from 'styled-components'
import LinearProgress from '@material-ui/core/LinearProgress'
import { Grid, Typography, Card } from '@material-ui/core'



export const GridFlex = styled(({ padding, ...rest }) => <Grid {...rest} />)`
  display: flex;
  padding: ${(props) => props.padding};
`

export const TypographyCustom = styled(Typography)`
  font-size: 1.2rem;
  font-weight: 700;
  letter-spacing: 1.5px;
  margin: auto 0;
  text-transform: uppercase;

  @media screen and (min-device-width: 1920px) and (-webkit-min-device-pixel-ratio: 1) {
    //font-size: 2.4rem;
  }
`

export const ChartContainer = styled(({ ...props }) => <Card {...props} />)`
  && {
    height: 100%;
    width: 100%;
  }
`
