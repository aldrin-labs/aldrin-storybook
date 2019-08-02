import React from 'react'

import { Fade } from '@material-ui/core'

import MainDepthChart from '../DepthChart/MainDepthChart/MainDepthChart'

import { SingleChart } from '@sb/components/Chart'

import TradingComponent from '@core/components/TradingComponent'
import TradingTable from '@sb/components/TradingTable/TradingTable'
import ComingSoon from '@sb/components/ComingSoon'

import {
  Container,
  ChartsContainer,
  DepthChartContainer,
  TradingTabelContainer,
  TradingTerminalContainer,
  ChartGridContainer,
} from '../Chart.styles'


export const DefaultView = (props) => {
  const {
    currencyPair,
    theme,
    id,
    themeMode,
    activeExchange,
    activeChart,
    renderTogglerBody,
    renderTables,
    MASTER_BUILD,
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
    <Container direction="row" container spacing={16}>
      <ChartGridContainer item sm={10}>
        {renderTogglerBody()}
      </ChartGridContainer>

      <ChartsContainer item sm={10}>
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
      <TradingTabelContainer item sm={10}>
        {/*{MASTER_BUILD && <ComingSoon />}*/}
        <TradingTable
          showCancelResult={showCancelResult}
        />
      </TradingTabelContainer>

      {renderTables()}

      <TradingTerminalContainer item sm={4}>
        {/*{MASTER_BUILD && <ComingSoon />}*/}
        <TradingComponent
          selectedKey={selectedKey}
          activeExchange={activeExchange}
          pair={baseQuoteArr}
          showOrderResult={showOrderResult}
          showCancelResult={showCancelResult}
        />
      </TradingTerminalContainer>
    </Container>
  </div>
  )
}
