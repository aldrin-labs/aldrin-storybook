import { sleep } from '@core/utils/helpers'
import { Market } from '@project-serum/serum'
import { WalletAdapter } from '@sb/dexUtils/adapters'
import { MarketsMap } from '@sb/dexUtils/markets'
import { Connection } from '@solana/web3.js'
export interface LoadedMarket {
  market: Market
  marketName: string
}
export type LoadedMarketsMap = Map<string, LoadedMarket>

export const loadMarketsByNames = async ({
  wallet,
  connection,
  marketsNames,
  allMarketsMap,
  onLoadMarket,
}: {
  wallet: WalletAdapter
  connection: Connection
  marketsNames: string[]
  allMarketsMap: MarketsMap
  onLoadMarket?: ({
    marketName,
    nextMarketName,
    index,
  }: {
    marketName: string
    nextMarketName: string
    index: number
  }) => void
}): Promise<LoadedMarketsMap> => {
  const marketsMap: LoadedMarketsMap = new Map()
  let i = 0

  const filteredMarketNames = [...new Set(marketsNames)]

  console.time('markets')

  for (let name of filteredMarketNames) {
    const marketInfo = allMarketsMap.get(name)

    if (!marketInfo) continue

    const market = await Market.load(
      connection,
      marketInfo.address,
      {},
      marketInfo.programId
    )

    marketsMap.set(name, { market, marketName: name })
    onLoadMarket &&
      onLoadMarket({
        marketName: name,
        index: i,
        nextMarketName:
          i + 1 === filteredMarketNames.length
            ? name
            : filteredMarketNames[i + 1],
      })

    if (i % 4 === 0) await sleep(1 * 1000)

    i++
  }

  console.timeEnd('markets')

  return marketsMap
}
