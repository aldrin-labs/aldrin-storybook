import React from 'react'
import styled from 'styled-components'
import { Card, Grid, CardContent, Typography } from '@material-ui/core'
import Stroke from '../../../icons/Stroke.svg'

export const ChartWrapper = styled(({ isEditModeEnabled, ...rest }) => (
  <Grid {...rest} />
))`
  display: flex;
  position: relative;
  flex-direction: column;

  justify-content: center;
  align-items: center;

  min-height: 3%;
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
  letter-spacing: 1.5px;
  margin: 6px auto;
  color: #abbad1;
  text-align: center;
  text-transform: uppercase;
`

export const GridProgressTitle = styled(Grid)`
  display: flex;
  width: 100%;
  border-radius: 20px 20px 0 0;
  background: #f2f4f6;
  margin-bottom: 8px;
`

export const TypographyProgress = styled(Typography)`
  margin-top: 10px;
  color: #16253d;
  font-size: 0.625rem;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  font-weight: 700;
  width: 100%;
  text-align: center;
  height: 24px;
`

export const GridTransactionBtn = styled(Grid)`
  display: flex;
  justify-content: center;
  align-items: center;
  background-image: url(${Stroke});
  background-repeat: no-repeat;
  background-position: center;
`
