import useSwr from 'swr'

import { getOrderbookForMarkets } from '@sb/compositions/Rebalance/utils/getOrderbookForMarkets'
import {
  getRowsFromOrderbooks,
  OrderbookRows,
} from '@sb/compositions/Rebalance/utils/getRowsFromOrderbooks'
import {
  LoadedMarketWithDataForTransactions,
  loadMarketsWithDataForTransactions,
} from '@sb/compositions/Rebalance/utils/loadMarketsWithDataForTransactions'
import { useOpenOrdersFromMarkets } from '@sb/compositions/Rebalance/utils/useOpenOrdersFromMarkets'
import { useConnection } from '@sb/dexUtils/connection'
import { useAllMarketsList } from '@sb/dexUtils/markets'
import { useWallet } from '@sb/dexUtils/wallet'

export type LoadedMarketWithOrderbook =
  Partial<LoadedMarketWithDataForTransactions> & {
    orderbook: OrderbookRows
  }

export type LoadedMarketWithOrderbookMap = Map<
  string,
  LoadedMarketWithOrderbook
>

export const useAllMarketsOrderbooks = ({
  marketsNames,
}: {
  marketsNames: string[]
}): [LoadedMarketWithOrderbookMap, () => void] => {
  const { wallet } = useWallet()
  const connection = useConnection()
  const allMarketsMap = useAllMarketsList()
  const [openOrdersFromMarketsMap] = useOpenOrdersFromMarkets()

  const fetcher = async (): Promise<LoadedMarketWithOrderbookMap> => {
    console.log('refreshing useAllMarketsOrderbooks', { marketsNames })
    if (!marketsNames || marketsNames.length === 0) {
      return new Map()
    }

    const loadedMarketsMap = await loadMarketsWithDataForTransactions({
      wallet,
      connection,
      marketsNames,
      allMarketsMap,
      openOrdersFromMarketsMap,
    })

    console.log('loadedMarketsMap', loadedMarketsMap)

    const orderbooksMap = await getOrderbookForMarkets({
      connection,
      loadedMarketsMap,
    })

    const orderbooksRowsMap = getRowsFromOrderbooks({ orderbooksMap })

    const marketsWithOrderbook = [...loadedMarketsMap.keys()].reduce(
      (acc, marketName: string) => {
        const marketInfo = loadedMarketsMap.get(marketName)
        const orderbook = orderbooksRowsMap.get(marketName)

        return acc.set(marketName, { ...marketInfo, orderbook })
      },
      new Map()
    )

    return marketsWithOrderbook
  }

  const key = `${
    wallet.publicKey
  }-all-markets-with-orderbook-${marketsNames.join('-')}`

  const { data, mutate } = useSwr(key, fetcher)

  return [data || new Map(), mutate]
}
