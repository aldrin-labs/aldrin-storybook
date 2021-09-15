import { OrderbooksMap } from './getOrderbookForMarkets'

export type OrderbooksRowsMap = Map<
  string,
  { asks: [number, number][]; bids: [number, number][] }
>

export const getRowsFromOrderbooks = ({
  orderbooksMap,
}: {
  orderbooksMap: OrderbooksMap
}): OrderbooksRowsMap => {
  const orderbooksRowsMap: OrderbooksRowsMap = new Map()

  for (let [name, { asks, bids }] of orderbooksMap) {
    orderbooksRowsMap.set(name, {
      asks: asks.getL2(300).map(([price, size]) => [price, size]),
      bids: bids.getL2(300).map(([price, size]) => [price, size]),
    })
  }

  return orderbooksRowsMap
}
