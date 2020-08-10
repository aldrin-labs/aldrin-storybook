import React, { useState } from 'react'

import { Fade, Grid, Theme } from '@material-ui/core'

import MainDepthChart from '../DepthChart/MainDepthChart/MainDepthChart'
import { SingleChart } from '@sb/components/Chart'

import Balances from '@core/components/Balances'
import TradingComponent from '@core/components/TradingComponent'
import TradingTable from '@sb/components/TradingTable/TradingTable'
import { TablesBlockWrapper } from '@sb/components/TradingWrapper/styles'
import { TradeHistory, OrderbookAndDepthChart } from '../components'
import CardsPanel from '../components/CardsPanel'
import { GuestMode } from '../components/GuestMode/GuestMode'
import ChartCardHeader from '@sb/components/ChartCardHeader'
import { HideArrow } from '../components/HideArrow/HideArrow'

const TerminalContainer = ({
  isDefaultTerminalViewMode,
  children,
  theme,
}: {
  isDefaultTerminalViewMode: boolean
  children: React.ReactChild
  theme: Theme
}) => (
  <TablesBlockWrapper
    item
    container
    theme={theme}
    xs={isDefaultTerminalViewMode ? 5 : 12}
    isDefaultTerminalViewMode={isDefaultTerminalViewMode}
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
  TopChartsContainer,
} from '../Chart.styles'

// fix props type
export const DefaultViewComponent = (
  props: any
): React.ReactComponentElement<any> | null => {
  const {
    currencyPair,
    id,
    view,
    marketType,
    theme,
    themeMode,
    activeExchange,
    changeTable,
    minPriceDigits,
    showOrderResult,
    showCancelResult,
    showFuturesTransfer,
    showTableOnMobile,
    selectedKey,
    chartProps,
    showChangePositionModeResult,
    terminalViewMode,
    updateTerminalViewMode,
    arrayOfMarketIds,
    isPairDataLoading,
    quantityPrecision,
    pricePrecision,
    minSpotNotional,
    minFuturesStep,
    chartPagePopup,
    closeChartPagePopup,
    authenticated,
    maxLeverage,
    layout,
    changeChartLayoutMutation,
  } = props

  if (!currencyPair) {
    return null
  }

  const { hideDepthChart, hideOrderbook, hideTradeHistory } = layout

  const hideLayoutHandler = async () => {
    const argObject =
      hideDepthChart && !hideOrderbook
        ? {
            hideDepthChart,
            hideOrderbook: true,
            hideTradeHistory,
          }
        : hideOrderbook && !hideTradeHistory
        ? {
            hideDepthChart,
            hideOrderbook,
            hideTradeHistory: true,
          }
        : {
            hideDepthChart: true,
            hideOrderbook,
            hideTradeHistory,
          }

    await changeChartLayoutMutation({
      variables: { input: { layout: argObject } },
    })
  }

  const showLayoutHandler = async () => {
    const argObject =
      hideDepthChart && !hideOrderbook && !hideTradeHistory
        ? {
            hideDepthChart: false,
            hideOrderbook,
            hideTradeHistory,
          }
        : hideOrderbook && !hideTradeHistory
        ? {
            hideDepthChart,
            hideOrderbook: false,
            hideTradeHistory,
          }
        : {
            hideDepthChart,
            hideOrderbook,
            hideTradeHistory: false,
          }
    await changeChartLayoutMutation({
      variables: { input: { layout: argObject } },
    })
  }

  const [priceFromOrderbook, updateTerminalPriceFromOrderbook] = useState<
    null | number
  >(null)
  const [base, quote] = currencyPair.split('_')
  const baseQuoteArr = [base, quote]
  const exchange = activeExchange.symbol
  const isDefaultTerminalViewMode = terminalViewMode === 'default'
  const sizeDigits = marketType === 0 ? 8 : 3
  console.log('default view rerender', props)

  return (
    <Container container spacing={8} theme={theme}>
      <ChartGridContainer item xs={12} theme={theme}>
        <CardsPanel
          {...{
            _id: id,
            pair: currencyPair,
            view,
            theme,
            themeMode,
            activeExchange,
            selectedKey,
            showChangePositionModeResult,
            isDefaultTerminalViewMode,
            updateTerminalViewMode,
            marketType,
            quantityPrecision,
            pricePrecision,
          }}
        />
      </ChartGridContainer>

      <Grid
        item
        container
        xs={12}
        style={{
          height: 'calc(96% - 2rem)',
          padding: '0',
          margin: 0,
        }}
        direction="column"
      >
        <Grid
          item
          container
          xs={12}
          style={{
            height: '100%',
          }}
        >
          <TopChartsContainer
            isDefaultTerminalViewMode={isDefaultTerminalViewMode}
            theme={theme}
          >
            <ChartsContainer
              isDefaultTerminalViewMode={isDefaultTerminalViewMode}
              hideDepthChart={hideDepthChart}
              hideOrderbook={hideOrderbook}
              theme={theme}
              hideTradeHistory={hideTradeHistory}
            >
              <CustomCard
                theme={theme}
                id="tradingViewChart"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  borderRight: 'none',
                }}
              >
                <ChartCardHeader
                  theme={theme}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <span
                    style={{
                      width: '40%',
                      whiteSpace: 'pre-line',
                      textAlign: 'left',
                    }}
                  >
                    Chart
                  </span>
                </ChartCardHeader>
                <SingleChart
                  name=""
                  additionalUrl={`/?symbol=${base}/${quote}_${String(
                    marketType
                  )}&user_id=${id}&theme=${themeMode}`}
                />
              </CustomCard>

              {/* {!hideTradeHistory && (
                <HideArrow key="hide" onClick={hideLayoutHandler} />
              )}
              {(hideDepthChart || hideTradeHistory || hideOrderbook) && (
                <HideArrow
                  key="show"
                  revertArrow={true}
                  onClick={showLayoutHandler}
                  right="-11px"
                />
              )} */}
            </ChartsContainer>
            <TradingTerminalContainer
              theme={theme}
              isDefaultTerminalViewMode={isDefaultTerminalViewMode}
              hideDepthChart={hideDepthChart}
              hideOrderbook={hideOrderbook}
              hideTradeHistory={hideTradeHistory}
            >
              <Grid item container style={{ height: '100%' }}>
                <Grid
                  item
                  container
                  xs={7}
                  style={{
                    height: '100%',
                    flexBasis: hideOrderbook
                      ? '0%'
                      : hideDepthChart
                      ? '50%'
                      : '65%',
                    maxWidth: hideOrderbook
                      ? '0%'
                      : hideDepthChart
                      ? '50%'
                      : '65%',
                  }}
                >
                  {!hideOrderbook && (
                    <OrderbookAndDepthChart
                      {...{
                        symbol: currencyPair,
                        pair: currencyPair,
                        exchange,
                        quote,
                        theme,
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
                        hideDepthChart,
                        hideOrderbook,
                      }}
                    />
                  )}
                </Grid>
                <Grid
                  item
                  xs={5}
                  style={{
                    height: '100%',
                    flexBasis: hideOrderbook
                      ? '100%'
                      : hideDepthChart
                      ? '50%'
                      : '35%',
                    maxWidth: hideOrderbook
                      ? '100%'
                      : hideDepthChart
                      ? '50%'
                      : '35%',
                  }}
                >
                  {!hideTradeHistory && (
                    <TradeHistory
                      {...{
                        symbol: currencyPair,
                        pair: currencyPair,
                        exchange,
                        quote,
                        theme,
                        minPriceDigits,
                        updateTerminalPriceFromOrderbook,
                        marketType,
                        isPairDataLoading,
                        activeExchange,
                        showTableOnMobile,
                        changeTable,
                        chartProps,
                        sizeDigits,
                      }}
                    />
                  )}
                </Grid>
              </Grid>
            </TradingTerminalContainer>
          </TopChartsContainer>
          {!authenticated && <GuestMode />}

          {authenticated && isDefaultTerminalViewMode && (
            <TradingTabelContainer
              item
              theme={theme}
              xs={marketType === 0 ? 7 : 6}
              isDefaultTerminalViewMode={isDefaultTerminalViewMode}
            >
              <TradingTable
                theme={theme}
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
          {authenticated && isDefaultTerminalViewMode && marketType === 1 && (
            <BalancesContainer
              item
              xs={1}
              theme={theme}
              id="balances"
              isDefaultTerminalViewMode={isDefaultTerminalViewMode}
            >
              <Balances
                pair={currencyPair.split('_')}
                selectedKey={selectedKey}
                marketType={marketType}
                theme={theme}
                showFuturesTransfer={showFuturesTransfer}
              />
            </BalancesContainer>
          )}

          {authenticated && (
            <TerminalContainer
              theme={theme}
              isDefaultTerminalViewMode={isDefaultTerminalViewMode}
            >
              <TradingComponent
                selectedKey={selectedKey}
                activeExchange={activeExchange}
                pair={baseQuoteArr}
                theme={theme}
                chartPagePopup={chartPagePopup}
                closeChartPagePopup={closeChartPagePopup}
                quantityPrecision={quantityPrecision}
                pricePrecision={pricePrecision}
                minSpotNotional={minSpotNotional}
                minFuturesStep={minFuturesStep}
                priceFromOrderbook={priceFromOrderbook}
                marketType={marketType}
                maxLeverage={maxLeverage}
                showOrderResult={showOrderResult}
                showCancelResult={showCancelResult}
                showChangePositionModeResult={showChangePositionModeResult}
                isDefaultTerminalViewMode={isDefaultTerminalViewMode}
                updateTerminalViewMode={updateTerminalViewMode}
              />
            </TerminalContainer>
          )}
        </Grid>
      </Grid>
    </Container>
  )
}

export const DefaultView = React.memo(DefaultViewComponent, (prev, next) => {
  return (
    prev.marketType === next.marketType &&
    prev.selectedKey.keyId === next.selectedKey.keyId &&
    prev.currencyPair === next.currencyPair &&
    prev.terminalViewMode === next.terminalViewMode &&
    prev.selectedKey.hedgeMode === next.selectedKey.hedgeMode &&
    prev.isPairDataLoading === next.isPairDataLoading &&
    prev.chartPagePopup === next.chartPagePopup &&
    prev.maxLeverage === next.maxLeverage &&
    prev.themeMode === next.themeMode &&
    prev.theme.palette.type === next.theme.palette.type &&
    prev.layout.hideDepthChart === next.layout.hideDepthChart &&
    prev.layout.hideOrderbook === next.layout.hideOrderbook &&
    prev.layout.hideTradeHistory === next.layout.hideTradeHistory
  )
})
