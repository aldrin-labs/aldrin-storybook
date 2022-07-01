import React, { useState } from 'react'

import { useMarket, useMarketsList, getMarketInfos, useAllMarketsList } from '@sb/dexUtils/markets'

export function withMarketUtilsHOC(Component: React.ComponentType<any>) {
  return function WithMarketUtilsHOCComponent(props: any) {
    const { market, marketName, customMarkets, setCustomMarkets } = useMarket()

    const marketsList = useMarketsList()
    const markets = [...marketsList]

    const allMarketsMap = useAllMarketsList()
    const [handleDeprecated, setHandleDeprecated] = useState(false)
    const [addMarketVisible, setAddMarketVisible] = useState(false)

    return (
      <Component
        {...{
          market,
          marketName,
          customMarkets,
          setCustomMarkets,
          markets,
          handleDeprecated,
          setHandleDeprecated,
          addMarketVisible,
          setAddMarketVisible,
          getMarketInfos,
          allMarketsMap,
        }}
        {...props}
      />
    )
  }
}
