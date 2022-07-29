import { OpenOrders } from '@project-serum/serum'
import { Connection, PublicKey } from '@solana/web3.js'

import { LoadedMarket, loadMarketsByNames } from './loadMarketsByNames'
import { OpenOrdersMap } from './loadOpenOrdersFromMarkets'
import { loadVaultSignersFromMarkets } from './loadVaultSignersFromMarkets'

export type LoadedMarketWithDataForTransactions = Partial<LoadedMarket> & {
  vaultSigner: PublicKey
  openOrders: OpenOrders[]
}
export type LoadedMarketsWithDataForTransactionsMap = Map<
  string,
  LoadedMarketWithDataForTransactions
>

export const loadMarketsWithDataForTransactions = async ({
  connection,
  marketsNames,
  openOrdersFromMarketsMap,
}: {
  connection: Connection
  marketsNames: string[]
  openOrdersFromMarketsMap: OpenOrdersMap
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
        openOrdersFromMarketsMap.get(
          loadedMarketData.market.address.toString()
        ) || []

      return acc.set(marketName, {
        ...loadedMarketData,
        vaultSigner,
        openOrders,
      })
    }, new Map())

  return marketsWithTransactionsDataMap
}
