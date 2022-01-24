import { OpenOrders } from '@project-serum/serum'
import { Connection, PublicKey } from '@solana/web3.js'

import { MarketsMap } from '@sb/dexUtils/markets'
import { WalletAdapter } from '@sb/dexUtils/types'

import { LoadedMarket, loadMarketsByNames } from './loadMarketsByNames'
import { loadOpenOrdersFromMarkets } from './loadOpenOrdersFromMarkets'
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
}: {
  wallet: WalletAdapter
  connection: Connection
  marketsNames: string[]
  allMarketsMap: MarketsMap
}): Promise<LoadedMarketsWithDataForTransactionsMap> => {
  const [loadedMarketsMap, openOrdersMap] = await Promise.all([
    loadMarketsByNames({
      connection,
      marketsNames,
      allMarketsMap,
    }),
    loadOpenOrdersFromMarkets({
      wallet,
      connection,
      allMarketsMap,
    }),
  ])

  const vaultSignersMap = loadVaultSignersFromMarkets({
    allMarketsMap,
    marketsNames,
  })

  const marketsWithTransactionsDataMap: LoadedMarketsWithDataForTransactionsMap =
    [...loadedMarketsMap.entries()].reduce((acc, loadedMarket) => {
      const [marketName, loadedMarketData] = loadedMarket

      const openOrders = openOrdersMap.get(marketName) || []
      const vaultSigner = vaultSignersMap.get(marketName)

      return acc.set(marketName, {
        ...loadedMarketData,
        openOrders,
        vaultSigner,
      })
    }, new Map())

  return marketsWithTransactionsDataMap
}
