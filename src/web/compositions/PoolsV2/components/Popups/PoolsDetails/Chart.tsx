import React from 'react'
import useSWR from 'swr'

import { useTokenInfos } from '@sb/dexUtils/tokenRegistry'
import { useWallet } from '@sb/dexUtils/wallet'

import { CHARTS_API_URL, PROTOCOL } from '@core/utils/config'

import { Row } from '../index.styles'

interface SwapChartProps {
  marketType: number
  inputTokenMintAddress: string
  outputTokenMintAddress: string
}

export const PoolsChart = (props: SwapChartProps) => {
  const { marketType, inputTokenMintAddress, outputTokenMintAddress } = props

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
    <Row width="100%" height="100%">
      <iframe
        allowFullScreen
        style={{ borderWidth: 0 }}
        src={`${PROTOCOL}//${CHARTS_API_URL}/?symbol=${inputSymbol}/${outputSymbol}&marketType=${marketType}&exchange=serum&theme=pools-${themeMode}&isMobile=true${
          wallet.connected ? `&user_id=${wallet.publicKey}` : ''
        }`}
        height="100%"
        width="100%"
        id="tv_chart_serum"
        title="Chart"
        key={`${inputSymbol}/${outputSymbol}`}
      />
    </Row>
  )
}
