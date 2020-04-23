import React, { useState } from 'react'

import { Fade, Grid } from '@material-ui/core'

import MainDepthChart from '../DepthChart/MainDepthChart/MainDepthChart'
import { MASTER_BUILD } from '@core/utils/config'
import { isSPOTMarketType } from '@core/utils/chartPageUtils'
import { SingleChart } from '@sb/components/Chart'

import Balances from '@core/components/Balances'
import TradingComponent from '@core/components/TradingComponent'
import TradingTable from '@sb/components/TradingTable/TradingTable'
import { TablesBlockWrapper } from '@sb/components/TradingWrapper/styles'
import { TradeHistory, OrderbookAndDepthChart, CardsPanel } from '../components'

const TerminalContainer = ({
  isDefaultTerminalViewMode,
  children,
}: {
  isDefaultTerminalViewMode: boolean
  children: React.ReactChild
}) => (
  <TablesBlockWrapper
    item
    container
    xs={isDefaultTerminalViewMode ? 5 : 12}
    isDefaultTerminalViewMode={isDefaultTerminalViewMode}
    style={{
      padding: '.4rem 0 0 .4rem',
    }}
  >
    {children}
  </TablesBlockWrapper>
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
    showChangePositionModeResult,
    changeActiveExchangeMutation,
    terminalViewMode,
    updateTerminalViewMode,
    arrayOfMarketIds,
    isPairDataLoading,
    quantityPrecision,
    pricePrecision,
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
      <ChartGridContainer MASTER_BUILD={MASTER_BUILD} item xs={12}>
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
            marketType,
          }}
        />
      </ChartGridContainer>

      <Grid
        item
        container
        xs={12}
        style={{
          height: '100%',
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
            MASTER_BUILD={MASTER_BUILD}
            isDefaultTerminalViewMode={isDefaultTerminalViewMode}
          >
            <CustomCard id="tradingViewChart">
              {activeChart === 'candle' ? (
                <SingleChart
                  name=""
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
            </CustomCard>
          </ChartsContainer>
          <TradingTerminalContainer
            MASTER_BUILD={MASTER_BUILD}
            isDefaultTerminalViewMode={isDefaultTerminalViewMode}
          >
            <Grid item container style={{ height: '100%' }}>
              {/* <Grid
                item
                container
                xs={MASTER_BUILD ? 12 : 7}
                style={{
                  height: '100%',
                  ...(!MASTER_BUILD
                    ? { flexBasis: '65%', maxWidth: '65%' }
                    : {}),
                }}
              >
                <OrderbookAndDepthChart
                  {...{
                    symbol: currencyPair,
                    pair: currencyPair,
                    exchange,
                    quote,
                    isPairDataLoading,
                    minPriceDigits,
                    arrayOfMarketIds,
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
              {!MASTER_BUILD && (
                <Grid
                  item
                  xs={5}
                  style={{
                    height: '100%',
                    padding: '0 0 .4rem .4rem',
                    flexBasis: '35%',
                    maxWidth: '35%',
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
              )} */}
            </Grid>
          </TradingTerminalContainer>
          {isDefaultTerminalViewMode && (
            <TradingTabelContainer
              item
              xs={marketType === 0 ? 7 : 6}
              isDefaultTerminalViewMode={isDefaultTerminalViewMode}
            >
              <TradingTable
                selectedKey={selectedKey}
                showOrderResult={showOrderResult}
                showCancelResult={showCancelResult}
                marketType={marketType}
                exchange={exchange}
                pricePrecision={pricePrecision}
                quantityPrecision={quantityPrecision}
                priceFromOrderbook={priceFromOrderbook}
                currencyPair={currencyPair}
                arrayOfMarketIds={arrayOfMarketIds}
              />
            </TradingTabelContainer>
          )}
          {isDefaultTerminalViewMode && marketType === 1 && (
            <BalancesContainer
              item
              xs={1}
              id="balances"
              isDefaultTerminalViewMode={isDefaultTerminalViewMode}
            >
              <Balances
                pair={currencyPair.split('_')}
                selectedKey={selectedKey}
                marketType={marketType}
                showFuturesTransfer={showFuturesTransfer}
              />
            </BalancesContainer>
          )}

          <TerminalContainer
            isDefaultTerminalViewMode={isDefaultTerminalViewMode}
          >
            <TradingComponent
              selectedKey={selectedKey}
              activeExchange={activeExchange}
              pair={baseQuoteArr}
              quantityPrecision={quantityPrecision}
              pricePrecision={pricePrecision}
              priceFromOrderbook={priceFromOrderbook}
              marketType={marketType}
              showOrderResult={showOrderResult}
              showCancelResult={showCancelResult}
              showChangePositionModeResult={showChangePositionModeResult}
              isDefaultTerminalViewMode={isDefaultTerminalViewMode}
              updateTerminalViewMode={updateTerminalViewMode}
            />
          </TerminalContainer>
        </Grid>
      </Grid>
    </Container>
  )
}
