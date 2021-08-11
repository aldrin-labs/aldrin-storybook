import { WalletAdapter } from '@sb/dexUtils/adapters'
import { TAKER_FEE } from '@sb/dexUtils/config'
import { MarketsMap } from '@sb/dexUtils/markets'
import { Connection } from '@solana/web3.js'
import { REBALANCE_CONFIG } from '../Rebalance.config'
import { TokensMapType, TransactionType } from '../Rebalance.types'
import { addPercentageToPricesInOrderbooks } from './addPercentageToPricesInOrderbooks'
import { getOrderbookForMarkets } from './getOrderbookForMarkets'
import { getTransactionsList } from './getTransactionsList'
import { loadMarketsByNames } from './loadMarketsByNames'
import { sortRebalanceTransactions } from './sortRebalanceTransactions'

export const getTransactionsListWithPrices = async ({
  wallet,
  connection,
  tokensMap,
  allMarketsMap,
}: {
  wallet: WalletAdapter
  connection: Connection
  tokensMap: TokensMapType
  allMarketsMap: MarketsMap
}): Promise<TransactionType[]> => {

  // getting names of markets to load
  const rebalanceTransactionsList = getTransactionsList({
    orderbooks: {},
    tokensMap,
    allMarketsMap,
    loadedMarketsMap: {},
  })

  const loadedMarketsMap = await loadMarketsByNames({
    wallet,
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
    percentage: TAKER_FEE + REBALANCE_CONFIG.SLIPPAGE / 100,
  })

  console.log('rebalanceTransactionsList', rebalanceTransactionsList)

  // transactions with all prices
  const rebalanceAllTransactionsListWithPrices = getTransactionsList({
    allMarketsMap,
    orderbooks: orderbooksWithTakerFees,
    tokensMap,
    loadedMarketsMap,
  })

  const sortedRebalanceTransactions = sortRebalanceTransactions(
    rebalanceAllTransactionsListWithPrices
  )

  console.log(
    'data second rebalanceAllTransactionsPrices',
    rebalanceAllTransactionsListWithPrices
  )

  return sortedRebalanceTransactions
}
