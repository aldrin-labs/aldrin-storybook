import { OrderbooksMap } from './getOrderbookForMarkets'

export const addPercentageToPricesInOrderbooks = ({
  orderbooksMap,
  percentage,
}: {
  orderbooksMap: OrderbooksMap
  percentage: number
}) => {
  const orderbooksWithPercentage = Object.entries(orderbooksMap).map(
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

  const orderbooksMapWithPercentage = Object.fromEntries(
    orderbooksWithPercentage
  )

  return orderbooksMapWithPercentage
}
