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
export const Chart = styled(({ background, ...rest }) => (
  <CardContent {...rest} />
))`
  background: ${(props: { background: string }) => props.background};
  width: 100%;
  height: calc(100% - 68px);
  && {
    padding: 0 0.1rem 0 0.1rem;
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
  height: 14px;
  margin: 6px auto;
  color: #abbad1;
  text-align: center;
  text-transform: uppercase;
`

export const GridProgressTitle = styled(Grid)`
  display: flex;
  width: 100% ;
  border-radius: 74px 74px 0 0; 
  background: #F2F4F6;
  margin-bottom: 13px;
`

export const TypographyProgress = styled(Typography)`
  margin-top: 10px;
  color: #16253D;
  font-size: 10px;
  text-transform: uppercase;
  font-weight: bold;
  /* background: #e7ecf3; */
  width: 100%;
  text-align: center;
  height: 24px;
`

export const ChartWrapperCustom = styled(ChartWrapper)`
  border-radius: 32px;
  font-size: 10px;
  height: 140px;
  padding: 0px;
  border: 0px;
  box-shadow: 0px 0px 15px 0px rgba(30, 30, 30, 0.2);
  -webkit-box-shadow: 0px 0px 15px 0px rgba(30, 30, 30, 0.2);
  -moz-box-shadow: 0px 0px 15px 0px rgba(30, 30, 30, 0.2);
`
