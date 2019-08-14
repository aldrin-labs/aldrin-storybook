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
  ${(props: { fullscreen: boolean }) =>
    props.fullscreen && 'height: 100vh; position: relative; z-index: 10;'};
`

export const PanelCard = styled.div`
  min-width: 120px;
  padding: ${(props) =>
    props.first ? '0.7rem 0 0 0.5rem' : '0.7rem 0 0 1.5rem'};
  min-height: 38px;
  background: #f9fbfd;
  border-right: 2px solid #e0e5ec;
  font-weight: bold;
  font-family: DM Sans;
  text-transform: uppercase;
`

export const PanelCardTitle = styled.span`
  display: block;
  font-size: 1.2rem;
  padding: 0.1rem;
  color: #7284a0;
`

export const PanelCardValue = styled.span`
  white-space: pre-line;
  font-size: 1.3rem;
  color: ${(props) => props.color};
`

export const PanelCardSubValue = styled.span`
  padding-left: 0.4rem;
  font-size: 1.1rem;
  color: ${(props) => props.color};
`

// depth chart container
export const DepthChartContainer = styled(Card)`
  width: 100%;
  margin-bottom: 4px;
  height: calc(60% - 4px);
  border-radius: 0;
`

export const RangesContainer = styled(Card)`
  width: 100%;
  margin-top: 4px;
  height: calc(20% - 4px);
  border-radius: 0;
`

export const TablesBlockWrapper = styled(({ background = '', ...rest }) => (
  <Card {...rest} />
))`
  min-width: 150px;
  width: 100%;
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
// order book container

export const OrderbookContainer = styled(({ background = '', ...rest }) => (
  <Card {...rest} />
))`
  width: 100%;
  margin-bottom: 4px;
  height: calc(65% - 4px);
  border-radius: 0;

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

export const TradeHistoryWrapper = styled(({ background = '', ...rest }) => (
  <Card {...rest} />
))`
  width: 100%;
  margin-top: 4px;
  height: calc(35% - 4px);
  border-radius: 0;

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

// watch list container

export const WatchListContainer = styled(Card)`
  width: 100%;
  margin-top: 4px;
  height: calc(40% - 4px);
  border-radius: 0px;
`

export const ChartGridContainer = styled(Grid)`
  position: relative;
  display: flex;
  flex: auto;
  align-items: center;
  width: 100%;
`

export const TablesContainer = styled(Grid)`
  position: relative;
  display: flex;

  // height: calc(60vh - 59px - ${CSS_CONFIG.navBarHeight}px);
  height: 100%;
  overflow: hidden;

  @media (max-width: 1080px) {
    flex-wrap: wrap;
  }
  flex: auto;
`

export const TradingTerminalContainer = styled(Grid)`
  position: relative;
  display: flex;

  height: 100%;
  overflow: hidden;

  @media (max-width: 1080px) {
    flex-wrap: wrap;
  }
`

export const ChartsContainer = styled(TablesContainer)`
  // height: calc(68vh - 59px - ${CSS_CONFIG.navBarHeight}px);
  margin-bottom: 4px;
  height: calc(50% - 4px);
  justify-content: flex-end;
  flex-direction: column;
  border-radius: 0;

  @media (max-width: 1080px) {
    flex-wrap: nowrap;
  }
  flex: auto;
`

export const TradingTabelContainer = styled(TablesContainer)`
  height: calc(50% - 4px); // 32vh was
  margin-top: 4px;
  width: 100%;
  justify-content: flex-start;
  flex-direction: column;
  overflow: scroll;

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
  height: calc(100vh - 48px);
  width: 100%;
  margin: 0;
  background-color: #e0e5ec;
`
