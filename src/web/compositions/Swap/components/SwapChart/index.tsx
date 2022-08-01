import React from 'react'
import useSWR from 'swr'

import { SvgIcon } from '@sb/components'
import { InlineText } from '@sb/components/Typography'
import { useTokenInfos } from '@sb/dexUtils/tokenRegistry'
import { useWallet } from '@sb/dexUtils/wallet'

import { CHARTS_API_URL, PROTOCOL } from '@core/utils/config'

import OHLCVCandlesIcon from '@icons/ohlcvCandles.svg'

import {
  CrossSwapChartContainer,
  EmptyOHLCVTextContainer,
  SwapChartAndPriceContainer,
  SwapChartContainer,
} from './styles'
import { SwapChartPrice } from './SwapChartPrice'
import { SwapChartProps } from './types'

const SwapChartWithPrice = (props: SwapChartProps) => {
  const {
    isCrossOHLCV,
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
    <>
      <SwapChartAndPriceContainer>
        <SwapChartPrice
          pricesMap={pricesMap}
          inputSymbol={inputSymbol}
          outputSymbol={outputSymbol}
          inputTokenMintAddress={inputTokenMintAddress}
          outputTokenMintAddress={outputTokenMintAddress}
        />
      </SwapChartAndPriceContainer>
      <SwapChartContainer>
        {isCrossOHLCV || !inputSymbol || !outputSymbol ? (
          <CrossSwapChartContainer direction="column" height="100%">
            <SvgIcon src={OHLCVCandlesIcon} />
            <EmptyOHLCVTextContainer>
              <InlineText size="md" color="yellow4">
                There is not enough data for this pair. Try later.
              </InlineText>
            </EmptyOHLCVTextContainer>
          </CrossSwapChartContainer>
        ) : (
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
        )}
      </SwapChartContainer>
    </>
  )
}

export { SwapChartWithPrice }
