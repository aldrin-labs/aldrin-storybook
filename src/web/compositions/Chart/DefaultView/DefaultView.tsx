import React from 'react'

import { Fade, Grid } from '@material-ui/core'

import MainDepthChart from '../DepthChart/MainDepthChart/MainDepthChart'

import { SingleChart } from '@sb/components/Chart'

import TradingComponent from '@core/components/TradingComponent'
import TradingTable from '@sb/components/TradingTable/TradingTable'
// import ComingSoon from '@sb/components/ComingSoon'

import {
  Container,
  ChartsContainer,
  DepthChartContainer,
  // RangesContainer,
  TradingTabelContainer,
  TradingTerminalContainer,
  ChartGridContainer,
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
    renderTables,
    renderDepthAndList,
    // MASTER_BUILD,
    showOrderResult,
    showCancelResult,
    selectedKey,
  } = props

  if (!currencyPair) {
    return
  }
  const [base, quote] = currencyPair.split('_')
  const baseQuoteArr = [base, quote]

  return (
    <div>
      <Container container spacing={8}>
        <ChartGridContainer item xs={12} style={{ paddingBottom: '0px' }}>
          {renderTogglerBody()}
        </ChartGridContainer>

        <Grid
          item
          container
          xs={12}
          style={{ height: 'calc(100% - 3rem)', paddingRight: 0 }}
          spacing={8}
        >
          <Grid
            item
            container
            direction="column"
            xs={6}
            style={{
              height: 'calc(100% - 8px)',
            }}
          >
            <ChartsContainer item xs={12}>
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
            </ChartsContainer>
            <TradingTabelContainer style={{ overflowX: 'hidden' }} item xs={12}>
              {/*{MASTER_BUILD && <ComingSoon />}*/}
              <TradingTable showCancelResult={showCancelResult} />
            </TradingTabelContainer>
          </Grid>
          <TradingTerminalContainer
            item
            container
            xs={6}
            style={{ height: '100%', paddingRight: 0 }}
          >
            {/*{MASTER_BUILD && <ComingSoon />}*/}
            <Grid item container xs={6} style={{ height: '100%' }} spacing={8}>
              {renderDepthAndList()}
              {renderTables()}
            </Grid>
            <Grid
              item
              container
              direction="column"
              style={{
                height: '100%',
                padding: '4px  0 4px 8px',
                position: 'relative',
                bottom: '4px',
              }}
              xs={6}
            >
              <TradingComponent
                selectedKey={selectedKey}
                activeExchange={activeExchange}
                pair={baseQuoteArr}
                showOrderResult={showOrderResult}
                showCancelResult={showCancelResult}
              />
              {/* <RangesContainer>ranges</RangesContainer> */}
            </Grid>
          </TradingTerminalContainer>
        </Grid>
      </Container>
    </div>
  )
}
