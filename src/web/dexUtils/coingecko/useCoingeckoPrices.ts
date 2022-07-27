import { useEffect } from 'react'
import useSWR from 'swr'

import { COMMON_REFRESH_INTERVAL } from '@core/utils/config'

import { useCoingeckoTokensMap } from './useCoingeckoTokensMap'

interface UseCoingeckoPricesMapResult {
  pricesMap: Map<string, number>
  refresh: () => {}
}

export const useCoingeckoPrices = (
  symbols: string[]
): UseCoingeckoPricesMapResult => {
  const { tokenByIdMap, tokenBySymbolMap } = useCoingeckoTokensMap()

  const fetcher = async () => {
    const tokenIds = symbols.map((symbol) => {
      const { id } = tokenBySymbolMap.get(symbol.toLowerCase()) || { id: '' }
      return id
    })

    const prices = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${tokenIds.join(
        ','
      )}&vs_currencies=usd`
    )

    const pricesResponse = await prices.json()

    return tokenIds.reduce<Map<string, number>>((acc, id) => {
      const { usd: price } = pricesResponse[id] || { usd: 0 }
      const { symbol } = tokenByIdMap.get(id) || { symbol: '' }

      return acc.set(symbol.toUpperCase(), price)
    }, new Map())
  }

  const { data: pricesMap, mutate: refresh } = useSWR(
    `useCoingeckoPrices`,
    fetcher,
    {
      refreshInterval: COMMON_REFRESH_INTERVAL,
    }
  )

  useEffect(() => {
    refresh()
  }, symbols)

  if (!pricesMap) {
    return { pricesMap: new Map(), refresh }
  }

  return { pricesMap, refresh }
}
