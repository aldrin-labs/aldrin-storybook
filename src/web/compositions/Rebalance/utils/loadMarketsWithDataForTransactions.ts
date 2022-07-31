import { OpenOrders } from '@project-serum/serum/lib/market'
import { Connection } from '@solana/web3.js'

import { loadMarketsByNames } from './loadMarketsByNames'
import { loadVaultSignersFromMarkets } from './loadVaultSignersFromMarkets'
import {
  LoadedMarketsWithDataForTransactionsMap,
  LoadedMarketWithDataForTransactions,
} from './types'

export const loadMarketsWithDataForTransactions = async ({
  connection,
  marketsNames,
  openOrdersMap,
}: {
  connection: Connection
  marketsNames: string[]
  openOrdersMap: Map<string, OpenOrders>
}): Promise<LoadedMarketsWithDataForTransactionsMap> => {
  const [loadedMarketsMap] = await Promise.all([
    loadMarketsByNames({
      connection,
      marketsNames,
    }),
  ])

  const vaultSignersMap = await loadVaultSignersFromMarkets({
    marketsNames,
  })

  const marketsWithTransactionsDataMap: LoadedMarketsWithDataForTransactionsMap =
    [...loadedMarketsMap.entries()].reduce<
      Map<string, LoadedMarketWithDataForTransactions>
    >((acc, loadedMarket) => {
      const [marketName, loadedMarketData] = loadedMarket
      const vaultSigner = vaultSignersMap.get(marketName)

      if (!vaultSigner) {
        throw new Error(`No vaultSigner found for market: ${marketName}`)
      }

      const openOrders =
        openOrdersMap.get(loadedMarketData.market.address.toString()) || []

      return acc.set(marketName, {
        ...loadedMarketData,
        vaultSigner,
        openOrders,
      })
    }, new Map())

  return marketsWithTransactionsDataMap
}
