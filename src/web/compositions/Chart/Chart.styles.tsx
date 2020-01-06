import React from 'react'
import styled, { createGlobalStyle } from 'styled-components'
import { CardTitle } from '@sb/components/ChartCardHeader'
import { Card, Grid, Button } from '@material-ui/core'
import { CSS_CONFIG } from '@sb/config/cssConfig'

export const MainContainer = styled.div`
  ${(props: { fullscreen: boolean }) =>
    props.fullscreen && 'height: 100vh; position: relative; z-index: 10;'};
`

export const GlobalStyles = createGlobalStyle`

@media only screen and (max-width: 1720px) {
  html {
    font-size: 9px;
  }
}

@media only screen and (max-width: 1400px) {
  html {
    font-size: 8px;
  }
}

@media only screen and (max-width: 1300px) {
  html {
    font-size: 7px;
  }
}

@media only screen and (max-width: 1200px) {
  html {
    font-size: 6px;
  }
}
@media only screen and (max-width: 1100px) {
  html {
    font-size: 5px;
  }
}

@media only screen and (min-width: 1921px) {
  html {
    font-size: 12px;
  }
}

@media only screen and (min-width: 2560px) {
  html {
    font-size: 15px;
  }
}  
`

export const PanelWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  width: 100%;
  height: 100%;
`

export const CustomCard = styled(Card)`
  width: 100%;
  height: 100%;
  background-color: #fff;
  border: 0.1rem solid #e0e5ec;
  border-radius: 0.75rem;
  box-shadow: 0px 0px 1.2rem rgba(8, 22, 58, 0.1);
`

export const PanelCard = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-width: 16.6%;
  padding: ${(props: { first?: boolean }) =>
    props.first ? '0.7rem 1rem .7rem .7rem' : '0.7rem 1rem .7rem 1.5rem'};
  margin: 0.6rem 0;
  min-height: auto;
  border-right: 0.1rem solid #e0e5ec;
  font-weight: bold;
  font-family: DM Sans;
  text-transform: uppercase;
  letter-spacing: 0.05rem;

  @media (min-width: 1400px) {
    padding-top: 0.4rem;
  }
`

export const PanelCardTitle = styled.span`
  display: block;
  font-size: 1rem;
  padding: 0.1rem;
  color: #7284a0;

  @media (min-width: 1400px) {
    font-size: 1rem;
  }
`

export const PanelCardValue = styled.span`
  white-space: pre-line;
  font-size: 1rem;
  color: ${(props) => props.color};

  @media (min-width: 1400px) {
    font-size: 1rem;
  }
`

export const PanelCardSubValue = styled.span`
  padding-left: 0.4rem;
  font-size: 1rem;
  color: ${(props) => props.color};
`

// depth chart container
export const DepthChartContainer = styled(CustomCard)``

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

export const ChartGridContainer = styled(Grid)`
  position: absolute;
  right: 1rem;
  display: flex;
  flex: auto;
  align-items: center;
  width: 41.6%;
  height: 5%;

  padding: 0 0 0.4rem 0.8rem !important;
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
`

export const TradingTerminalContainer = styled(
  ({ isDefaultTerminalViewMode, ...rest }) => <Grid {...rest} />
)`
  position: relative;
  display: flex;
  // 60% - 3%, the half of height cards, will fix in future
  height: ${(props) =>
    props.isDefaultTerminalViewMode
      ? 'calc(58% - .8rem)'
      : 'calc(39% - .8rem)'};
  top: calc(5% + 0.8rem);
  overflow: hidden;

  flex-direction: column;
  padding: 0 0 0 0.4rem;

  @media (max-width: 1080px) {
    flex-wrap: wrap;
  }
`

export const ChartsContainer = styled(
  ({ isDefaultTerminalViewMode, ...rest }) => <TablesContainer {...rest} />
)`
  // height: calc(68vh - 59px - ${CSS_CONFIG.navBarHeight}px);
  height: ${(props) => (props.isDefaultTerminalViewMode ? '60%' : '45%')};
  justify-content: flex-end;
  flex-direction: column;
  border-radius: 0;

  @media (max-width: 1080px) {
    flex-wrap: nowrap;
  }

  padding: 0 .4rem .4rem 0;
  background-color: #f9fbfd;
`

export const TradingTabelContainer = styled(
  ({ isDefaultTerminalViewMode, ...rest }) => <TablesContainer {...rest} />
)`
  // 32vh was
  background-color: #f9fbfd;
  padding: 0.4rem 0.4rem 0 0;
  height: ${(props) => props.isDefaultTerminalViewMode && '40%'};
  justify-content: flex-start;
  flex-direction: column;
  overflow: hidden;

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
  overflow: hidden;
  width: auto;
  min-height: 100%;
  background: #f9fbfd;
  font-weight: bold;

  text-transform: uppercase;
  display: flex;
  flex-grow: 100;
  align-items: center;
  justify-content: flex-end;
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
  height: calc(100vh - 6.4vh - 1rem);
  width: 100%;
  padding: 1rem;
  margin: 0;
  font-family: DM Sans;
  background-color: #f9fbfd;
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
  height: ${(props) => (props.isDefaultTerminalViewMode ? '40%' : '55%')};
  padding: ${({
    isDefaultTerminalViewMode,
  }: {
    isDefaultTerminalViewMode: boolean
  }) =>
    isDefaultTerminalViewMode ? '.4rem .4rem 0 .4rem' : '.4rem .4rem 0 0'};
`

export const SmartTerminalContainer = styled(Grid)`
  position: relative;
  height: 55%;
  padding: 0.4rem 0 0 0.4rem;
`
