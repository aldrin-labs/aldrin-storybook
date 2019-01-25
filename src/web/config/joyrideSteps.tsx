import React from 'react'

type T = {
  target: string
  content: string
  placement: 'auto' | 'center'
  disableBeacon?: boolean
}

export const portfolioMainSteps = [
  {
    disableBeacon: true,
    target: 'body',
    content: (
      <p>
        {' '}
        Welcome to Cryptocurrencies.Ai beta! <br /> We have added a real Binance
        account, so you can experience all of the functionality. To add your own
        Binance account please go to settings and enter your api key where you
        can also delete this demo account. Please note our application only
        supports Binance currently and we will be adding support for more
        exchanges soon.
      </p>
    ),
    placement: 'center',
  },
  {
    target: '.Navbar',
    content:
      'We have two main sections Portfolio and Chart. Our portfolio consists of five different sub-sections which can be selected from the menu on the left.',
    placement: 'bottom',
  },
  {
    target: '.PortfolioMainTable',
    content:
      'Portfolio main table shows connected accounts, your asset allocation %, your profit & loss.',
    placement: 'auto',
  },
  {
    target: '.PortfolioTradeOrderHistoryTable',
    content:
      'Portfolio actions contains all your trade history, deposits and withdrawals.',
    placement: 'auto',
  },
  {
    target: '.PortfolioValueChart',
    content:
      'Portfolio value chart shows the value of the portfolio over time.',
    placement: 'auto',
  },
  {
    target: '.SwitchButton',
    content: 'You can view your portfolio in crypto and fiat.',
    placement: 'auto',
  },
  {
    target: '.settingsIcon',
    content:
      'Select settings to select or deselect multiple accounts. Dust filter will remove coins from your portfolio which are insignificant.',
    placement: 'auto',
  },
  {
    target: '.LoginButton',
    content: 'To import your account, click here to register or login.',
    placement: 'auto',
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

export const singleChartSteps: T[] = [
  {
    disableBeacon: true,
    target: '.ExchangesTable',
    content: 'Select the exchange.',
    placement: 'bottom',
  },
  {
    target: '.AutoSuggestSelect',
    content: 'Select the pair.',
    placement: 'auto',
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
