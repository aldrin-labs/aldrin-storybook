import { sleep } from '@core/utils/helpers'
import { Market } from '@project-serum/serum'
import { Connection } from '@solana/web3.js'

export interface LoadedMarketsMap { [key: string]: Market }

export const loadMarketsByNames = async ({
  connection,
  marketsNames,
  allMarketsMap,
}: {
  connection: Connection
  marketsNames: string[]
  allMarketsMap: Map<string, any>
}): Promise<LoadedMarketsMap> => {
  const marketsMap: LoadedMarketsMap = {}
  let i = 0

  const filteredMarketNames = [...new Set(marketsNames)]

  console.time('markets')

  for (let name of filteredMarketNames) {
    const marketInfo = allMarketsMap.get(name)

    const market = await Market.load(
      connection,
      marketInfo.address,
      {},
      marketInfo.programId
    )

    console.log('market', market, market._decoded.bids)

    marketsMap[name] = market

    if (i % 3 === 0) sleep(1 * 1000)

    i++
  }

  console.timeEnd('markets')

  return marketsMap
}
