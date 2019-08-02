import React from 'react'
import styled, { createGlobalStyle } from 'styled-components'
import { Card, Grid } from '@material-ui/core'
import { CSS_CONFIG } from '@sb/config/cssConfig'

export const ChartMediaQueryForLg = createGlobalStyle`
  @media only screen and (min-width: 2560px) {
    html {
      font-size: 12px;
    }
  }
`

export const MainContainer = styled.div`
  ${(props: { fullscreen: boolean }) => props.fullscreen && 'height: 100vh; position: relative; z-index: 10;'};
`
export const DepthChartContainer = styled(Card)`
  height: 100%;
  width: 100%;
`

export const TablesBlockWrapper = styled(({background = '', ...rest}) => <Card {...rest} />)`
  min-width: 150px;
  width: 50%;
  position: relative;
  && {
    overflow: hidden;
    background-color: ${(props: { background?: string }) => props.background};
    box-shadow: none !important;
  }

  @media (max-width: 1080px) {
    width: 100%;
    height: calc(68vh - 57px - 70px);
    position: relative;
  }
`

export const ChartGridContainer = styled(Grid)`
  position: relative;
  display: flex;
  flex: auto;
  width: 66.6%;
  align-items: center;

  && {
    padding: 3px;
  }
`

export const TablesContainer = styled(Grid)`
  position: relative;
  display: flex;

  && {
    padding: 3px;
  }

  height: calc(68vh - 59px - ${CSS_CONFIG.navBarHeight}px);
  overflow: hidden;

  @media (max-width: 1080px) {
    flex-wrap: wrap;
  }
  flex: auto;
`

export const TradingTerminalContainer = styled(Grid)`
  position: relative;
  display: flex;

  && {
    padding: 3px;
  }

  height: 32vh;
  overflow: hidden;

  @media (max-width: 1080px) {
    flex-wrap: wrap;
  }
`

export const ChartsContainer = styled(TablesContainer)`
  height: calc(68vh - 59px - ${CSS_CONFIG.navBarHeight}px);
  justify-content: flex-end;
  flex-direction: column;
  width: 66.6%;


  @media (max-width: 1080px) {
    flex-wrap: nowrap;
  }
  flex: auto;
`

export const TradingTabelContainer = styled(TablesContainer)`
  height: 32vh;
  justify-content: flex-start;
  flex-direction: column;
  width: 66.6%;

  @media (max-width: 1080px) {
    flex-wrap: nowrap;
  }
  
  flex: auto;
`

export const TogglerContainer = styled(Grid)`
  align-items: center;
  height: 6.4rem;
  width: 100%;
`

export const Toggler = styled.div`
  && {
    margin-left: 1.12rem;
  }
`

export const Container = styled(Grid)`
  display: flex;
  flex-flow: column wrap;
  height: calc(100vh - 48px);
  width: 100%;
  margin: 0;
`
