import { portfolioKeyAndWalletsQuery } from '@core/graphql/queries/portfolio/portfolioKeyAndWalletsQuery'
import { getKeysQuery } from '@core/graphql/queries/user/getKeysQuery'
import { keysNames } from '@core/graphql/queries/chart/keysNames'
import { getPortfolioAssets } from '@core/graphql/queries/portfolio/getPortfolioAssets'
import { getMyPortfoliosQuery } from '@core/graphql/queries/portfolio/getMyPortfoliosQuery'
import { getCurrentPortfolio } from '@core/graphql/queries/profile/getCurrentPortfolio'
import { getAllUserKeys } from '@core/graphql/queries/user/getAllUserKeys'
import { GET_TRADING_SETTINGS } from '@core/graphql/queries/user/getTradingSettings'

export const refetchOptionsOnKeyAddFunction = ({
  baseData: {
    portfolio: { baseCoin },
  },
  onboarding,
}: {
  baseData: { portfolio: { baseCoin: 'USDT' | 'BTC' } }
  onboarding: boolean
}) => ({
  refetchQueries: !onboarding
    ? [
        {
          query: portfolioKeyAndWalletsQuery,
          variables: { baseCoin },
        },
        { query: getKeysQuery },
        { query: keysNames },
        {
          query: getPortfolioAssets,
          variables: { baseCoin, innerSettings: true },
        },
        { query: getMyPortfoliosQuery, variables: { baseCoin: 'USDT' } },
        { query: getCurrentPortfolio },
        { query: getAllUserKeys },
        { query: GET_TRADING_SETTINGS },
      ]
    : [],
})
