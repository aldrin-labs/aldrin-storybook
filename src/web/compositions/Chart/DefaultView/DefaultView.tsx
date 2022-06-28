import { Grid, Theme } from '@material-ui/core'
import { isEqual } from 'lodash-es'
import React, { useEffect, useState } from 'react'
import { useTheme } from 'styled-components'

import SingleChartWithButtons from '@sb/components/Chart'
import TradingTable from '@sb/components/TradingTable/TradingTable'
import { TablesBlockWrapper } from '@sb/components/TradingWrapper/styles'
import {
  BalancesWrapper as Balances,
  OrderbookAndDepthChart,
  TradeHistory,
} from '@sb/compositions/Chart/components'
import TokenNotAddedPopup from '@sb/compositions/Chart/components/TokenNotAdded'
import { isCCAITradingEnabled } from '@sb/dexUtils/utils'

import {
  BalancesContainer,
  ChartAndOrderbookContainer,
  ChartsContainer,
  Container,
  MobileTradingTabelContainer,
  TopChartsContainer,
  TradingTabelContainer,
  TradingTerminalContainer,
} from '../Chart.styles'
import {
  OrderBookGrid,
  TradeHistoryGrid,
} from '../Inputs/SelectWrapper/SelectWrapperStyles'
import TradingComponent from '../TradingComponent'

const TerminalContainer = ({
  isDefaultTerminalViewMode,
  children,
  theme,
  terminalViewMode,
}: {
  isDefaultTerminalViewMode: boolean
  children: React.ReactChild
  theme: Theme
  terminalViewMode: string
}) => (
  <TablesBlockWrapper
    item
    container
    theme={theme}
    xs={isDefaultTerminalViewMode ? 5 : 12}
    $isDefaultTerminalViewMode={isDefaultTerminalViewMode}
    $terminalViewMode={terminalViewMode}
  >
    {children}
  </TablesBlockWrapper>
)

// fix props type
export const DefaultViewComponent = (
  props: any
): React.ReactComponentElement<any> | null => {
  const {
    currencyPair,
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
    maxLeverage,
  } = props

  const hideTradeHistory = currencyPair.includes('WUSDT')
  const hideOrderbook = false
  const hideDepthChart = true

  const [priceFromOrderbook, updateTerminalPriceFromOrderbook] = useState<
    null | number
  >(null)
  const [showTokenNotAddedPopup, setShowTokenNotAdded] = useState(false)
  const [isTradingBlockedPopupOpen, setIsTradingBlockedPopupOpen] = useState(
    !isCCAITradingEnabled() && currencyPair === 'RIN_USDC'
  )

  const newTheme = useTheme()

  const [base, quote] = currencyPair.split('_')

  const baseQuoteArr = [base, quote]
  const exchange = activeExchange.symbol
  const isDefaultTerminalViewMode = terminalViewMode === 'default'
  const sizeDigits = quantityPrecision

  useEffect(() => {
    updateTerminalPriceFromOrderbook(null)
  }, [currencyPair])

  return (
    <Container container spacing={8} theme={theme}>
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
        <ChartAndOrderbookContainer
          $terminalViewMode={terminalViewMode}
          item
          container
          xs={12}
        >
          <TopChartsContainer
            $isDefaultTerminalViewMode={isDefaultTerminalViewMode}
            theme={theme}
            $terminalViewMode={terminalViewMode}
          >
            <ChartsContainer
              $isDefaultTerminalViewMode={isDefaultTerminalViewMode}
              $terminalViewMode={terminalViewMode}
              $hideDepthChart={hideDepthChart}
              $hideOrderbook={hideOrderbook}
              $hideTradeHistory={hideTradeHistory}
              theme={theme}
            >
              <SingleChartWithButtons
                currencyPair={currencyPair}
                base={base}
                quote={quote}
                marketType={marketType}
                themeMode={themeMode}
              />
            </ChartsContainer>
            <TradingTerminalContainer
              theme={theme}
              $isDefaultTerminalViewMode={isDefaultTerminalViewMode}
              $hideDepthChart={hideDepthChart}
              $hideOrderbook={hideOrderbook}
              $hideTradeHistory={hideTradeHistory}
              $terminalViewMode={terminalViewMode}
            >
              <Grid item container style={{ height: '100%' }}>
                <OrderBookGrid
                  xs
                  item
                  container
                  $hideTradeHistory={hideTradeHistory}
                  $hideOrderbook={hideOrderbook}
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
                        terminalViewMode,
                      }}
                    />
                  )}
                </OrderBookGrid>
                <TradeHistoryGrid
                  $hideDepthChart={hideDepthChart}
                  $hideOrderbook={hideOrderbook}
                  item
                  xs={5}
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
                </TradeHistoryGrid>
              </Grid>
            </TradingTerminalContainer>
          </TopChartsContainer>
          <TradingTabelContainer
            item
            xs={6}
            isDefaultTerminalViewMode={isDefaultTerminalViewMode}
          >
            <TradingTable
              newTheme={newTheme}
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
              terminalViewMode={terminalViewMode}
              updateTerminalViewMode={updateTerminalViewMode}
            />
          </TradingTabelContainer>
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
              setShowTokenNotAdded={setShowTokenNotAdded}
            />
          </BalancesContainer>
          <TerminalContainer
            theme={theme}
            isDefaultTerminalViewMode={isDefaultTerminalViewMode}
            terminalViewMode={terminalViewMode}
          >
            <TradingComponent
              newTheme={newTheme}
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
              sizeDigits={sizeDigits}
              priceFromOrderbook={priceFromOrderbook}
              marketType={marketType}
              maxLeverage={maxLeverage}
              showOrderResult={showOrderResult}
              showCancelResult={showCancelResult}
              showChangePositionModeResult={showChangePositionModeResult}
              isDefaultTerminalViewMode={isDefaultTerminalViewMode}
              updateTerminalViewMode={updateTerminalViewMode}
              setShowTokenNotAdded={setShowTokenNotAdded}
              terminalViewMode={terminalViewMode}
            />
          </TerminalContainer>
          <MobileTradingTabelContainer
            item
            theme={theme}
            xs={6}
            isDefaultTerminalViewMode={isDefaultTerminalViewMode}
            isTablesExpanded={terminalViewMode === 'fullScreenTablesMobile'}
            terminalViewMode={terminalViewMode}
          >
            <TradingTable
              newTheme={newTheme}
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
              updateTerminalViewMode={updateTerminalViewMode}
              terminalViewMode={terminalViewMode}
            />
          </MobileTradingTabelContainer>
          {/* <TradingBlocked
            pair={baseQuoteArr}
            theme={theme}
            open={isTradingBlockedPopupOpen}
            onClose={() => setIsTradingBlockedPopupOpen(false)}
          /> */}
          <TokenNotAddedPopup
            pair={baseQuoteArr}
            theme={theme}
            open={showTokenNotAddedPopup}
            onClose={() => setShowTokenNotAdded(false)}
          />
        </ChartAndOrderbookContainer>
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
