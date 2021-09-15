import { sleep } from '@core/utils/helpers'
import { OpenOrders } from '@project-serum/serum'
import { WalletAdapter } from '@sb/dexUtils/adapters'
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
  let i = 0

  console.time('openOrders')

  for (let marketData of loadedMarketsMap.values()) {
    const { market, marketName } = marketData

    const openOrders = await market.findOpenOrdersAccountsForOwner(
      connection,
      wallet.publicKey
    )

    marketsWithSignersMap.set(marketName, { ...marketData, openOrders })

    if (i % 4 === 0) await sleep(1 * 1000)

    i++
  }

  console.timeEnd('openOrders')

  return marketsWithSignersMap
}
