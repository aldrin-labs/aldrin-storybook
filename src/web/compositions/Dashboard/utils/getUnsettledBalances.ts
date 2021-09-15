import { OpenOrders } from '@project-serum/serum'
import { LoadedMarketsMap } from '@sb/compositions/Rebalance/utils/loadMarketsByNames'
import { MarketsMap } from '@sb/dexUtils/markets'
import { notEmpty } from '@sb/dexUtils/utils'
import { UnsettledBalance } from '../components/UnsettledBalancesTable/UnsettledBalancesTable.utils'

export const getUnsettledBalances = ({
  openOrdersAccounts,
  allMarketsMapById,
  loadedMarketsMap,
}: {
  openOrdersAccounts: OpenOrders[]
  allMarketsMapById: MarketsMap
  loadedMarketsMap: LoadedMarketsMap
}): UnsettledBalance[] => {
  return openOrdersAccounts
    .map((openOrders) => {
      const marketNameFromId =
        allMarketsMapById.get(openOrders.market.toString())?.name ||
        'Unknown market'
      const marketData = loadedMarketsMap.get(marketNameFromId)

      const { market, marketName } = marketData || {
        market: null,
        marketName: null,
      }

      if (!market || !marketName) return null

      return {
        openOrders,
        baseUnsettled: market.baseSplSizeToNumber(openOrders.baseTokenFree),
        quoteUnsettled: market.quoteSplSizeToNumber(openOrders.quoteTokenFree),
        market,
        marketName,
      }
    })
    .filter(notEmpty)
    .filter(
      (unsettledBalance) =>
        unsettledBalance.baseUnsettled > 0 ||
        unsettledBalance.quoteUnsettled > 0
    )
}
