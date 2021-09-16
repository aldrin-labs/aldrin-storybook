import { sleep } from '@core/utils/helpers'
import { Orderbook } from '@project-serum/serum'
import { Connection } from '@solana/web3.js'
import { LoadedMarketsMap } from './loadMarketsByNames'

export type OrderbooksMap = Map<string, { asks: Orderbook; bids: Orderbook }>

export const getOrderbookForMarkets = async ({
  connection,
  loadedMarketsMap,
  onOrderbookLoad,
}: {
  connection: Connection
  loadedMarketsMap: LoadedMarketsMap
  onOrderbookLoad?: ({
    index,
    marketName,
    nextMarketName,
  }: {
    index: number
    marketName: string
    nextMarketName: string
  }) => void
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

    onOrderbookLoad &&
      onOrderbookLoad({
        index: i,
        marketName: name,
        nextMarketName:
          i + 1 === loadedMarketsArray.length
            ? name
            : loadedMarketsArray[i + 1][0],
      })
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
