import { OpenOrders } from '@project-serum/serum'
import { Connection } from '@solana/web3.js'

import { MarketsMap } from '@sb/dexUtils/markets'
import { WalletAdapter } from '@sb/dexUtils/types'

import { DEX_PID } from '@core/config/dex'

import { LoadedMarket } from './loadMarketsByNames'

export interface LoadedMarketWithOpenOrders extends LoadedMarket {
  openOrders: OpenOrders[]
}
export type OpenOrdersMap = Map<string, OpenOrders[]>

export const loadOpenOrdersFromMarkets = async ({
  wallet,
  connection,
  allMarketsMap,
}: {
  wallet: WalletAdapter
  connection: Connection
  allMarketsMap: MarketsMap
}): Promise<OpenOrdersMap> => {
  const openOrdersMap: OpenOrdersMap = new Map()

  console.time('openOrders')

  let openOrdersAccounts: OpenOrders[] = []

  // add to markets load
  if (wallet.publicKey) {
    openOrdersAccounts = await OpenOrders.findForOwner(
      connection,
      wallet.publicKey,
      DEX_PID
    )
  }

  for (const [marketName, { address }] of allMarketsMap.entries()) {
    const openOrders = openOrdersAccounts.filter((account) =>
      account.market.equals(address)
    )

    if (openOrders.length > 0) {
      openOrdersMap.set(marketName, openOrders)
    }
  }

  console.timeEnd('openOrders')

  return openOrdersMap
}
