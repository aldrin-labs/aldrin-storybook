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
  // last: 'FINISH P&L INTRODUCTION',
  last: 'FINISH',
  next: 'NEXT',
  skip: 'SKIP',
}

const buttonsTransactionsText = {
  back: 'PREVIOUS',
  close: 'CLOSE',
  // last: 'FINISH TRANSACTIONS INTRODUCTION',
  last: 'FINISH',
  next: 'NEXT',
  skip: 'SKIP',
}

export const portfolioMainSteps = [
  {
    target: '#accordionOverview',
    content: (
      <p
        style={{
          fontFamily: 'DM Sans',
          textAlign: 'left',
        }}
      >
        <b>Overview. </b>
        Your overview panel shows the portfolio performance for each of your
        exchange accounts.
      </p>
    ),
    placement: 'left',
    spotlightClicks: true,
    disableOverlayClose: true,
    disableBeacon: true,
    hideCloseButton: false,
    locale: buttonsText,
    stepIndex: 0,
  },
  {
    target: '#allocationChart',
    content: (
      <p
        style={{
          fontFamily: 'DM Sans',
          textAlign: 'left',
        }}
      >
        <b>Allocation Chart</b>
        <br />
        View distribution percent by assets and exchanges
      </p>
    ),
    placement: 'right',
    spotlightClicks: true,
    disableOverlayClose: true,
    hideCloseButton: false,
    locale: buttonsText,
    stepIndex: 1,
  },
  {
    target: '#PortfolioMainTable',
    content: (
      <p
        style={{
          fontFamily: 'DM Sans',
          textAlign: 'left',
          padding: 0,
          margin: 0,
          marginTop: '-9%',
        }}
      >
        <b>Assets table</b>
        <br />
        This table shows all of your assets with real-time market prices and
        performance.
      </p>
    ),
    placement: 'auto',
    spotlightClicks: true,
    disableOverlayClose: true,
    hideCloseButton: false,
    locale: buttonsText,
    stepIndex: 2,
  },
  {
    target: '#sharePortfolioSwitcher',
    content: (
      <p
        style={{
          fontFamily: 'DM Sans',
          textAlign: 'left',
        }}
      >
        <b>USD/BTC Switcher</b>
        <br />
        Switch between crypto and fiat for portfolio performance data.
      </p>
    ),
    placement: 'bottom',
    spotlightClicks: true,
    disableOverlayClose: true,
    hideCloseButton: false,
    locale: buttonsText,
    stepIndex: 3,
  },
  {
    target: '#accountsPanel',
    content: (
      <p
        style={{
          fontFamily: 'DM Sans',
          textAlign: 'left',
        }}
      >
        <b>Accounts panel</b>
        <br />
        Create a new portfolio or add new exchange accounts to existing
        portfolio. Filter out small values by dust filter
      </p>
    ),
    placement: 'right',
    spotlightClicks: false,
    disableOverlayClose: true,
    hideCloseButton: false,
    locale: buttonsText,
    stepIndex: 4,
  },
  // {
  //   target: '#porfolioSelector',
  //   content: (
  //     <p style={{
  //       fontFamily: 'DM Sans',
  //       textAlign: 'left',
  //     }}>
  //       <b>Accounts panel</b><br/>
  //       Create a new portfolio or add new exchange accounts to existing portfolio.
  //       Filter out small values by dust filter
  //     </p>
  //   ),
  //   placement: 'right',
  //   spotlightClicks: true,
  //   disableOverlayClose: true,
  //   hideCloseButton: false,
  //   locale: buttonsText,
  // },
  {
    target: '#transactionsPanel',
    content: (
      <p
        style={{
          fontFamily: 'DM Sans',
          textAlign: 'left',
        }}
      >
        <b>Ok, lets explore transactions page now</b>
        <br />
        You can view your transaction data here.
      </p>
    ),
    placement: 'left',
    spotlightClicks: true,
    disableOverlayClose: true,
    hideCloseButton: false,
    locale: buttonsText,
    stepIndex: 5,
  },
]

export const transactionsPageSteps = [
  {
    target: '#accountsTransactions',
    content: (
      <p
        style={{
          fontFamily: 'DM Sans',
          textAlign: 'left',
        }}
      >
        <b>Accounts filter</b>
        <br />
        Select your portfolio and accounts to view its transactions. Filter for
        transaction type
      </p>
    ),
    placement: 'auto',
    spotlightClicks: true,
    disableOverlayClose: true,
    hideCloseButton: false,
    disableBeacon: true,
    locale: buttonsTransactionsText,
  },
  {
    target: '#calendarTransactions',
    content: (
      <p
        style={{
          fontFamily: 'DM Sans',
          textAlign: 'left',
        }}
      >
        <b>Calendar</b>
        <br />
        Calendar shows the heat-map of your trading frequency. Use the period
        selector to filter data.
      </p>
    ),
    placement: 'bottom',
    spotlightClicks: true,
    disableOverlayClose: true,
    hideCloseButton: false,
    locale: buttonsTransactionsText,
  },
  {
    target: '#tableTransactions',
    content: (
      <p
        style={{
          fontFamily: 'DM Sans',
          textAlign: 'left',
        }}
      >
        <b>Your actions table</b>
        <br />
        The table shows your detail data per transaction
      </p>
    ),
    placement: 'auto',
    spotlightClicks: true,
    disableOverlayClose: true,
    hideCloseButton: false,
    locale: buttonsTransactionsText,
  },
  {
    target: '#statisticTransactions',
    content: (
      <p
        style={{
          fontFamily: 'DM Sans',
          textAlign: 'left',
        }}
      >
        <b>Your actions dashboard</b>
        <br />
        These widgets show your recent actions and win/loss ratio of your trades
        profitability
      </p>
    ),
    placement: 'left',
    spotlightClicks: true,
    disableOverlayClose: true,
    hideCloseButton: false,
    locale: buttonsTransactionsText,
  },
  {
    target: '#accountsPanel',
    content: (
      <p
        style={{
          fontFamily: 'DM Sans',
          textAlign: 'left',
        }}
      >
        <b>Our introduction is over.</b>
        <br />
        Now you can return to P&L page by using quick navigation button.
      </p>
    ),
    placement: 'right',
    spotlightClicks: true,
    disableOverlayClose: true,
    hideCloseButton: false,
    locale: buttonsTransactionsText,
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

export const singleChartSteps = [
  {
    target: '#tradingViewChart',
    content: (
      <p
        style={{
          fontFamily: 'DM Sans',
          textAlign: 'left',
        }}
      >
        <b>TA Chart </b>
        <br />
        Most of the space on this page is on the chart. You know what to do with
        it. Follow the market, analyze and trade!
      </p>
    ),
    placement: 'bottom',
    spotlightClicks: true,
    disableOverlayClose: true,
    hideCloseButton: false,
    disableBeacon: true,
    locale: buttonsTransactionsText,
  },
  {
    target: '#accountSelector',
    content: (
      <p
        style={{
          fontFamily: 'DM Sans',
          textAlign: 'left',
        }}
      >
        <b>Account selector</b>
        <br />
        Choose account to trade from if you have several!
      </p>
    ),
    placement: 'bottom',
    spotlightClicks: true,
    disableOverlayClose: true,
    hideCloseButton: false,
    locale: buttonsTransactionsText,
  },
  {
    target: '#pairSelector',
    content: (
      <p
        style={{
          fontFamily: 'DM Sans',
          textAlign: 'left',
        }}
      >
        <b>Pair selector</b>
        <br />
        Choose pair which you want to trade here.
      </p>
    ),
    placement: 'bottom',
    spotlightClicks: true,
    disableOverlayClose: true,
    hideCloseButton: false,
    locale: buttonsTransactionsText,
  },
  {
    target: '#depthChartAndOB',
    content: (
      <p
        style={{
          fontFamily: 'DM Sans',
          textAlign: 'left',
        }}
      >
        <b>Depth chart and orderbook </b>
        <br />
        For ask, bid and trade volumes analysis in realtime!
      </p>
    ),
    placement: 'left',
    spotlightClicks: true,
    disableOverlayClose: true,
    hideCloseButton: false,
    locale: buttonsTransactionsText,
  },
  {
    target: '#tradingTerminal',
    content: (
      <p
        style={{
          fontFamily: 'DM Sans',
          textAlign: 'left',
        }}
      >
        <b>Terminal is here! </b>
        <br />
        Select order type, input price and amount and trade!
      </p>
    ),
    placement: 'top',
    spotlightClicks: true,
    disableOverlayClose: true,
    hideCloseButton: false,
    locale: buttonsTransactionsText,
  },
  {
    target: '#balances',
    content: (
      <p
        style={{
          fontFamily: 'DM Sans',
          textAlign: 'left',
        }}
      >
        <b>Balance and funds transfer </b>
        <br />
        Check your balance and transfer funds between spot and futures market
        with “Transfer in” and “Transfer out” buttons (on futures tab).
      </p>
    ),
    placement: 'right',
    spotlightClicks: true,
    disableOverlayClose: true,
    hideCloseButton: false,
    locale: buttonsTransactionsText,
  },
  {
    target: '#tables',
    content: (
      <p
        style={{
          fontFamily: 'DM Sans',
          textAlign: 'left',
        }}
      >
        <b>Tables </b>
        <br />
        Here you can see actual information about your trading. Active smart
        trades, open positions, open orders and your order and trade history.
      </p>
    ),
    placement: 'top',
    spotlightClicks: true,
    disableOverlayClose: true,
    hideCloseButton: false,
    locale: buttonsTransactionsText,
  },
  {
    target: '#smartTradingButton',
    content: (
      <p
        style={{
          fontFamily: 'DM Sans',
          textAlign: 'left',
        }}
      >
        <b>Smart trading</b>
        <br />
        Smart order is a tool to set up your trade both with stop loss and take
        a profit with advanced settings. Take a view!
      </p>
    ),
    placement: 'top',
    spotlightClicks: true,
    disableOverlayClose: true,
    hideCloseButton: false,
    locale: buttonsTransactionsText,
  },
]

export const multiChartsSteps: T[] = [
  {
    disableBeacon: true,
    target: 'body',
    content: 'Select more pairs with up-to 8 charts.',
    placement: 'center',
  },
]
