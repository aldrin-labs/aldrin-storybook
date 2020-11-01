import React, { useState, useEffect } from 'react'

import { Fade, Grid, Theme } from '@material-ui/core'

import MainDepthChart from '../DepthChart/MainDepthChart/MainDepthChart'
import { SingleChart } from '@sb/components/Chart'

import {
  tourConfig,
  FinishBtn,
} from '@sb/components/ReactourOnboarding/ReactourOnboarding'

import Tour from 'reactour'

import Balances from '@core/components/Balances'
import TradingComponent from '@core/components/TradingComponent'
import TradingTable from '@sb/components/TradingTable/TradingTable'
import { TablesBlockWrapper } from '@sb/components/TradingWrapper/styles'
import { TradeHistory, OrderbookAndDepthChart } from '../components'
import CardsPanel from '../components/CardsPanel'
import { GuestMode } from '../components/GuestMode/GuestMode'
import ChartCardHeader from '@sb/components/ChartCardHeader'
import { HideArrow } from '../components/HideArrow/HideArrow'
import { isEqual } from 'lodash'

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
    isChartPageOnboardingDone,
    closeChartPageOnboarding,
  } = props

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

  const [isTourOpen, setIsTourOpen] = useState(true)

  const [base, quote] = currencyPair.split('_')
  const baseQuoteArr = [base, quote]
  const exchange = activeExchange.symbol
  const isDefaultTerminalViewMode = terminalViewMode !== 'smartOrderMode'
  const isDefaultOnlyTables = terminalViewMode === 'onlyTables'
  const isSmartOrderMode = terminalViewMode === 'smartOrderMode'

  const sizeDigits = marketType === 0 ? 8 : 3

  useEffect(() => {
    updateTerminalPriceFromOrderbook(null)
  }, [currencyPair])

  console.log('default view rerender', props)

  const accentColor = '#1BA492'

  return (
    <Container container spacing={8} theme={theme}>
      <Tour
        showCloseButton={false}
        nextButton={<FinishBtn>Next</FinishBtn>}
        prevButton={<a />}
        showNavigationNumber={true}
        showNavigation={true}
        lastStepNextButton={<FinishBtn>Finish</FinishBtn>}
        steps={tourConfig}
        accentColor={accentColor}
        isOpen={isTourOpen}
        onRequestClose={() => {
          setIsTourOpen(false)
          closeChartPageOnboarding()
        }}
        // onRequestClose={() => {
        //   setIsTourOpen(false)
        //   localStorage.setItem('isOnboardingDone', 'true')
        // }}
      />
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
            isDefaultOnlyTables,
            isSmartOrderMode,
            updateTerminalViewMode,
            marketType,
            terminalViewMode,
            quantityPrecision,
            pricePrecision,
            hideDepthChart,
            hideOrderbook,
            hideTradeHistory,
            changeChartLayout,
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
                  themeMode={themeMode}
                  additionalUrl={`/?symbol=${base}/${quote}_${String(
                    marketType
                  )}&user_id=${id}`}
                />
              </CustomCard>
            </ChartsContainer>
            <TradingTerminalContainer
              theme={theme}
              isDefaultTerminalViewMode={isDefaultTerminalViewMode}
              hideDepthChart={hideDepthChart}
              hideOrderbook={hideOrderbook}
              hideTradeHistory={hideTradeHistory}
              isDefaultOnlyTables={isDefaultOnlyTables}
              isSmartOrderMode={isSmartOrderMode}
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

          {authenticated && (
            <TradingTabelContainer
              item
              theme={theme}
              isSmaerOrderMode={isSmartOrderMode}
              xs={
                isDefaultOnlyTables
                  ? marketType === 0
                    ? 12
                    : 11
                  : marketType === 0
                  ? 7
                  : 6
              }
              isDefaultTerminalViewMode={isDefaultTerminalViewMode}
              updateTerminalViewMode={updateTerminalViewMode}
              isDefaultOnlyTables={isDefaultOnlyTables}
            >
              <TradingTable
                isDefaultOnlyTables={isDefaultOnlyTables}
                isSmartOrderMode={isSmartOrderMode}
                updateTerminalViewMode={updateTerminalViewMode}
                terminalViewMode={terminalViewMode}
                isDefaultTerminalViewMode={isDefaultTerminalViewMode}
                theme={theme}
                maxLeverage={maxLeverage}
                selectedKey={selectedKey}
                showOrderResult={showOrderResult}
                showCancelResult={showCancelResult}
                marketType={marketType}
                minFuturesStep={minFuturesStep}
                exchange={exchange}
                pricePrecision={pricePrecision}
                quantityPrecision={quantityPrecision}
                priceFromOrderbook={priceFromOrderbook}
                currencyPair={currencyPair}
                arrayOfMarketIds={arrayOfMarketIds}
              />
            </TradingTabelContainer>
          )}
          {authenticated && !isSmartOrderMode && (
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

          {authenticated && !isDefaultOnlyTables && (
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
    prev.isChartPageOnboardingDone === next.isChartPageOnboardingDone &&
    isEqual(prev.theme, next.theme)
    // false
  )
})
