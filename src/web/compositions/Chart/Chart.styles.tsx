import React from 'react'
import styled, { createGlobalStyle } from 'styled-components'
import { CardTitle } from '@sb/components/ChartCardHeader'
import { Card, Grid, Button, Theme } from '@material-ui/core'
import { CSS_CONFIG } from '@sb/config/cssConfig'

export const MainContainer = styled.div`
  ${(props: { fullscreen: boolean }) =>
    props.fullscreen && 'height: 100vh; position: relative; z-index: 10;'};
`

export const GlobalStyles = createGlobalStyle`

html {
    font-size: 10px;
  }

@media only screen and (max-width: 1720px) {
  html {
    font-size: 9px !important;
  }
}

@media only screen and (max-width: 1440px) {
  html {
    font-size: 8px !important;
  }
}

@media only screen and (max-width: 1300px) {
  html {
    font-size: 7px !important;
  }
}

@media only screen and (max-width: 1100px) {
  html {
    font-size: 6px !important;
  }
}

/* @media only screen and (max-width: 1100px) {
  html {
    font-size: 5px;
  }
} */

@media only screen and (min-width: 1921px) {
  html {
    font-size: 12px !important;
  }
}

@media only screen and (min-width: 2560px) {
  html {
    font-size: 15px !important;
  }
}  
        
  .virtualized-row {
    font-family: 'IBM Plex Sans Condensed', sans-serif;
    font-size: 1.1rem;
    line-height: 35px;
    font-weight: bold;
    color: #16253D;
    padding: 0 .5rem;
    letter-spacing: 0.075rem;
    cursor: default;
    outline: none;
  }

  @media (max-width: 1450px) {
    .virtualized-row {
          font-size: 1rem;
    }
  }

  @media (max-width: 1350px) {
    .virtualized-row {
          font-size: 0.9rem;
    }
  }

  .amountForBackground {
    position: absolute;
    width: 100%;
    height: 80%;
    border-radius: .1rem;
    top: 10%;
    left: 0;
    z-index: -1;
    will-change: transform;
    transition: transform .5s ease-out;
  }

  .needHover {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    z-index: 2;
  }

  .needHover:hover {
    background-color: rgba(150, 150, 150, 0.15)
  }
`

export const PanelWrapper = styled.div`
  display: flex;
  justify-content: flex-start;
  width: 100%;
  height: 100%;
`

export const CustomCard = styled(Card)`
  width: 100%;
  height: 100%;
  background-color: ${(props) =>
    (props.theme &&
      props.theme.palette &&
      props.theme.palette.white &&
      props.theme.palette.white.background) ||
    '#fff'};
  border: ${(props) =>
    (props.theme &&
      props.theme.palette &&
      props.theme.palette.border &&
      props.theme.palette.border.main) ||
    '.1rem solid #e0e5ec'};
  border-radius: 0;
  box-shadow: none;
`

export const PanelCard = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: ${(props: { marketType: number; theme: Theme }) =>
    props.marketType === 0 ? '20%' : 'calc(100% / 7)'};
  flex-grow: 1;
  padding: 0.1rem;
  margin: 0;
  min-height: auto;
  border-right: ${(props: { marketType: number; theme: Theme }) =>
    props.theme.palette.border.main};
  font-weight: bold;
  font-family: DM Sans;
  text-transform: uppercase;
  letter-spacing: 0.1rem;
`

export const PanelCardTitle = styled.span`
  display: block;
  padding: 0.1rem 1rem;
  color: ${(props) => props.theme.palette.grey.text};
  letter-spacing: 0.1rem;

  @media (min-width: 1400px) {
    font-size: 1rem;
  }
`

export const PanelCardValue = styled.span`
  white-space: pre-line;
  color: ${(props) => props.theme.palette.dark.main};
  padding: 0.1rem 1rem;
  letter-spacing: 0.1rem;

  @media (min-width: 1400px) {
    font-size: 1rem;
  }
`

export const PanelCardSubValue = styled.span`
  padding: 0.1rem 1rem;
  padding-left: 0.4rem;
  color: ${(props) => props.theme.palette.dark.main};
  letter-spacing: 0.1rem;

  @media (min-width: 1400px) {
    font-size: 1rem;
  }
`

// depth chart container
export const DepthChartContainer = styled(CustomCard)`
  border-right: 0;
`

export const RangesContainer = styled(Card)`
  width: 100%;
  margin-top: 4px;
  height: calc(20% - 4px);
  border-radius: 0;
`

export const TablesBlockWrapper = styled(({ background = '', ...rest }) => (
  <CustomCard {...rest} />
))`
  min-width: 150px;
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
  <CustomCard {...rest} />
))`
  border-right: 0;

  && {
    overflow: hidden;
  }

  @media (max-width: 1080px) {
    width: 100%;
    // height: calc(68vh - 57px - 70px);
    height: 100%;
    position: relative;
  }
`

export const TradeHistoryWrapper = styled(({ background = '', ...rest }) => (
  <CustomCard {...rest} />
))`
  && {
    overflow: hidden;
  }

  @media (max-width: 1080px) {
    width: 100%;
    height: 100%;
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

export const ChartGridContainer = styled(({ MASTER_BUILD, ...rest }) => (
  <Grid {...rest} />
))`
  position: relative;
  display: flex;
  flex: auto;
  align-items: center;
  width: calc(100% - 2rem);
  height: 4%;
  padding: 0;
  margin: 1rem;

  && {
    padding: 0;
  }
  @media screen and (max-width: 1440px) {
    height: 4%;
  }

  @media screen and (max-width: 1140px) {
    height: 2.5%;
  }
`

export const TablesContainer = styled(Grid)`
  position: relative;
  display: flex;
  padding: 0;

  // height: calc(60vh - 59px - ${CSS_CONFIG.navBarHeight}px);
  height: 100%;
  overflow: hidden;

  @media (max-width: 1080px) {
    flex-wrap: wrap;
  }
`

export const TradingTerminalContainer = styled(
  ({
    isDefaultTerminalViewMode,
    MASTER_BUILD,
    hideDepthChart,
    hideOrderbook,
    hideTradeHistory,
    ...rest
  }) => <div {...rest} />
)`
  height: 100%;
  transition: all 0.5s ease;
  position: relative;
  display: ${(props) => (props.hideTradeHistory ? 'none' : 'flex')};
  // 60% - 3%, the half of height cards, will fix in future
  width: ${(props) =>
    props.MASTER_BUILD
      ? '30%'
      : props.hideTradeHistory
      ? '0%'
      : props.hideOrderbook
      ? '17%'
      : props.hideDepthChart
      ? '35%'
      : '41.66667%'};
  overflow: hidden;

  flex-direction: column;

  @media (max-width: 1080px) {
    flex-wrap: wrap;
  }
`

export const TopChartsContainer = styled(
  ({
    isDefaultTerminalViewMode,
    MASTER_BUILD,
    hideDepthChart,
    hideOrderbook,
    hideTradeHistory,
    ...rest
  }) => <div {...rest} />
)`
  transition: all 0.5s ease;
  position: relative;
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  flex-grow: 0;
  max-width: 100%;
  flex-basis: 100%;
  height: ${(props) =>
    props.isDefaultTerminalViewMode ? 'calc(60%)' : 'calc(50%)'};
  @media screen and (max-width: 1440px) {
    height: ${(props) =>
      props.isDefaultTerminalViewMode ? 'calc(60%)' : 'calc(50%)'};
  }

  @media screen and (max-width: 1140px) {
    height: ${(props) =>
      props.isDefaultTerminalViewMode ? 'calc(61%)' : 'calc(51%)'};
  }
`

export const ChartsContainer = styled(
  ({
    isDefaultTerminalViewMode,
    MASTER_BUILD,
    hideDepthChart,
    hideOrderbook,
    hideTradeHistory,
    ...rest
  }) => <div {...rest} />
)`
  height: 100%;
  transition: all 0.5s ease;
  position: relative;
  display: flex;
  width: ${(props) =>
    props.MASTER_BUILD
      ? '70%'
      : props.hideTradeHistory
      ? '100%'
      : props.hideOrderbook
      ? '83%'
      : props.hideDepthChart
      ? '65%'
      : '58.33333%'};
  justify-content: flex-end;
  flex-direction: column;
  border-radius: 0;
  @media (max-width: 1080px) {
    flex-wrap: nowrap;
  }

  background-color: ${(props) => props.theme.palette.white.background};
`

export const TradingTabelContainer = styled(
  ({ isDefaultTerminalViewMode, ...rest }) => <TablesContainer {...rest} />
)`
  // 32vh was
  background-color: ${(props) => props.theme.palette.white.background};
  position: relative;
  height: ${(props) => props.isDefaultTerminalViewMode && '40%'};
  justify-content: flex-start;
  flex-direction: column;
  overflow: hidden;

  @media (max-width: 1080px) {
    flex-wrap: nowrap;
  }

  flex: auto;
`

export const StyledSwitch = styled(({ isActive, ...rest }) => (
  <Button {...rest} />
))`
  background: ${(props) => (props.isActive ? '#4152AF' : '#F9FBFD')};
  color: ${(props) => (props.isActive ? '#fff' : '#4152AF')};
  border: 1px solid #4152af;
  padding: 0rem 1.5rem;
  white-space: nowrap;

  &:hover {
    background-color: ${(props) => (props.isActive ? '#4152AF' : '#F2F4F6')};
    color: ${(props) => (props.isActive ? '#fff' : '#4152AF')};
  }
`

export const Container = styled(Grid)`
  display: flex;
  // - ( menu + margin )
  height: calc(100vh - 5.4vh);
  width: 100%;
  margin: 0;
  padding: 0;
  font-family: DM Sans;
  background-color: ${(props) => props.theme.palette.white.background};

  @media (max-width: 1400px) {
    height: calc(100vh - 5.4vh);
  }
`

export const WatchItemWrapper = styled.div`
  display: flex;
  flex-direction: column;
  border-bottom: 1px solid #e0e5ec;
`

export const ScrollContainer = styled.div`
  height: 100%;
  overflow: auto;
`

export const SubvaluesContainer = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0 1rem 0.4rem 1rem;
`

export const WatchLabel = styled(CardTitle)`
  letter-spacing: 1px;
  font-size: 1.2rem;
  white-space: nowrap;
  text-align: left;
  line-height: 1.5rem;
  padding: 0.4rem 1rem;

  @media (min-width: 2560px) {
    line-height: 1.5rem;
  }
`

export const WatchSubvalue = styled.span`
  color: ${(props) => props.color};
`

export const BalancesContainer = styled(
  ({ isDefaultTerminalViewMode, ...rest }) => <Grid {...rest} />
)`
  position: relative;
  padding: 0;
  height: ${(props) => (props.isDefaultTerminalViewMode ? '40%' : '50%')};
`

export const SmartTerminalContainer = styled(Grid)`
  position: relative;
  height: 48%;
  padding: 0.4rem 0 0 0.4rem;
`
