import { DEX_PID } from '@core/config/dex'
import { OpenOrders } from '@project-serum/serum'
import { WalletAdapter } from '@sb/dexUtils/types'
import { MarketsMap } from '@sb/dexUtils/markets'
import { Connection } from '@solana/web3.js'
import { LoadedMarket, LoadedMarketsMap } from './loadMarketsByNames'

export interface LoadedMarketWithOpenOrders extends LoadedMarket {
  openOrders: OpenOrders[]
}
export type LoadedMarketsWithOpenOrdersMap = Map<
  string,
  LoadedMarketWithOpenOrders
>

export const loadOpenOrdersFromMarkets = async ({
  wallet,
  connection,
  loadedMarketsMap,
}: {
  wallet: WalletAdapter
  connection: Connection
  loadedMarketsMap: LoadedMarketsMap
}): Promise<LoadedMarketsWithOpenOrdersMap> => {
  const marketsWithSignersMap: LoadedMarketsWithOpenOrdersMap = new Map()

  console.time('openOrders')

  const openOrdersAccounts = await OpenOrders.findForOwner(
    connection,
    wallet.publicKey,
    DEX_PID
  )

  for (const marketData of loadedMarketsMap.values()) {
    const { market, marketName } = marketData

    const openOrders = openOrdersAccounts.filter((account) =>
      account.market.equals(market.address)
    )

    marketsWithSignersMap.set(marketName, { ...marketData, openOrders })
  }

  console.timeEnd('openOrders')

  return marketsWithSignersMap
}
