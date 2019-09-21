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
    padding: 0 0.16rem 0 0.16rem;
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
  letter-spacing: 1.5px;
  margin: ${props => props.margin || '0 auto 1rem'};
  color: #abbad1;
  text-align: center;
  font-size: 1.2rem;
  text-transform: uppercase;

  @media screen and (min-device-width: 1920px) and (-webkit-min-device-pixel-ratio: 1) {
    //font-size: 2.4rem;
  }
`

export const GridProgressTitle = styled(Grid)`
  display: flex;
  width: 100%;
  border-radius: 20px 20px 0 0;
  background: ${(props) => props.bgColor || '#f2f4f6'};
  margin-bottom: 8px;
  border-bottom: 1.5px solid #E0E5EC;
`

export const TypographyProgress = styled(Typography)`
  margin-top: 10px;
  color: ${(props) => props.textColor || '#16253d'};
  font-size: 1.2rem;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  font-weight: 700;
  width: 100%;
  text-align: center;
  height: 24px;

  @media screen and (min-device-width: 1920px) and (-webkit-min-device-pixel-ratio: 1) {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 57px;
    //font-size: 2.4rem;
  }
`

export const GridTransactionTypography = styled(Typography)`
  font-family: 'DM Sans', sans-serif;
  font-size: .92rem;
  line-height: 114.5%;
  color: #7284a0;
  margin-bottom: .75rem;

  span {
    font-weight: 700;
    letter-spacing: 1px;
  }
`

export const GridTransactionBtn = styled(Grid)`
  display: flex;
  justify-content: center;
  align-items: center;

  & img {
    width: 3.5vw;
  }
`
