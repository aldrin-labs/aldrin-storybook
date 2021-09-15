import { WalletAdapter } from '@sb/dexUtils/adapters'
import { TAKER_FEE } from '@core/config/dex'
import { MarketsMap } from '@sb/dexUtils/markets'
import { Connection } from '@solana/web3.js'
import { REBALANCE_CONFIG } from '../Rebalance.config'
import { TokensMapType, TransactionType } from '../Rebalance.types'
import { addPercentageToPricesInOrderbooks } from './addPercentageToPricesInOrderbooks'
import { getOrderbookForMarkets } from './getOrderbookForMarkets'
import { getTransactionsList } from './getTransactionsList'
import { mergeRebalanceTransactions } from './mergeRebalanceTransactions'
import { sortRebalanceTransactions } from './sortRebalanceTransactions'
import { loadMarketsWithDataForTransactions } from './loadMarketsWithDataForTransactions'
import { getRowsFromOrderbooks } from './getRowsFromOrderbooks'

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
    loadedMarketsMap: new Map(),
  })

  const loadedMarketsMap = await loadMarketsWithDataForTransactions({
    wallet,
    connection,
    marketsNames: rebalanceTransactionsList.map((t) => t.name),
    allMarketsMap,
  })

  const orderbooksMap = await getOrderbookForMarkets({
    connection,
    loadedMarketsMap,
  })

  const orderbooksRowsMap = getRowsFromOrderbooks({ orderbooksMap })

  const orderbooksWithTakerFees = addPercentageToPricesInOrderbooks({
    orderbooksMap: orderbooksRowsMap,
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

  console.log('rebalanceAllTransactionsListWithPrices', rebalanceAllTransactionsListWithPrices)

  const mergedRebalanceTransactions = mergeRebalanceTransactions(
    rebalanceAllTransactionsListWithPrices
  )

  const sortedRebalanceTransactions = sortRebalanceTransactions(
    mergedRebalanceTransactions
  )

  console.log(
    'data second mergedRebalanceTransactions',
    mergedRebalanceTransactions
  )

  return sortedRebalanceTransactions
}
