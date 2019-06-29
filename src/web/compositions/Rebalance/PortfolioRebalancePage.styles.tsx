import React from 'react'
import styled from 'styled-components'
import { Card, Grid, CardContent, Typography } from '@material-ui/core'


export const ChartWrapper = styled(({ isEditModeEnabled, ...rest }) => (
  <Grid {...rest} />
))`
  display: flex;
  position: relative;
  flex-direction: column;

  justify-content: center;
  align-items: center;

  height: 33%;
  && {
    padding-bottom: 0;
  }
`

export const ChartContainer = styled(Card)`
  && {
    height: 100%;
    width: 100%;
  }
`

//  minus card header height
export const Chart = styled(({background, ...rest}) => (
  <CardContent {...rest} />
))`
  background: ${(props: { background: string }) => props.background};
  width: 100%;
  height: calc(100% - 68px);
  && {
    padding: 0.5rem 0.5rem 0 0.5rem;
  }
`

export const Container = styled(({ isEditModeEnabled, ...rest }) => (
  <Grid {...rest} />
))`
  justify-content: ${(props: { isEditModeEnabled: boolean }) =>
  props.isEditModeEnabled ? 'space-between' : 'left'};

  max-height: 55%;
`
export const TypographyAccordionTitle = styled(Typography)`
  width: 100%;
  margin: 10px auto;
  color: #ABBAD1;
  text-align: center;
  text-transform: uppercase;
`
