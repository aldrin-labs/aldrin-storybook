import { TokenInfo, TokenListProvider } from '@solana/spl-token-registry'
import React, { useContext, useEffect, useState } from 'react'
import { clusterForEndpoint } from './clusters'
import { useConnectionConfig } from './connection'

type TokenListContext = {
  tokenInfos: Map<string, TokenInfo>
}
const TokenListContext = React.createContext<TokenListContext>({ tokenInfos: new Map() })

export function useTokenInfos() {
  const { tokenInfos } = useContext(TokenListContext)
  return tokenInfos
}

export const TokenRegistryProvider: React.FC = (props) => {
  const { endpoint } = useConnectionConfig()
  const [tokenInfos, setTokenInfos] = useState(new Map<string, TokenInfo>())

  useEffect(() => {
    const tokenListProvider = new TokenListProvider()
    tokenListProvider.resolve().then((tokenListContainer) => {
      const cluster = clusterForEndpoint(endpoint)

      const filteredTokenListContainer = tokenListContainer?.filterByClusterSlug(
        cluster?.name
      )

      const tokenInfos =
        tokenListContainer !== filteredTokenListContainer
          ? filteredTokenListContainer?.getList()
          : [] // Workaround for filter return all on unknown slug

      setTokenInfos(
        tokenInfos.reduce((map, item) => {
          map.set(item.address, item)
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
