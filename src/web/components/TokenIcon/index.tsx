import React, { useEffect, useState } from 'react'
import { TokenListProvider, TokenInfo } from '@solana/spl-token-registry'
import CoinPlaceholder from '@icons/coinPlaceholder.svg'
import { SvgIcon } from '@sb/components'

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

  if (!mint)
    return <SvgIcon src={CoinPlaceholder} height={height} width={width} />
  const token = tokenMap.get(mint)
  if (!token || !token.logoURI)
    return <SvgIcon src={CoinPlaceholder} height={height} width={width} />

  return (
    <img src={token.logoURI} style={{ height, width, borderRadius: '50%' }} />
  )
}
