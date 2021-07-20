import { priceStore } from '@sb/dexUtils/price'
import { MARKETS_BY_NAME_MAP } from '@sb/dexUtils/serum'
import { TokenInfo, TokenInfoWithPrice } from '../Rebalance.types'

export const getPricesForTokens = async (tokens: TokenInfo[]): Promise<TokenInfoWithPrice[]> => {
    const tokensWithPrices = await Promise.all(tokens.map(async token => {
      const { symbol, mint } = token
  
      const isTokenSymbolIsNotRecognized = symbol === mint
      const isUSDT = symbol === 'USDT' || symbol === 'USDC' || symbol === 'WUSDC' || symbol === 'WUSDT';
      const tokenToUSDCPair = `${symbol}/USDC`
      const isTokenHasPairWithUSDC = !!MARKETS_BY_NAME_MAP[tokenToUSDCPair]
  
      // No token symbol so don't fetch market data.
      if (isTokenSymbolIsNotRecognized) {
        return {...token, price: null }
      }
  
      // Don't fetch USD stable coins. Mark to 1 USD.
      if (isUSDT) {
        return {...token, price: 1 }
      }
      
      // No Serum market exists.
      if (!isTokenHasPairWithUSDC) {
        return {...token, price: null }
      }
  
      // A Serum market exists. Fetch the price.
      try {
        // TODO: Make this method more bullet-proof
        const price: number | null = await priceStore.getPrice(tokenToUSDCPair.split('/').join(''))
  
        return { ...token, price }
      } catch (e) {
        return { ...token, price: null }
      }
    }))
  
    return tokensWithPrices
}
