import { sleep } from "@core/utils/helpers"
import { Market } from "@project-serum/serum"
import { Connection } from "@solana/web3.js"

export const getOrderbookForMarkets = async ({
  connection,
  marketsNames,
  allMarketsMap,
}: {
  connection: Connection
  marketsNames: string[]
  allMarketsMap: Map<string, any>
}) => {
  const orderbookMap: { [key: string]: any } = {}
  let i = 0

  const filteredMarketNames = [...new Set(marketsNames)]

  console.time('orderbooks')

  for (let name of filteredMarketNames) {
    const marketInfo = allMarketsMap.get(name)
    
    const market = await Market.load(
      connection,
      marketInfo.address,
      {},
      marketInfo.programId
    )

    const [asks, bids] = await Promise.all([
      market.loadAsks(connection),
      market.loadBids(connection),
    ])

    orderbookMap[name] = {
      asks: asks.getL2(300).map(([price, size]) => [price, size]).reverse(),
      bids: bids.getL2(300).map(([price, size]) => [price, size]),
    }

    if (i % 2 === 0) sleep(1 * 1000)

    i++;
  }

  console.timeEnd('orderbooks')

  return orderbookMap
}
