import { OpenOrders } from '@project-serum/serum'

export type OpenOrdersMapByMarketId = Map<string, OpenOrders[]>

export const getOpenOrdersAccountsMapByMarketId = (
  openOrdersAccounts: OpenOrders[]
): OpenOrdersMapByMarketId => {
  return openOrdersAccounts.reduce((acc, current) => {
    const marketId = current.market.toString()
    if (acc.has(marketId)) {
      acc.set(marketId, [...acc.get(marketId), current])
    } else {
      acc.set(marketId, [current])
    }
    return acc
  }, new Map())
}
