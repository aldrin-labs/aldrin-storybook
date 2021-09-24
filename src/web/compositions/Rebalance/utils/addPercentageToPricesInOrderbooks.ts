import { Orderbooks } from '../Rebalance.types'
import { OrderbooksRowsMap } from './getRowsFromOrderbooks'

export const addPercentageToPricesInOrderbooks = ({
  orderbooksMap,
  percentage,
}: {
  orderbooksMap: OrderbooksRowsMap
  percentage: number
}): Orderbooks => {
  const orderbooksWithPercentage = [...orderbooksMap.entries()].map(
    ([name, orderbook]) => {
      const asksWithPercentage = orderbook.asks.map(([price, amount]) => {
        const priceWithPercentage = price * (1 + percentage)
        return [priceWithPercentage, amount]
      })

      const bidsWithPercentage = orderbook.bids.map(([price, amount]) => {
        const priceWithPercentage = price * (1 - percentage)
        return [priceWithPercentage, amount]
      })

      return [name, { asks: asksWithPercentage, bids: bidsWithPercentage }]
    }
  )

  const orderbooksMapWithPercentage: Orderbooks = Object.fromEntries(
    orderbooksWithPercentage
  )

  return orderbooksMapWithPercentage
}
