import { TAKER_FEE } from '@sb/dexUtils/config'
import { RawMarketData } from '@sb/dexUtils/markets'
import { Connection } from '@solana/web3.js'
import { REBALANCE_CONFIG } from '../Rebalance.config'
import {
  MarketData,
  TokensDiff,
  TokensMapType,
  TransactionType,
} from '../Rebalance.types'
import { addPercentageToPricesInOrderbooks } from './addPercentageToPricesInOrderbooks'
import { getOrderbookForMarkets } from './getOrderbookForMarkets'
import { getTransactionsList } from './getTransactionsList'
import { loadMarketsByNames } from './loadMarketsByNames'

export const getTransactionsListWithPrices = async ({
  connection,
  marketsData,
  tokensDiff,
  tokensMap,
  allMarketsMap,
}: {
  connection: Connection
  marketsData: MarketData[]
  tokensDiff: TokensDiff
  tokensMap: TokensMapType
  allMarketsMap: Map<string, RawMarketData>
}): Promise<TransactionType[]> => {
  // getting names of markets to load
  const rebalanceTransactionsList = getTransactionsList({
    tokensDiff,
    orderbooks: {},
    marketsData,
    tokensMap,
    loadedMarketsMap: {},
  })

  const loadedMarketsMap = await loadMarketsByNames({
    connection,
    marketsNames: rebalanceTransactionsList.map((t) => t.name),
    allMarketsMap,
  })

  const orderbooks = await getOrderbookForMarkets({
    connection,
    loadedMarketsMap,
    allMarketsMap,
  })

  const orderbooksWithTakerFees = addPercentageToPricesInOrderbooks({
    orderbooksMap: orderbooks,
    percentage: TAKER_FEE,
    // +
    // REBALANCE_CONFIG.POOL_FEE / 100,
  })

  console.log('rebalanceTransactionsList', rebalanceTransactionsList)

  // transactions with all prices
  const rebalanceAllTransactionsListWithPrices = getTransactionsList({
    tokensDiff,
    marketsData,
    orderbooks: orderbooksWithTakerFees,
    tokensMap,
    loadedMarketsMap,
  })

  console.log(
    'data second rebalanceAllTransactionsPrices',
    rebalanceAllTransactionsListWithPrices
  )

  return rebalanceAllTransactionsListWithPrices
}
