import { sleep } from '@core/utils/helpers'
import { Connection } from '@solana/web3.js'
import { LoadedMarketsMap } from './loadMarketsByNames'

export interface OrderbooksMap {
  [key: string]: { asks: [number, number][]; bids: [number, number][] }
}

export const getOrderbookForMarkets = async ({
  connection,
  loadedMarketsMap,
  allMarketsMap,
}: {
  connection: Connection
  loadedMarketsMap: LoadedMarketsMap
  allMarketsMap: Map<string, any>
}): Promise<OrderbooksMap> => {
  const orderbooksMap: OrderbooksMap = {}

  let i = 0

  console.time('orderbooks')

  const loadedMarketsArray = Object.entries(loadedMarketsMap)

  for (let [name, { market }] of loadedMarketsArray) {
    const [asks, bids] = await Promise.all([
      market.loadAsks(connection),
      market.loadBids(connection),
    ])

    orderbooksMap[name] = {
      asks: asks.getL2(300).map(([price, size]) => [price, size]),
      bids: bids.getL2(300).map(([price, size]) => [price, size]),
    }

    if (i % 3 === 0) await sleep(1 * 1000)

    i++
  }

  console.timeEnd('orderbooks')

  return orderbooksMap
}
