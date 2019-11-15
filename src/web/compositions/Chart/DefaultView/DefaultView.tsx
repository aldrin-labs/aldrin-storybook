import React from 'react'

import { Fade, Grid } from '@material-ui/core'

import MainDepthChart from '../DepthChart/MainDepthChart/MainDepthChart'

import { SingleChart } from '@sb/components/Chart'

import TradingComponent from '@core/components/TradingComponent'
import TradingTable from '@sb/components/TradingTable/TradingTable'

// import ComingSoon from '@sb/components/ComingSoon'
import { TradeHistory, OrderBook, DepthChart, TradeHistoryAndOrderbook } from '../components'


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
    themeMode,
    activeExchange,
    activeChart,
    renderTogglerBody,
    aggregation,
    changeTable,
    showOrderResult,
    showCancelResult,
    showTableOnMobile,
    selectedKey,
    chartProps,
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
        {renderTogglerBody()}
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
          xs={6}
          style={{
            height: '100%',
            padding: '.4rem .4rem 0 0',
          }}
        >
          <ChartsContainer item xs={12}>
            {/* <CustomCard>
              {activeChart === 'candle' ? (
                <SingleChart
                  additionalUrl={`/?symbol=${base}/${quote}&user_id=${id}&theme=${themeMode}`}
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
            </CustomCard> */}
          </ChartsContainer>
          <TradingTabelContainer item xs={12}>
            {/*{MASTER_BUILD && <ComingSoon />}*/}
            <CustomCard style={{ overflow: 'hidden scroll' }}>
              <TradingTable showCancelResult={showCancelResult} />
            </CustomCard>
          </TradingTabelContainer>
        </Grid>
        <TradingTerminalContainer
          item
          container
          xs={6}
          direction="column"
          style={{
            height: '100%',
            padding: '.4rem 0 0 .4rem',
          }}
        >
          <Grid item container style={{ height: '60%' }}>
            <Grid
              item
              xs={4}
              style={{
                height: '100%',
                padding: '0 .4rem .4rem 0',
              }}
            >
              <DepthChart
                chartProps={chartProps}
                changeTable={changeTable}
                exchange={exchange}
                symbol={currencyPair}
              />
            </Grid>

            <TradeHistoryAndOrderbook
              {...{
                symbol: currencyPair,
                pair: currencyPair,
                exchange,
                quote,
                activeExchange,
                showTableOnMobile,
                aggregation,
                changeTable,
                chartProps,
              }}
            />

            {/* <Grid
              item
              xs={4}
              style={{ height: '100%', padding: '0 .4rem .4rem .4rem' }}
            >
              <OrderBook
                activeExchange={activeExchange}
                aggregation={aggregation}
                chartProps={chartProps}
                changeTable={changeTable}
                exchange={exchange}
                symbol={currencyPair}
                pair={currencyPair}
                quote={quote}
              />
            </Grid>
            <Grid
              item
              xs={4}
              style={{ height: '100%', padding: '0 0 .4rem .4rem' }}
            >
              <TradeHistory
                showTableOnMobile={showTableOnMobile}
                activeExchange={activeExchange}
                exchange={exchange}
                symbol={currencyPair}
                pair={currencyPair}
                quote={quote}
              />
            </Grid> */}
          </Grid>

          <TradingComponent
            selectedKey={selectedKey}
            activeExchange={activeExchange}
            pair={baseQuoteArr}
            showOrderResult={showOrderResult}
            showCancelResult={showCancelResult}
          />
          {/* <RangesContainer>ranges</RangesContainer> */}
        </TradingTerminalContainer>
      </Grid>
    </Container>
  )
}
