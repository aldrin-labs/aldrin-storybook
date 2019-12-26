import React, { useState } from 'react'

import { Fade, Grid } from '@material-ui/core'

import MainDepthChart from '../DepthChart/MainDepthChart/MainDepthChart'
import { isSPOTMarketType } from '@core/utils/chartPageUtils'
import { SingleChart } from '@sb/components/Chart'

import Balances from '@core/components/Balances'
import TradingComponent from '@core/components/TradingComponent'
import TradingTable from '@sb/components/TradingTable/TradingTable'
import { TablesBlockWrapper } from '@sb/components/TradingWrapper/styles'
import { TradeHistory, OrderbookAndDepthChart, CardsPanel } from '../components'

const TerminalContainer = ({ isDefaultTerminalViewMode, children }) =>
  isDefaultTerminalViewMode ? (
    <TablesBlockWrapper
      item
      container
      xs={5}
      style={{
        padding: '.4rem 0 0 .4rem',
      }}
    >
      {children}
    </TablesBlockWrapper>
  ) : (
    <SmartTerminalContainer xs={11} item container>
      {children}
    </SmartTerminalContainer>
  )

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
    minPriceDigits,
    showOrderResult,
    showCancelResult,
    showFuturesTransfer,
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

  const [priceFromOrderbook, updateTerminalPriceFromOrderbook] = useState<
    null | number
  >(null)
  const [base, quote] = currencyPair.split('_')
  const baseQuoteArr = [base, quote]
  const exchange = activeExchange.symbol
  const isDefaultTerminalViewMode = terminalViewMode === 'default'
  const sizeDigits = marketType === 0 ? 8 : 3

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
            isDefaultTerminalViewMode,
            updateTerminalViewMode,
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
          <ChartsContainer
            item
            xs={7}
            isDefaultTerminalViewMode={isDefaultTerminalViewMode}
          >
            {/* <CustomCard>
              {activeChart === 'candle' ? (
                <SingleChart
                  additionalUrl={`/?symbol=${base}/${quote}_${String(
                    marketType
                  )}&user_id=${id}&theme=${themeMode}`}
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
          <TradingTerminalContainer
            item
            xs={5}
            isDefaultTerminalViewMode={isDefaultTerminalViewMode}
          >
            <Grid item container style={{ height: '100%' }}>
              <Grid item container xs={7} style={{ height: '100%' }}>
                <OrderbookAndDepthChart
                  {...{
                    symbol: currencyPair,
                    pair: currencyPair,
                    exchange,
                    quote,
                    minPriceDigits,
                    updateTerminalPriceFromOrderbook,
                    activeExchange,
                    selectedKey,
                    showTableOnMobile,
                    changeTable,
                    chartProps,
                    marketType,
                    sizeDigits,
                  }}
                />
              </Grid>
              <Grid
                item
                xs={5}
                style={{
                  height: '100%',
                  padding: '0 0 .4rem .4rem',
                }}
              >
                <TradeHistory
                  {...{
                    symbol: currencyPair,
                    pair: currencyPair,
                    exchange,
                    quote,
                    minPriceDigits,
                    updateTerminalPriceFromOrderbook,
                    marketType,
                    activeExchange,
                    showTableOnMobile,
                    changeTable,
                    chartProps,
                    sizeDigits,
                  }}
                />
              </Grid>
            </Grid>
          </TradingTerminalContainer>
          {isDefaultTerminalViewMode && (
            <TradingTabelContainer
              item
              xs={6}
              isDefaultTerminalViewMode={isDefaultTerminalViewMode}
            >
              <CustomCard style={{ overflow: 'scroll' }}>
                <TradingTable
                  selectedKey={selectedKey}
                  showCancelResult={showCancelResult}
                  marketType={marketType}
                  exchange={exchange}
                  currencyPair={currencyPair}
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
              showFuturesTransfer={showFuturesTransfer}
            />
          </BalancesContainer>

          <TerminalContainer
            isDefaultTerminalViewMode={isDefaultTerminalViewMode}
          >
            <TradingComponent
              selectedKey={selectedKey}
              activeExchange={activeExchange}
              pair={baseQuoteArr}
              priceFromOrderbook={priceFromOrderbook}
              marketType={marketType}
              showOrderResult={showOrderResult}
              showCancelResult={showCancelResult}
              isDefaultTerminalViewMode={isDefaultTerminalViewMode}
              updateTerminalViewMode={updateTerminalViewMode}
            />
          </TerminalContainer>
        </Grid>
      </Grid>
    </Container>
  )
}
