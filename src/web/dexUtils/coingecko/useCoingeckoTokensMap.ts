import useSWR from 'swr'

import { toMap } from '@core/collection'

type CoingeckoToken = {
  id: string
  symbol: string
  name: string
}

type CoingeckoTokensMap = Map<string, CoingeckoToken>

interface UseCoingeckoTokensMapResult {
  tokenBySymbolMap: CoingeckoTokensMap
  tokenByIdMap: CoingeckoTokensMap
  refresh: () => {}
}

export const useCoingeckoTokensMap = (): UseCoingeckoTokensMapResult => {
  const fetcher = async () => {
    const list = await fetch('https://api.coingecko.com/api/v3/coins/list')
    const listResponse: CoingeckoToken[] = await list.json()

    const tokenBySymbolMap = toMap(listResponse, (token) => token.symbol)
    const tokenByIdMap = toMap(listResponse, (token) => token.id)

    return { tokenBySymbolMap, tokenByIdMap }
  }

  const { data, mutate: refresh } = useSWR(`useCoingeckotTokenList`, fetcher)

  if (!data) {
    return {
      tokenBySymbolMap: new Map(),
      tokenByIdMap: new Map(),
      refresh,
    }
  }

  const { tokenBySymbolMap, tokenByIdMap } = data

  return {
    tokenBySymbolMap,
    tokenByIdMap,
    refresh,
  }
}
