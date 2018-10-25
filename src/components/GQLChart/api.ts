import gql from 'graphql-tag'

import { KeyFragment } from '@graphql/fragments'

export const PRICE_HISTORY_QUERY = gql`
  query priceHistoryQuery(
    $coins: [String!]
    $isBTC: Boolean!
    $unixTimestampFrom: Int!
    $unixTimestampTo: Int!
    $period: Int!
  ) {
    portfolioMain @client {
      activeChart
    }
    getPriceHistory(
      coins: $coins
      isBTC: $isBTC
      unixTimestampFrom: $unixTimestampFrom
      unixTimestampTo: $unixTimestampTo
      period: $period
    ) {
      coins
      dates
      prices
    }
  }
`

export const UPDATE_PORTFOLIO = gql`
  mutation updatePortfolio {
    updatePortfolio
  }
`

export const CORRELATION_UPDATE = gql`
  subscription onCorrelationUpdated {
    matrix
  }
`

export const getCorrelationQuery = gql`
  query getPortfolio($startDate: Int!, $endDate: Int!) {
    myPortfolios {
      correlationMatrixByDay(startDate: $startDate, endDate: $endDate)
    }
  }
`

export const getKeysQuery = gql`
  query getKeys {
    myPortfolios {
      keys {
        _id
        name
        date
        apiKey
      }
    }
  }
`
export const getKeysAndWallets = gql`
  query getKeys {
    myPortfolios {
      keys {
        _id
        name
        date
        apiKey
      }
      cryptoWallets {
        _id
        name
      }
    }
  }
`

export const PORTFOLIO_UPDATE = gql`
  subscription onPortfolioUpdated {
    portfolioUpdate
  }
`

export const getWalletsQuery = gql`
  query getWallets {
    myPortfolios {
      cryptoWallets {
        _id
        name
      }
    }
  }
`

export const getPortfolioQuery = gql`
  query getPortfolio($baseCoin: String!) {
    myPortfolios {
      name
      industryData(base: $baseCoin) {
        industry
        assets {
          coin
          quantity
          perf
          price
        }
        industry1W
        industry1M
        industry3M
        industry1Y
      }
    }
  }
`
export const getPortfolioMainQuery = gql`
  query getPortfolio($baseCoin: String!) {
    myPortfolios {
      name
      portfolioAssets(base: $baseCoin) {
        _id
        coin
        name
        where
        price
        quantity
        realized
        unrealized
      }
    }
  }
`

export const getMyPortfolioAndRebalanceQuery = gql`
  query getPortfolioAndRebalance($baseCoin: String!) {
    myPortfolios {
      name
      portfolioAssets(base: $baseCoin) {
        name
        coin
        where
        price
        quantity
      }
      myRebalance {
        total
        assets {
          _id
          id
          percent
          amount
          diff
        }
      }
    }
  }
`

export const updateRebalanceMutation = gql`
  mutation updateRebalance($input: rebalanceInput) {
    updateRebalance(input: $input) {
      assets {
        _id
        id
        percent
        amount
        diff
      }
      total
      updatedAt
      createdAt
    }
  }
`
