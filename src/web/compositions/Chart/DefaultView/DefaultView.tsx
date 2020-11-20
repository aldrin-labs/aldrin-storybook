import React, { useState, useEffect } from 'react'

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
import ChartCardHeader, { TriggerTitle } from '@sb/components/ChartCardHeader'
import { HideArrow } from '../components/HideArrow/HideArrow'
import { isEqual } from 'lodash'
import { TerminalModeButton } from '@sb/components/TradingWrapper/styles'

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

  const [chartExchange, updateChartExchange] = useState('binance')
  const {
    connected,
    wallet,
    providerUrl,
    providerName,
    setProvider,
  } = useWallet()
  const publicKey = wallet?.publicKey?.toBase58()

  if (!currencyPair) {
    return null
  }

  const { hideDepthChart, hideOrderbook, hideTradeHistory } = layout

  const changeChartLayout = async (newParams) => {
    const argObject = {
      hideDepthChart,
      hideTradeHistory,
      hideOrderbook,
      ...newParams,
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
  const sizeDigits = quantityPrecision

  useEffect(() => {
    updateTerminalPriceFromOrderbook(null)
  }, [currencyPair])

  console.log('default view rerender', props)

  return (
    <Container container spacing={8} theme={theme}>
      {/* <ChartGridContainer item xs={12} theme={theme}>
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
            hideDepthChart,
            hideOrderbook,
            hideTradeHistory,
            changeChartLayout,
          }}
        />
      </ChartGridContainer> */}

      <Grid
        item
        container
        xs={12}
        style={{
          height: 'calc(100%)',
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
                <TriggerTitle
                  theme={theme}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: 0
                  }}
                >
                  <span
                    style={{
                      width: 'calc(100% - 20rem)',
                      whiteSpace: 'pre-line',
                      textAlign: 'left',
                      color: theme.palette.dark.main,
                      textTransform: 'capitalize',
                      fontSize: '1.3rem',
                      lineHeight: '1rem',
                      paddingLeft: '1rem'
                    }}
                  >
                    Chart
                  </span>
                  <TerminalModeButton
                    theme={theme}
                    active={chartExchange === 'binance'}
                    style={{ width: '10rem' }}
                    onClick={() => {
                      updateChartExchange('binance')
                    }}
                  >
                    Binance
                  </TerminalModeButton>
                  <TerminalModeButton
                    theme={theme}
                    active={chartExchange === 'serum'}
                    style={{ width: '10rem', borderRight: 0 }}
                    onClick={() => updateChartExchange('serum')}
                  >
                    Serum
                  </TerminalModeButton>
                </TriggerTitle>
                <SingleChart
                  name=""
                  themeMode={themeMode}
                  additionalUrl={`/?symbol=${base}/${quote}_${String(
                    marketType
                  )}_${chartExchange}&user_id=${publicKey}`}
                />
              </CustomCard>
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
                        pricePrecision,
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
                        pricePrecision,
                        quantityPrecision,
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
          {/* {!authenticated && <GuestMode />} */}

          {
            <TradingTabelContainer
              item
              theme={theme}
              xs={6}
              isDefaultTerminalViewMode={isDefaultTerminalViewMode}
            >
              <TradingTable
                isDefaultTerminalViewMode={isDefaultTerminalViewMode}
                maxLeverage={maxLeverage}
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
          }
          {isDefaultTerminalViewMode && (
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

          {
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
          }
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
    prev.minPriceDigits === next.minPriceDigits &&
    prev.pricePrecision === next.pricePrecision &&
    prev.quantityPrecision === next.quantityPrecision &&
    prev.minSpotNotional === next.minSpotNotional &&
    prev.minFuturesStep === next.minFuturesStep &&
    prev.initialLeverage === next.initialLeverage &&
    prev.theme.palette.type === next.theme.palette.type &&
    prev.layout.hideDepthChart === next.layout.hideDepthChart &&
    prev.layout.hideOrderbook === next.layout.hideOrderbook &&
    prev.layout.hideTradeHistory === next.layout.hideTradeHistory &&
    isEqual(prev.theme, next.theme)
    // false
  )
})
