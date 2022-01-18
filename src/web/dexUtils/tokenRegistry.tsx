import { TokenListProvider, TokenInfo } from '@solana/spl-token-registry'
import React, { useContext, useEffect, useState } from 'react'

import { clusterForEndpoint } from './clusters'
import { useConnectionConfig } from './connection'

const TokenListContext = React.createContext({
  tokenInfos: new Map<string, TokenInfo>(),
})

export function useTokenInfos() {
  const { tokenInfos } = useContext(TokenListContext)
  return tokenInfos
}

export function TokenRegistryProvider(props) {
  const { endpoint } = useConnectionConfig()
  const [tokenInfos, setTokenInfos] = useState(new Map())

  useEffect(() => {
    const tokenListProvider = new TokenListProvider()
    tokenListProvider.resolve().then((tokenListContainer) => {
      const cluster = clusterForEndpoint(endpoint)

      const filteredTokenListContainer =
        tokenListContainer?.filterByClusterSlug(cluster?.name)

      const tokenInfos =
        tokenListContainer !== filteredTokenListContainer
          ? filteredTokenListContainer?.getList()
          : [] // Workaround for filter return all on unknown slug

      setTokenInfos(
        tokenInfos.reduce((map, item) => {
          const parsedItem = {
            ...item,
            ...(item.symbol === 'soETH' ? { symbol: 'ETH' } : {}),
            name: item.name
              .replace('Cryptocurrencies.Ai', 'Aldrin')
              .replace('(Sollet)', ''), // TODO: found better way to resolve token names
          }
          map.set(item.address, parsedItem)
          return map
        }, new Map<string, TokenInfo>())
      )
    })
  }, [endpoint])

  return (
    <TokenListContext.Provider value={{ tokenInfos }}>
      {props.children}
    </TokenListContext.Provider>
  )
}
