import { Orderbook } from '@project-serum/serum'

import { OrderbooksMap } from './getOrderbookForMarkets'

export type OrderbookRows = {
  asks: [number, number][]
  rowAsks: Orderbook
  bids: [number, number][]
  rowBids: Orderbook
}
export type OrderbooksRowsMap = Map<string, OrderbookRows>

export const getRowsFromOrderbooks = ({
  orderbooksMap,
}: {
  orderbooksMap: OrderbooksMap
}): OrderbooksRowsMap => {
  const orderbooksRowsMap: OrderbooksRowsMap = new Map()
  const orderbooks = [...orderbooksMap.entries()]

  for (const [name, { asks, bids }] of orderbooks) {
    orderbooksRowsMap.set(name, {
      rowAsks: asks,
      asks: asks.getL2(300).map(([price, size]) => [price, size]),
      rowBids: bids,
      bids: bids.getL2(300).map(([price, size]) => [price, size]),
    })
  }

  return orderbooksRowsMap
}
