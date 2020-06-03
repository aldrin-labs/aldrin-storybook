import React, { useState } from 'react'

import { Fade, Grid } from '@material-ui/core'

import MainDepthChart from '../DepthChart/MainDepthChart/MainDepthChart'
import { SingleChart } from '@sb/components/Chart'

import Balances from '@core/components/Balances'
import TradingComponent from '@core/components/TradingComponent'
import TradingTable from '@sb/components/TradingTable/TradingTable'
import { TablesBlockWrapper } from '@sb/components/TradingWrapper/styles'
import { TradeHistory, OrderbookAndDepthChart } from '../components'
import CardsPanel from '../components/CardsPanel'

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
export const DefaultViewComponent = (
  props: any
): React.ReactComponentElement<any> | null => {
  const {
    currencyPair,
    id,
    view,
    marketType,
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
    closeChartPagePopup
  } = props

  if (!currencyPair) {
    return null
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
    <Container container spacing={8}>
      <ChartGridContainer item xs={12}>
        <CardsPanel
          {...{
            _id: id,
            pair: currencyPair,
            view,
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
            isDefaultTerminalViewMode={isDefaultTerminalViewMode}
          >
            <CustomCard id="tradingViewChart">
              <SingleChart
                name=""
                additionalUrl={`/?symbol=${base}/${quote}_${String(
                  marketType
                )}&user_id=${id}&theme=${themeMode}`}
              />
            </CustomCard>
          </ChartsContainer>
          <TradingTerminalContainer
            isDefaultTerminalViewMode={isDefaultTerminalViewMode}
          >
            <Grid item container style={{ height: '100%' }}>
              <Grid
                item
                container
                xs={7}
                style={{
                  height: '100%',

                  flexBasis: '65%',
                  maxWidth: '65%',
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
                    isPairDataLoading,
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
              chartPagePopup={chartPagePopup}
              closeChartPagePopup={closeChartPagePopup}
              quantityPrecision={quantityPrecision}
              pricePrecision={pricePrecision}
              minSpotNotional={minSpotNotional}
              minFuturesStep={minFuturesStep}
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

export const DefaultView = React.memo(DefaultViewComponent, (prev, next) => {
  return (
    prev.marketType === next.marketType &&
    prev.selectedKey.keyId === next.selectedKey.keyId &&
    prev.currencyPair === next.currencyPair &&
    prev.terminalViewMode === next.terminalViewMode &&
    prev.selectedKey.hedgeMode === next.selectedKey.hedgeMode &&
    prev.isPairDataLoading === next.isPairDataLoading
  )
})
