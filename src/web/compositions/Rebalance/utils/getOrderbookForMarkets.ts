import { Orderbook } from '@project-serum/serum'
import { Connection } from '@solana/web3.js'

import { notifyForDevelop, notifyWithLog } from '@sb/dexUtils/notifications'

import { LoadedMarketsMap } from './loadMarketsByNames'

export type OrderbooksMap = Map<string, { asks: Orderbook; bids: Orderbook }>

export const getOrderbookForMarkets = async ({
  connection,
  loadedMarketsMap,
}: {
  connection: Connection
  loadedMarketsMap: LoadedMarketsMap
}): Promise<OrderbooksMap> => {
  const orderbooksMap: OrderbooksMap = new Map()

  console.time('orderbooks')

  const markets = [...loadedMarketsMap.values()]

  const asksAndBidsAddresses = markets.flatMap(({ market }) => [
    market.asksAddress.toString(),
    market.bidsAddress.toString(),
  ])

  const loadedOrderbooks = await connection._rpcRequest('getMultipleAccounts', [
    asksAndBidsAddresses,
    { encoding: 'base64' },
  ])

  if (loadedOrderbooks.result.error || !loadedOrderbooks.result.value) {
    notifyWithLog({
      message:
        'Something went wrong while loading orderbooks, please try again later.',
      result: loadedOrderbooks.result,
    })

    return orderbooksMap
  }

  loadedOrderbooks.result.value.forEach((encodedOrderbook: any, i: number) => {
    // const mint = mints[i]
    const isAsks = i % 2 === 0 || i === 0
    const index = isAsks ? i / 2 : (i - 1) / 2
    const { market, marketName } = markets[index]
    const data = new Buffer(encodedOrderbook.data[0], 'base64')
    const orderbook = Orderbook.decode(market, data)

    if (!orderbook) {
      notifyForDevelop({
        message: 'No decimals info for mint.',
        market,
        orderbook,
        index,
        isAsks,
      })

      return
    }

    // @ts-ignore
    orderbooksMap.set(marketName, {
      ...(orderbooksMap.has(marketName) ? orderbooksMap.get(marketName) : {}),
      ...(isAsks ? { asks: orderbook } : { bids: orderbook }),
    })
  })

  console.timeEnd('orderbooks')

  return orderbooksMap
}
