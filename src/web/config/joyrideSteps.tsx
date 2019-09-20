import React from 'react'

type T = {
  target: string
  content: string
  placement: 'auto' | 'center'
  disableBeacon?: boolean
}

const buttonsText = { 
  back: 'PREVIOUS', 
  close: 'CLOSE', 
  last: 'FINISH P&L INTRODUCTION', 
  next: 'NEXT',
  skip: 'SKIP INTRODUCTION',
}

export const portfolioMainSteps = [
  {
    target: '#sharePortfolioPanel',
    content: (
      <p style={{
        fontFamily: 'DM Sans',
        textAlign: 'left',
      }}>
        <b>It's your portfolio name</b>
      </p>
    ),
    placement: 'left',
    spotlightClicks: true,
    disableOverlayClose: true,
    hideCloseButton: false,
    locale: buttonsText,
  },
  {
    target: '#accordionOverview',
    content: (
      <p style={{
        fontFamily: 'DM Sans',
        textAlign: 'left',
      }}>
        <b>It’s overview.</b><br/>
        Your overview panel shows the portfolio performance for each of your exchange accounts.
      </p>
    ),
    placement: 'left',
    spotlightClicks: true,
    disableOverlayClose: true,
    hideCloseButton: false,
    locale: buttonsText,
  },
  {
    target: '#allocationChart',
    content: (
      <p style={{
        fontFamily: 'DM Sans',
        textAlign: 'left',
      }}>
        <b>Allocation Chart</b><br/>
        View distribution percent by assets and exchanges
      </p>
    ),
    placement: 'right',
    spotlightClicks: true,
    disableOverlayClose: true,
    hideCloseButton: false,
    locale: buttonsText,
  },
  {
    target: '#PortfolioMainTable',
    content: (
      <p style={{
        fontFamily: 'DM Sans',
        textAlign: 'left',
      }}>
        <b>Assets table</b><br/>
        This table shows all of your assets with real-time market prices and performance.
        You can also do a quick trade from here without going to the trading terminal.
      </p>
    ),
    placement: 'auto',
    spotlightClicks: true,
    disableOverlayClose: true,
    hideCloseButton: false,
    locale: buttonsText,
  },
  {
    target: '#sharePortfolioSwitcher',
    content: (
      <p style={{
        fontFamily: 'DM Sans',
        textAlign: 'left',
      }}>
        <b>USD/BTC Switcher</b><br/>
        Switch between crypto and fiat for portfolio performance data.
      </p>
    ),
    placement: 'bottom',
    spotlightClicks: true,
    disableOverlayClose: true,
    hideCloseButton: false,
    locale: buttonsText,
  },
  {
    target: '#accountsPanel',
    content: (
      <p style={{
        fontFamily: 'DM Sans',
        textAlign: 'left',
      }}>
        <b>Accounts panel</b><br/>
        Create a new portfolio or add new exchange accounts to existing portfolio.
      </p>
    ),
    placement: 'right',
    spotlightClicks: true,
    disableOverlayClose: true,
    hideCloseButton: false,
    locale: buttonsText,
  },
  {
    target: '#porfolioSelector',
    content: (
      <p style={{
        fontFamily: 'DM Sans',
        textAlign: 'left',
      }}>
        <b>Accounts panel</b><br/>
        Create a new portfolio or add new exchange accounts to existing portfolio.
        Filter out small values by dust filter
      </p>
    ),
    placement: 'right',
    spotlightClicks: true,
    disableOverlayClose: true,
    hideCloseButton: false,
    locale: buttonsText,
  },
  {
    target: '#transactionsPanel',
    content: (
      <p style={{
        fontFamily: 'DM Sans',
        textAlign: 'left',
      }}>
        <b>Ok, lets explore transactions page now</b><br/>
        You can view your transaction data here.
      </p>
    ),
    placement: 'left',
    spotlightClicks: true,
    disableOverlayClose: true,
    hideCloseButton: false,
    locale: buttonsText,
  },
]

export const portfolioIndustrySteps = [
  {
    disableBeacon: true,
    target: 'body',
    content:
      'You can see which industries you are invested in and the performance of each industry for various durations.',
    placement: 'center',
  },
]

export const portfolioRebalanceSteps = [
  {
    disableBeacon: true,
    target: 'body',
    content:
      'You can edit and reallocate your capital by changing the percentages to get your desired result. Simulate how to introduce new capital to your portfolio and its allocation.Trade instructions must be manually executed on the exchange. We will introduce trade execution in the future to allow you to do this with a single click.',
    placement: 'center',
  },
  {
    target: '.PortfolioDistributionChart',
    content: 'Portfolio allocation of current assets vs rebalanced.',
    placement: 'auto',
  },
]

export const portfolioCorrelationSteps = [
  {
    disableBeacon: true,
    target: 'body',
    content:
      'You can switch the correlation matrix time periods and make it full screen.',
    placement: 'center',
  },
]

export const portfolioOptimizationSteps = [
  {
    disableBeacon: true,
    target: 'body',
    content:
      'You can optimize your portfolio and select your risk level. Back-test different coins and time periods to find the best combination and optimize your portfolio accordingly.',
    placement: 'center',
  },
  {
    target: '.OptimizationInput',
    content:
      'Input parameters to back-test optimization model. Stable coin introduces stable coin USDT into your portfolio and the model simulates moving capital to USDT when the market is down and returns are negative until the next rebalance period.',
    placement: 'auto',
  },
  {
    target: '.RiskProfileTable',
    content:
      'Your portfolio is imported as default but you can add and delete coins to simulate different scenarios.',
    placement: 'auto',
  },
  {
    target: '.BackTestOptimizationChart',
    content: 'The line chart shows the back-test performance.',
    placement: 'auto',
  },
  {
    target: '.EfficientFrontierChart',
    content:
      'The efficient frontier shows the optimal portfolio for the 5 risk levels.',
    placement: 'auto',
  },
  {
    target: '.PortfolioDistributionChart',
    content:
      'The bar chart and the table shows the optimized portfolio based on the historic performance. Note that this optimized portfolio is for the end date of the date range, if it is till current date then the optimization is for current date, if the date range ends in the past then the optimized percentage is in the past as well.',
    placement: 'auto',
  },
]

export const singleChartSteps: T[] = []

export const multiChartsSteps: T[] = [
  {
    disableBeacon: true,
    target: 'body',
    content: 'Select more pairs with up-to 8 charts.',
    placement: 'center',
  },
]
