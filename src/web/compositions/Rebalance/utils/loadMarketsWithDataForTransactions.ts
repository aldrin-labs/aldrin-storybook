import { WalletAdapter } from '@sb/dexUtils/types'
import { MarketsMap } from '@sb/dexUtils/markets'
import { Connection } from '@solana/web3.js'
import { loadMarketsByNames } from './loadMarketsByNames'
import {
  loadOpenOrdersFromMarkets,
  LoadedMarketsWithOpenOrdersMap,
} from './loadOpenOrdersFromMarkets'
import {
  loadVaultSignersFromMarkets,
  LoadedMarketsWithVaultSignersMap,
} from './loadVaultSignersFromMarkets'

export type LoadedMarketsWithVaultSignersAndOpenOrdersMap =
  | LoadedMarketsWithVaultSignersMap
  | LoadedMarketsWithOpenOrdersMap

export const loadMarketsWithDataForTransactions = async ({
  wallet,
  connection,
  marketsNames,
  allMarketsMap,
  allMarketsMapById
}: {
  wallet: WalletAdapter
  connection: Connection
  marketsNames: string[]
  allMarketsMap: MarketsMap
  allMarketsMapById: MarketsMap
}): Promise<LoadedMarketsWithVaultSignersAndOpenOrdersMap> => {
  const loadedMarketsMap = await loadMarketsByNames({
    connection,
    marketsNames,
    allMarketsMap,
    allMarketsMapById
  })

  const loadedMarketMapWithVaultSigners = await loadVaultSignersFromMarkets({
    wallet,
    connection,
    loadedMarketsMap,
  })

  const loadedMarketMapWithVaultSignersAndOpenOrders = await loadOpenOrdersFromMarkets(
    { wallet, connection, loadedMarketsMap: loadedMarketMapWithVaultSigners }
  )

  return loadedMarketMapWithVaultSignersAndOpenOrders
}
