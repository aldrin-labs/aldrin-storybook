import { TAKER_FEE } from '@sb/dexUtils/config'
import { REBALANCE_CONFIG } from '../Rebalance.config'
import { OrderbooksMap } from './getOrderbookForMarkets'

export const addTakerFeesToPricesInOrderbooks = ({
  orderbooksMap,
}: {
  orderbooksMap: OrderbooksMap
}) => {
  const orderbooksWithFees = Object.entries(orderbooksMap).map(
    ([name, orderbook]) => {
      const asksWithTakerFees = orderbook.asks.map(([price, amount]) => {
        const priceWithTakerFee = price * (1 + TAKER_FEE)
        return [priceWithTakerFee, amount]
      })

      const bidsWithTakerFees = orderbook.bids.map(([price, amount]) => {
        const priceWithTakerFee = price * (1 - TAKER_FEE)
        return [priceWithTakerFee, amount]
      })

      return [name, { asks: asksWithTakerFees, bids: bidsWithTakerFees }]
    }
  )

  const orderbooksMapWithFees = Object.fromEntries(orderbooksWithFees)
  console.log('orderbooksMapWithFees', orderbooksMapWithFees)

  return orderbooksMapWithFees
}
