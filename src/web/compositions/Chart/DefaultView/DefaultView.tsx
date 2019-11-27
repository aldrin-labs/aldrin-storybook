import React from 'react'

import { Fade, Grid } from '@material-ui/core'

import MainDepthChart from '../DepthChart/MainDepthChart/MainDepthChart'

import { SingleChart } from '@sb/components/Chart'

import Balances from '@core/components/Balances'
import TradingComponent from '@core/components/TradingComponent'
import TradingTable from '@sb/components/TradingTable/TradingTable'
import {
  TradeHistory,
  OrderbookAndDepthChart,
  CardsPanel,
  SmartOrderTerminal,
} from '../components'

import {
  Container,
  ChartsContainer,
  DepthChartContainer,
  TradingTabelContainer,
  TradingTerminalContainer,
  ChartGridContainer,
  CustomCard,
  BalancesContainer,
  SmartTerminalContainer,
} from '../Chart.styles'

// fix props type
export const DefaultView = (props: any) => {
  const {
    currencyPair,
    // theme,
    id,
    view,
    marketType,
    themeMode,
    activeExchange,
    activeChart,
    changeTable,
    showOrderResult,
    showCancelResult,
    showTableOnMobile,
    selectedKey,
    chartProps,
    changeActiveExchangeMutation,
    terminalViewMode,
    updateTerminalViewMode,
  } = props

  if (!currencyPair) {
    return
  }

  const [base, quote] = currencyPair.split('_')
  const baseQuoteArr = [base, quote]
  const exchange = activeExchange.symbol
  const isDefaultTerminalViewMode = terminalViewMode === 'default'

  return (
    <Container container spacing={8}>
      <ChartGridContainer item xs={12}>
        <CardsPanel
          {...{
            _id: id,
            pair: currencyPair,
            view,
            themeMode,
            activeExchange,
            changeActiveExchangeMutation,
          }}
        />
      </ChartGridContainer>

      <Grid
        item
        container
        xs={12}
        style={{
          height: '94%',
          padding: '0',
          marginLeft: 0,
          marginRight: 0,
        }}
        direction="column"
        spacing={8}
      >
        <Grid
          item
          container
          xs={12}
          style={{
            height: '100%',
            padding: '.4rem .4rem 0 0',
          }}
        >
          <ChartsContainer item xs={7}>
            <CustomCard>
              {activeChart === 'candle' ? (
                <SingleChart
                  additionalUrl={`/?symbol=${base}/${quote}&user_id=${id}&theme=${themeMode}&marketType=${marketType}`}
                />
              ) : (
                <Fade timeout={1000} in={activeChart === 'depth'}>
                  <DepthChartContainer data-e2e="mainDepthChart">
                    <MainDepthChart
                      {...{
                        base,
                        quote,
                        animated: false,
                      }}
                    />
                  </DepthChartContainer>
                </Fade>
              )}
            </CustomCard>
          </ChartsContainer>
          <TradingTerminalContainer item xs={5}>
            <Grid item container style={{ height: '100%' }}>
              <Grid item container xs={7} style={{ height: '100%' }}>
                <OrderbookAndDepthChart
                  {...{
                    symbol: currencyPair,
                    pair: currencyPair,
                    exchange,
                    quote,
                    activeExchange,
                    showTableOnMobile,
                    changeTable,
                    chartProps,
                    marketType,
                  }}
                />
              </Grid>
              <Grid
                item
                xs={5}
                style={{ height: '100%', padding: '0 0 .4rem .4rem' }}
              >
                <TradeHistory
                  {...{
                    symbol: currencyPair,
                    pair: currencyPair,
                    exchange,
                    quote,
                    marketType,
                    activeExchange,
                    showTableOnMobile,
                    changeTable,
                    chartProps,
                  }}
                />
              </Grid>
            </Grid>
          </TradingTerminalContainer>
          {isDefaultTerminalViewMode && (
            <TradingTabelContainer item xs={6}>
              <CustomCard style={{ overflow: 'hidden scroll' }}>
                <TradingTable
                  showCancelResult={showCancelResult}
                  marketType={marketType}
                />
              </CustomCard>
            </TradingTabelContainer>
          )}
          <BalancesContainer
            item
            xs={1}
            isDefaultTerminalViewMode={isDefaultTerminalViewMode}
          >
            <Balances
              pair={currencyPair.split('_')}
              selectedKey={selectedKey}
              marketType={marketType}
            />
          </BalancesContainer>
          {isDefaultTerminalViewMode ? (
            <TradingComponent
              selectedKey={selectedKey}
              activeExchange={activeExchange}
              pair={baseQuoteArr}
              marketType={marketType}
              showOrderResult={showOrderResult}
              showCancelResult={showCancelResult}
              updateTerminalViewMode={updateTerminalViewMode}
            />
          ) : (
            <SmartTerminalContainer xs={11} item container>
              <SmartOrderTerminal
                updateTerminalViewMode={updateTerminalViewMode}
              />
            </SmartTerminalContainer>
          )}
        </Grid>
      </Grid>
    </Container>
  )
}
