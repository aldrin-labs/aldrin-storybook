import React, { useState, useEffect } from 'react'

import { Fade, Grid, Theme } from '@material-ui/core'
import SingleChartWithButtons from '@sb/components/Chart'
import TokenNotAddedPopup from '@sb/compositions/Chart/components/TokenNotAdded'
import Balances from '@core/components/Balances'
import TradingComponent from '@core/components/TradingComponent'
import TradingTable from '@sb/components/TradingTable/TradingTable'
import { TablesBlockWrapper } from '@sb/components/TradingWrapper/styles'
import { TradeHistory, OrderbookAndDepthChart } from '../components'
import { isEqual } from 'lodash'

const TerminalContainer = ({
  isDefaultTerminalViewMode,
  isDefaultOnlyTablesMode,
  isFullScreenTablesMode,
  children,
  theme,
}: {
  isDefaultTerminalViewMode: boolean
  isFullScreenTablesMode: boolean
  isDefaultOnlyTablesMode: boolean
  children: React.ReactChild
  theme: Theme
}) => (
  <TablesBlockWrapper
    item
    container
    theme={theme}
    xs={isDefaultTerminalViewMode ? 5 : 12}
    isDefaultTerminalViewMode={isDefaultTerminalViewMode}
    isDefaultOnlyTablesMode={isDefaultOnlyTablesMode}
    isFullScreenTablesMode={isFullScreenTablesMode}
  >
    {children}
  </TablesBlockWrapper>
)

import {
  Container,
  ChartsContainer,
  TradingTableContainer,
  TradingTerminalContainer,
  BalancesContainer,
  TopChartsContainer,
} from '../Chart.styles'
import TradingBlocked from '../components/TradingBlocked'
import { CCAIListingTime, isCCAITradingEnabled } from '@sb/dexUtils/utils'

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
    showTableOnMobile,
    selectedKey,
    chartProps,
    showChangePositionModeResult,
    isDefaultTerminalViewMode,
    isDefaultOnlyTablesMode,
    isFullScreenTablesMode,
    isSmartOrderMode,
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
    !isCCAITradingEnabled() && currencyPair === 'CCAI_USDC'
  )

  const [base, quote] = currencyPair.split('_')
  const baseQuoteArr = [base, quote]
  const exchange = activeExchange.symbol
  const sizeDigits = quantityPrecision

  console.log('terminalViewMode', terminalViewMode)

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
        <Grid
          item
          container
          xs={12}
          style={{
            height: '100%',
          }}
        >
          <TopChartsContainer isFullScreenTablesMode={isFullScreenTablesMode} isDefaultTerminalViewMode={true} theme={theme}>
            <ChartsContainer
              hideDepthChart={hideDepthChart}
              hideOrderbook={hideOrderbook}
              theme={theme}
              hideTradeHistory={hideTradeHistory}
            >
              <SingleChartWithButtons
                currencyPair={currencyPair}
                marketType={marketType}
                themeMode={themeMode}
              />
            </ChartsContainer>
            <TradingTerminalContainer
              theme={theme}
              hideDepthChart={hideDepthChart}
              hideOrderbook={hideOrderbook}
              hideTradeHistory={hideTradeHistory}
            >
              <Grid item container style={{ height: '100%' }}>
                <Grid
                  item
                  container
                  style={{
                    height: '100%',
                    flexBasis: hideOrderbook
                      ? '0%'
                      : !hideTradeHistory
                      ? '50%'
                      : '100%',
                    maxWidth: hideOrderbook
                      ? '0%'
                      : !hideTradeHistory
                      ? '50%'
                      : '100%',
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

          <TradingTableContainer
            item
            theme={theme}
            isSmartOrderMode={isSmartOrderMode}
            xs={
              isFullScreenTablesMode
                ? 12
                : isDefaultOnlyTablesMode
                ? 11
                : 6
            }
            isDefaultTerminalViewMode={isDefaultTerminalViewMode}
            updateTerminalViewMode={updateTerminalViewMode}
            isDefaultOnlyTablesMode={isDefaultOnlyTablesMode}
            isFullScreenTablesMode={isFullScreenTablesMode}
          >
            <TradingTable
              isFullScreenTablesMode={isFullScreenTablesMode}
              isDefaultOnlyTablesMode={isDefaultOnlyTablesMode}
              isSmartOrderMode={isSmartOrderMode}
              isDefaultTerminalViewMode={isDefaultTerminalViewMode}
              updateTerminalViewMode={updateTerminalViewMode}
              terminalViewMode={terminalViewMode}
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
          </TradingTableContainer>

          <BalancesContainer
            item
            xs={1}
            theme={theme}
            id="balances"
            isFullScreenTablesMode={isFullScreenTablesMode}
            isSmartOrderMode={isSmartOrderMode}
            isDefaultTerminalViewMode={true}
          >
            <Balances
              pair={currencyPair.split('_')}
              selectedKey={selectedKey}
              marketType={marketType}
              theme={theme}
              setShowTokenNotAdded={setShowTokenNotAdded}
            />
          </BalancesContainer>

          <TerminalContainer
            theme={theme}
            isDefaultTerminalViewMode={isDefaultTerminalViewMode}
            isDefaultOnlyTablesMode={isDefaultOnlyTablesMode}
            isFullScreenTablesMode={isFullScreenTablesMode}
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
              sizeDigits={sizeDigits}
              priceFromOrderbook={priceFromOrderbook}
              marketType={marketType}
              maxLeverage={maxLeverage}
              showOrderResult={showOrderResult}
              showCancelResult={showCancelResult}
              showChangePositionModeResult={showChangePositionModeResult}
              isDefaultTerminalViewMode={isDefaultTerminalViewMode}
              isSmartOrderMode={isSmartOrderMode}
              updateTerminalViewMode={updateTerminalViewMode}
              setShowTokenNotAdded={setShowTokenNotAdded}
            />
          </TerminalContainer>

          <TradingBlocked
            theme={theme}
            open={isTradingBlockedPopupOpen}
            onClose={() => setIsTradingBlockedPopupOpen(false)}
          />

          <TokenNotAddedPopup
            pair={baseQuoteArr}
            theme={theme}
            open={showTokenNotAddedPopup}
            onClose={() => setShowTokenNotAdded(false)}
          />
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
