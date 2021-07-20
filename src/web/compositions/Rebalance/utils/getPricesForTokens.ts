import { client } from '@core/graphql/apolloClient'
import { getDexTokensPrices } from '@core/graphql/queries/pools/getDexTokensPrices'
import { priceStore } from '@sb/dexUtils/price'
import { MARKETS_BY_NAME_MAP } from '@sb/dexUtils/serum'
import { TokenInfo, TokenInfoWithPrice } from '../Rebalance.types'

export const getPricesForTokens = async (
  tokens: TokenInfo[]
): Promise<TokenInfoWithPrice[]> => {
  const getDexTokensPricesData = await client.query({
    query: getDexTokensPrices,
    fetchPolicy: 'network-only',
  })

  const {
    data: { getDexTokensPrices: tokensPrices } = { getDexTokensPrices: [] },
  } = getDexTokensPricesData || {
    data: {
      getDexTokensPrices: [],
    },
  }

  const tokensWithPrices = tokens.map((token) => {
    const { symbol, mint } = token

    const isTokenSymbolIsNotRecognized = symbol === mint
    const isUSDT =
      symbol === 'USDT' ||
      symbol === 'USDC' ||
      symbol === 'WUSDC' ||
      symbol === 'WUSDT'

    // No token symbol so don't fetch market data.
    if (isTokenSymbolIsNotRecognized) {
      return { ...token, price: null }
    }

    // Don't fetch USD stable coins. Mark to 1 USD.
    if (isUSDT) {
      return { ...token, price: 1 }
    }

    // A Serum market exists. Fetch the price.
    try {
      // TODO: Make this method more bullet-proof
      const price: number | null = tokensPrices.find(
        (tokenPrice) => tokenPrice.symbol === symbol
      )?.price
      
      return { ...token, price }
    } catch (e) {
      return { ...token, price: null }
    }
  })

  return tokensWithPrices
}
