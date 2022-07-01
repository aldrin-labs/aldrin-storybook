import React from 'react'
import useSWR from 'swr'

import { RowContainer } from '@sb/compositions/AnalyticsRoute/index.styles'
import { useTokenInfos } from '@sb/dexUtils/tokenRegistry'
import { useWallet } from '@sb/dexUtils/wallet'

import { CHARTS_API_URL, PROTOCOL } from '@core/utils/config'

import { SwapChartPrice } from './SwapChartPrice'

interface SwapChartProps {
  marketType: number
  inputTokenMintAddress: string
  outputTokenMintAddress: string
  pricesMap: Map<string, number>
}

const SwapChartWithPrice = (props: SwapChartProps) => {
  const {
    marketType,
    inputTokenMintAddress,
    outputTokenMintAddress,
    pricesMap,
  } = props

  const { wallet } = useWallet()
  const tokenInfos = useTokenInfos()
  const { data: themeMode } = useSWR('theme')

  const { symbol: inputSymbol } = tokenInfos.get(inputTokenMintAddress) || {
    symbol: '',
  }

  const { symbol: outputSymbol } = tokenInfos.get(outputTokenMintAddress) || {
    symbol: '',
  }

  return (
    <RowContainer height="100%">
      <RowContainer margin="0 0 1em 0">
        <SwapChartPrice
          pricesMap={pricesMap}
          inputSymbol={inputSymbol}
          outputSymbol={outputSymbol}
          inputTokenMintAddress={inputTokenMintAddress}
          outputTokenMintAddress={outputTokenMintAddress}
        />
      </RowContainer>
      <iframe
        allowFullScreen
        style={{ borderWidth: 0 }}
        src={`${PROTOCOL}//${CHARTS_API_URL}/?symbol=${inputSymbol}/${outputSymbol}&marketType=${marketType}&exchange=serum&theme=swap-${themeMode}&isMobile=true${
          wallet.connected ? `&user_id=${wallet.publicKey}` : ''
        }`}
        height="100%"
        width="100%"
        id="tv_chart_serum"
        title="Chart"
        key={`${inputSymbol}/${outputSymbol}`}
      />
    </RowContainer>
  )
}

export { SwapChartWithPrice }
