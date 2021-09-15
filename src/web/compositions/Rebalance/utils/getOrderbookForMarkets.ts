import { sleep } from '@core/utils/helpers'
import { Orderbook } from '@project-serum/serum'
import { Connection } from '@solana/web3.js'
import { LoadedMarketsMap } from './loadMarketsByNames'

export type OrderbooksMap = Map<string, { asks: Orderbook, bids: Orderbook }>

export const getOrderbookForMarkets = async ({
  connection,
  loadedMarketsMap,
}: {
  connection: Connection
  loadedMarketsMap: LoadedMarketsMap
}): Promise<OrderbooksMap> => {
  const orderbooksMap: OrderbooksMap = new Map()

  let i = 0

  console.time('orderbooks')

  const loadedMarketsArray = [...loadedMarketsMap.entries()]

  for (let [name, { market }] of loadedMarketsArray) {
    const [asks, bids] = await Promise.all([
      market.loadAsks(connection),
      market.loadBids(connection),
    ])

    orderbooksMap.set(name, {
      asks,
      bids,
    })

    if (i % 3 === 0) await sleep(1 * 1000)

    i++
  }

  console.timeEnd('orderbooks')

  return orderbooksMap
}
