import React, { useEffect, useState } from 'react'
import { TokenListProvider, TokenInfo } from '@solana/spl-token-registry'
import CoinPlaceholder from '@icons/coinPlaceholder.svg'

export const TokenIcon = ({
  mint,
  height,
  width,
}: {
  mint?: string | null
  height?: string
  width?: string
}) => {
  const [tokenMap, setTokenMap] = useState<Map<string, TokenInfo>>(new Map())

  useEffect(() => {
    new TokenListProvider().resolve().then((tokens) => {
      const tokenList = tokens.filterByClusterSlug('mainnet-beta').getList()

      setTokenMap(
        tokenList.reduce((map, item) => {
          map.set(item.address, item)
          return map
        }, new Map())
      )
    })
  }, [setTokenMap])

  if (!mint) return <img src={CoinPlaceholder} style={{ height, width }} />
  const token = tokenMap.get(mint)
  if (!token || !token.logoURI)
    return <img src={CoinPlaceholder} style={{ height, width }} />

  return <img src={token.logoURI} style={{ height, width, borderRadius: '50%' }} />
}
