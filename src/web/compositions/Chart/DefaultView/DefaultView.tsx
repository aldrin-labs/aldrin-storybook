import React from 'react'

import { Fade, Grid } from '@material-ui/core'

import MainDepthChart from '../DepthChart/MainDepthChart/MainDepthChart'

import { SingleChart } from '@sb/components/Chart'

import Balances from '@core/components/Balances'
import TradingComponent from '@core/components/TradingComponent'
import TradingTable from '@sb/components/TradingTable/TradingTable'

// import ComingSoon from '@sb/components/ComingSoon'
import { TradeHistory, OrderbookAndDepthChart, CardsPanel } from '../components'

import {
  Container,
  ChartsContainer,
  DepthChartContainer,
  // RangesContainer,
  TradingTabelContainer,
  TradingTerminalContainer,
  ChartGridContainer,
  CustomCard,
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
  } = props

  if (!currencyPair) {
    return
  }

  const [base, quote] = currencyPair.split('_')
  const baseQuoteArr = [base, quote]
  const exchange = activeExchange.symbol

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
        spacing={8}
      >
        <Grid
          item
          container
          direction="column"
          xs={7}
          style={{
            height: '100%',
            padding: '.4rem .4rem 0 0',
          }}
        >
          <ChartsContainer item xs={12}>
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
          <Grid
            item
            xs={12}
            container
            style={{ flex: 'auto', height: 'calc(45% - 0.4rem)' }}
          >
            <TradingTabelContainer item xs={10}>
              {/*{MASTER_BUILD && <ComingSoon />}*/}
              <CustomCard style={{ overflow: 'hidden scroll' }}>
                <TradingTable
                  showCancelResult={showCancelResult}
                  marketType={marketType}
                />
              </CustomCard>
            </TradingTabelContainer>
            <Grid
              item
              xs={2}
              style={{ paddingLeft: '.4rem', marginTop: '.4rem' }}
            >
              <Balances
                pair={currencyPair.split('_')}
                selectedKey={selectedKey}
                marketType={marketType}
              />
            </Grid>
          </Grid>
        </Grid>
        <TradingTerminalContainer
          item
          container
          xs={5}
          direction="column"
          style={{
            height: '100%',
            padding: '.4rem 0 0 .4rem',
          }}
        >
          <Grid item container style={{ height: '50%' }}>
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

          <TradingComponent
            selectedKey={selectedKey}
            activeExchange={activeExchange}
            pair={baseQuoteArr}
            marketType={marketType}
            showOrderResult={showOrderResult}
            showCancelResult={showCancelResult}
          />
        </TradingTerminalContainer>
      </Grid>
    </Container>
  )
}
