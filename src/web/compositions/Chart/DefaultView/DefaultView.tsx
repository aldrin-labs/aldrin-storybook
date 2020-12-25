import React, { useState, useEffect } from 'react'
import { shallowEqual } from 'recompose'
import { Fade, Grid, Theme } from '@material-ui/core'

// import MainDepthChart from '../DepthChart/MainDepthChart/MainDepthChart'
import { SingleChart } from '@sb/components/Chart'
import { difference, shallowDifference } from '@core/utils/difference'


import ChartOnboarding from '@sb/compositions/Chart/components/ChartOnboarding/ChartOnboarding'
import Balances from '@core/components/Balances/BalancesWrapper'
import TradingComponent from '@core/components/TradingComponent'
import TradingTable from '@sb/components/TradingTable/TradingTable'
import { TablesBlockWrapper } from '@sb/components/TradingWrapper/styles'
import { TradeHistory, OrderbookAndDepthChart } from '../components'
import CardsPanel from '../components/CardsPanel'
import { GuestMode } from '../components/GuestMode/GuestMode'
import ChartCardHeader from '@sb/components/ChartCardHeader'
// import { HideArrow } from '../components/HideArrow/HideArrow'
// import { isEqual } from 'lodash'

const TerminalContainer = ({
  isDefaultTerminalViewMode,
  isDefaultOnlyTables,
  children,
  theme,
}: {
  isDefaultTerminalViewMode: boolean
  isDefaultOnlyTables: boolean
  children: React.ReactChild
  theme: Theme
}) => (
  <TablesBlockWrapper
    item
    container
    theme={theme}
    xs={isDefaultTerminalViewMode ? 5 : 12}
    isDefaultTerminalViewMode={isDefaultTerminalViewMode}
    isDefaultOnlyTables={isDefaultOnlyTables}
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
    showTableOnMobile,
    selectedKey,
    terminalViewMode,
    updateTerminalViewMode,
    arrayOfMarketIds,
    isPairDataLoading,
    minSpotNotional,
    minFuturesStep,
    authenticated,
    maxLeverage,
    layout,
    changeChartLayoutMutation,
  } = props

  useEffect(() => {
    updateTerminalPriceFromOrderbook(null)
  }, [currencyPair])

  if (!currencyPair) {
    return null
  }

  console.log('DefaultView RENDER')

  const {
    hideDepthChart,
    hideOrderbook,
    hideTradeHistory,
    hideTradingViewChart,
  } = layout

  const changeChartLayout = async (newParams) => {
    const argObject = {
      hideDepthChart,
      hideTradeHistory,
      hideOrderbook,
      hideTradingViewChart,
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
  const isDefaultTerminalViewMode = terminalViewMode !== 'smartOrderMode'
  const isDefaultOnlyTables = terminalViewMode === 'onlyTables'
  const isSmartOrderMode = terminalViewMode === 'smartOrderMode'

  const sizeDigits = marketType === 0 ? 8 : 3

  return (
    <Container container spacing={8} theme={theme}>
      {authenticated && (
        <ChartOnboarding />
      )}
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
            isDefaultTerminalViewMode,
            isDefaultOnlyTables,
            isSmartOrderMode,
            updateTerminalViewMode,
            marketType,
            terminalViewMode,
            hideDepthChart,
            hideOrderbook,
            hideTradeHistory,
            hideTradingViewChart,
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
              {!hideTradingViewChart && (
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
              )}
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
                      symbol={currencyPair}
                      exchange={exchange}
                      quote={quote}
                      base={base}
                      marketType={marketType}
                      hideDepthChart={hideDepthChart}
                      theme={theme}
                      isPairDataLoading={isPairDataLoading}
                      minPriceDigits={minPriceDigits}
                      selectedKey={selectedKey}
                      arrayOfMarketIds={arrayOfMarketIds}
                      updateTerminalPriceFromOrderbook={
                        updateTerminalPriceFromOrderbook
                      }
                      changeTable={changeTable}
                      sizeDigits={sizeDigits}
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
                      symbol={currencyPair}
                      pair={currencyPair}
                      exchange={exchange}
                      activeExchange={activeExchange}
                      quote={quote}
                      theme={theme}
                      minPriceDigits={minPriceDigits}
                      updateTerminalPriceFromOrderbook={
                        updateTerminalPriceFromOrderbook
                      }
                      marketType={marketType}
                      isPairDataLoading={isPairDataLoading}
                      showTableOnMobile={showTableOnMobile}
                      changeTable={changeTable}
                      sizeDigits={sizeDigits}
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
                marketType={marketType}
                minFuturesStep={minFuturesStep}
                exchange={exchange}
                priceFromOrderbook={priceFromOrderbook}
                currencyPair={currencyPair}
                arrayOfMarketIds={arrayOfMarketIds}
              />
            </TradingTabelContainer>
          )}
          {authenticated && (
            <BalancesContainer
              item
              xs={1}
              theme={theme}
              id="balances"
              isDefaultTerminalViewMode={isDefaultTerminalViewMode}
              isSmartOrderMode={isSmartOrderMode}
            >
              <Balances
                pair={currencyPair.split('_')}
                selectedKey={selectedKey}
                marketType={marketType}
                theme={theme}
              />
            </BalancesContainer>
          )}

          {authenticated && (
            <TerminalContainer
              theme={theme}
              isDefaultTerminalViewMode={isDefaultTerminalViewMode}
              isDefaultOnlyTables={isDefaultOnlyTables}
            >
              <TradingComponent
                selectedKey={selectedKey}
                activeExchange={activeExchange}
                pair={baseQuoteArr}
                theme={theme}
                minSpotNotional={minSpotNotional}
                minFuturesStep={minFuturesStep}
                priceFromOrderbook={priceFromOrderbook}
                marketType={marketType}
                maxLeverage={maxLeverage}
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

  console.log('DefaultView diff: ', difference(prev, next))
  console.log('DefaultView shallowDifference: ', shallowDifference(prev, next))
  console.log('DefaultView shallowEqual diff', shallowEqual(prev, next))


  return shallowEqual(prev, next)

})
