import React from 'react'
import styled, { createGlobalStyle } from 'styled-components'
import { CardTitle } from '@sb/components/ChartCardHeader'
import { Card, Grid, Button, Theme } from '@material-ui/core'
import { CSS_CONFIG } from '@sb/config/cssConfig'

export const MainContainer = styled.div`
  height: 100%;
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
    font-family: Avenir Next Demi;
    font-size: 1.3rem;
    line-height: 35px;
    color: #F8FAFF;
    padding: 0 .5rem;
    letter-spacing: 0.01rem;
    cursor: default;
    outline: none;
  }

  @media (max-width: 1450px) {
    .virtualized-row {
      font-size: 1.25rem;
    }
  }

  @media (max-width: 1350px) {
    .virtualized-row {
      font-size: 1.2rem;
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
  justify-content: space-between;
  width: 100%;
  height: 100%;
`

export const CustomCard = styled(Card)`
  width: 100%;
  height: 100%;
  background-color: inherit;
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
  flex-grow: 1;
  padding: 0.1rem;
  margin: 0;
  min-height: auto;
  border-right: ${(props: { marketType: number; theme: Theme }) =>
    props.theme.palette.border.new};
  font-weight: bold;
  text-transform: capitalize;
  font-family: Avenir Next;
  letter-spacing: 0.01rem;
`

export const PanelCardTitle = styled.span`
  display: block;
  padding: 0.1rem 1rem 0.3rem 1rem;
  font-size: 1.3rem;
  font-family: Avenir Next;
  color: ${(props) => props.theme.palette.grey.text};
  letter-spacing: 0.1rem;

  @media (min-width: 1400px) {
    font-size: 1.2rem;
  }
`

export const PanelCardValue = styled.span`
  white-space: pre-line;
  font-family: Avenir Next Demi;
  color: ${(props) => props.theme.palette.white.primary};
  font-size: 1.3rem;
  padding: 0.1rem 1rem;
  letter-spacing: 0.01rem;

  @media (min-width: 1400px) {
    font-size: 1.2rem;
  }
`

export const PanelCardSubValue = styled.span`
  padding: 0.1rem 1rem;
  padding-left: 0.4rem;
  color: ${(props) => props.theme.palette.dark.main};
  letter-spacing: 0.1rem;
  font-size: 1.3rem;

  @media (min-width: 1400px) {
    font-size: 1.2rem;
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
  border-top: 0;

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
  border-top: 0;

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
  display: flex;
  flex: auto;
  align-items: center;
  width: calc(100%);
  height: 6rem;
  position: relative;
  padding: 0rem 3rem;
  border-bottom: ${(props) => props.theme.palette.border.new};
  margin: 0rem;
  background: ${(props) => props.theme.palette.grey.additional};

  @media (max-width: 600px) {
    display: none;
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
    terminalViewMode,
    ...rest
  }) => <div {...rest} />
)`
  height: 100%;
  transition: all 0.5s ease;
  position: relative;
  // 60% - 3%, the half of height cards, will fix in future
  width: ${(props) =>
    props.hideTradeHistory
      ? '17%'
      : props.hideOrderbook
      ? '17%'
      : props.hideDepthChart
      ? '35%'
      : '32%'};
  overflow: hidden;

  flex-direction: column;

  @media (max-width: 1080px) {
    flex-wrap: wrap;
  }
  @media (max-width: 600px) {
    width: 100%;
    display: ${(props) =>
      props.terminalViewMode === 'fullScreenTablesMobile' ? 'none' : 'block'};
    height: ${(props) =>
      props.terminalViewMode === 'mobileChart' ? '35%' : '100%'};
  }
`

export const TopChartsContainer = styled(
  ({
    isDefaultTerminalViewMode,
    MASTER_BUILD,
    hideDepthChart,
    hideOrderbook,
    hideTradeHistory,
    terminalViewMode,
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

  @media screen and (max-width: 600px) {
    flex-basis: ${(props) =>
      props.terminalViewMode === 'mobileChart' ? '100%' : '50%'};
    height: ${(props) =>
      props.terminalViewMode === 'mobileChart' ? '100%' : '62%'};
    display: ${(props) =>
      props.terminalViewMode === 'fullScreenTablesMobile' ? 'none' : 'block'};
  }
`

export const ChartsContainer = styled(
  ({
    isDefaultTerminalViewMode,
    MASTER_BUILD,
    hideDepthChart,
    hideOrderbook,
    hideTradeHistory,
    terminalViewMode,
    ...rest
  }) => <div {...rest} />
)`
  height: 100%;
  transition: all 0.5s ease;
  position: relative;
  display: flex;
  width: ${(props) =>
    props.hideTradeHistory
      ? '83%'
      : props.hideOrderbook
      ? '83%'
      : props.hideDepthChart
      ? '65%'
      : '68%'};
  justify-content: flex-end;
  flex-direction: column;
  border-radius: 0;
  @media (max-width: 1080px) {
    flex-wrap: nowrap;
  }

  @media (max-width: 600px) {
    display: ${(props) =>
      props.terminalViewMode === 'mobileChart' ? 'flex' : 'none'};
    width: 100%;
    height: ${(props) => props.terminalViewMode === 'mobileChart' && '65%'};
  }

  background-color: ${(props) => props.theme.palette.white.background};
`

export const TradingTabelContainer = styled(
  ({ isDefaultTerminalViewMode, ...rest }) => <TablesContainer {...rest} />
)`
  background-color: ${(props) => props.theme.palette.white.background};
  position: relative;
  height: ${(props) => (props.isDefaultTerminalViewMode ? '40%' : '0%')};
  justify-content: flex-start;
  flex-direction: column;
  overflow: hidden;

  @media (max-width: 1080px) {
    flex-wrap: nowrap;
  }
  @media (max-width: 600px) {
    display: none;
  }
  flex: auto;
`

export const MobileTradingTabelContainer = styled(
  ({
    isDefaultTerminalViewMode,
    isTablesExpanded,
    terminalViewMode,
    ...rest
  }) => <TablesContainer {...rest} />
)`
  background-color: ${(props) => props.theme.palette.white.background};
  position: relative;
  height: ${(props) =>
    props.isDefaultTerminalViewMode
      ? '38%'
      : props.isTablesExpanded
      ? '100%'
      : '0%'};
  justify-content: flex-start;
  flex-direction: column;
  overflow: hidden;
  max-width: 100%;
  display: ${(props) =>
    props.terminalViewMode === 'mobileChart' ? 'none' : 'auto'};
  flex: auto;
  @media (min-width: 600px) {
    display: none;
  }
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
  width: 100%;
  margin: 0;
  padding: 0;
  font-family: Avenir Next Medium;
  background-color: ${(props) => props.theme.palette.dark.background};

  height: calc(100vh - 12rem);

  @media (max-width: 600px) {
    height: calc(100vh - 36rem);
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
  @media (max-width: 600px) {
    display: none;
  }
`

export const SmartTerminalContainer = styled(Grid)`
  position: relative;
  height: 48%;
  padding: 0.4rem 0 0 0.4rem;
`
export const MarketStatsContainer = styled.div`
  display: flex;
  @media (max-width: 600px) {
    display: none;
  }
`

export const MobileMarketStatsContainer = styled.div`
  dispay: flex;
  flex-direction: row;
  justify-content: space-between;
  @media (min-width: 600px) {
    display: none;
  }
`
export const ChartAndOrderbookContainer = styled(Grid)`
  height: 100%;
  @media (max-width: 600px) {
    dispay: ${(props) =>
      props.terminalViewMode === 'mobileChart' ? 'flex' : 'auto'};
    flex-direction: ${(props) =>
      props.terminalViewMode === 'mobileChart' ? 'column' : 'auto'};
  }
`
