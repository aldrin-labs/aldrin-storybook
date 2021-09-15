import { Market, Order } from '@project-serum/serum/lib/market'
import { OrderbooksMap } from '@sb/compositions/Rebalance/utils/getOrderbookForMarkets'
import { LoadedMarketsMap } from '@sb/compositions/Rebalance/utils/loadMarketsByNames'
import { notEmpty } from '@sb/dexUtils/utils'
import { OpenOrdersMapByMarketId } from './getOpenOrdersAccountsMapByMarketId'

export interface OrderWithMarket extends Order {
  market: Market
  marketName: string
}

export const getOpenOrdersFromOrderbooks = ({
  loadedMarketsMap,
  orderbooksMap,
  openOrdersAccountsMapByMarketId,
}: {
  loadedMarketsMap: LoadedMarketsMap
  orderbooksMap: OrderbooksMap
  openOrdersAccountsMapByMarketId: OpenOrdersMapByMarketId
}): Order[] => {
  return [...loadedMarketsMap.values()]
    .map((marketData) => {
      const { market, marketName } = marketData
      const { asks, bids } = orderbooksMap.get(marketName) || {
        asks: null,
        bids: null,
      }

      const openOrdersAccounts =
        openOrdersAccountsMapByMarketId.get(market.address.toString()) || []

      if (!asks || !bids) return null

      return market
        .filterForOpenOrders(bids, asks, openOrdersAccounts)
        .map((order) => ({
          ...order,
          market,
          marketName,
        }))
    })
    .filter(notEmpty)
    .flat()
}
