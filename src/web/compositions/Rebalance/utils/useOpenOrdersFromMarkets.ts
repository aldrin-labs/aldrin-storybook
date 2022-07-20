import { useState } from 'react'
import useSWR, { KeyedMutator } from 'swr'

import { useConnection } from '@sb/dexUtils/connection'
import { useAllMarketsList } from '@sb/dexUtils/markets'
import { useWallet } from '@sb/dexUtils/wallet'

import {
  loadOpenOrdersFromMarkets,
  OpenOrdersMap,
} from './loadOpenOrdersFromMarkets'

export const useOpenOrdersFromMarkets = (): [
  OpenOrdersMap,
  KeyedMutator<OpenOrdersMap>,
  boolean
] => {
  const { wallet } = useWallet()
  const connection = useConnection()
  const allMarketsMap = useAllMarketsList()
  const [loading, setLoading] = useState(false)

  const fetcher = async (): Promise<OpenOrdersMap> => {
    setLoading(true)
    const loadeOpenOrdersFromMarketsMap = await loadOpenOrdersFromMarkets({
      wallet,
      connection,
      allMarketsMap,
    })
    setLoading(false)

    console.log('loadeOpenOrdersFromMarketsMap', loadeOpenOrdersFromMarketsMap)

    return loadeOpenOrdersFromMarketsMap
  }

  const key = `openOrders-from-markets-for-wallet-${wallet.publicKey}`

  const { data, mutate } = useSWR(key, fetcher)

  return [data || new Map(), mutate, loading]
}
