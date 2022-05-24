import { OpenOrders } from '@project-serum/serum'
import { Connection, PublicKey } from '@solana/web3.js'

import { MarketsMap } from '@sb/dexUtils/markets'
import { WalletAdapter } from '@sb/dexUtils/types'

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
  wallet,
  connection,
  marketsNames,
  allMarketsMap,
  openOrdersFromMarketsMap,
}: {
  wallet: WalletAdapter
  connection: Connection
  marketsNames: string[]
  allMarketsMap: MarketsMap
  openOrdersFromMarketsMap: OpenOrdersMap
}): Promise<LoadedMarketsWithDataForTransactionsMap> => {
  const [loadedMarketsMap] = await Promise.all([
    loadMarketsByNames({
      connection,
      marketsNames,
      allMarketsMap,
    }),
  ])

  const vaultSignersMap = await loadVaultSignersFromMarkets({
    allMarketsMap,
    marketsNames,
  })

  const marketsWithTransactionsDataMap: LoadedMarketsWithDataForTransactionsMap =
    [...loadedMarketsMap.entries()].reduce((acc, loadedMarket) => {
      const [marketName, loadedMarketData] = loadedMarket
      const vaultSigner = vaultSignersMap.get(marketName)
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
