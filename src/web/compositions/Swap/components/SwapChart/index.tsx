import { BORDER_RADIUS } from '@variables/variables'
import React from 'react'
import styled from 'styled-components'
import useSWR from 'swr'

import { SvgIcon } from '@sb/components'
import { InlineText } from '@sb/components/Typography'
import { Row, RowContainer } from '@sb/compositions/AnalyticsRoute/index.styles'
import { useTokenInfos } from '@sb/dexUtils/tokenRegistry'
import { useWallet } from '@sb/dexUtils/wallet'

import { CHARTS_API_URL, PROTOCOL } from '@core/utils/config'

import OHLCVCandlesIcon from '@icons/ohlcvCandles.svg'

import { SwapChartPrice } from './SwapChartPrice'

interface SwapChartProps {
  isCrossOHLCV: boolean
  marketType: number
  inputTokenMintAddress: string
  outputTokenMintAddress: string
  pricesMap: Map<string, number>
}

const CrossSwapChartContainer = styled(RowContainer)`
  border: 1px solid ${({ theme }) => theme.colors.yellow7};
  border-right: 0;
  border-top-left-radius: ${BORDER_RADIUS.lg};
  border-bottom-left-radius: ${BORDER_RADIUS.lg};
`

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
      {isCrossOHLCV ? (
        <CrossSwapChartContainer direction="column" height="100%">
          <SvgIcon src={OHLCVCandlesIcon} />
          <Row margin="1em 0 0 0">
            <InlineText size="md" color="yellow7">
              There is not enough data for this pair. Try later.
            </InlineText>
          </Row>
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
    </RowContainer>
  )
}

export { SwapChartWithPrice }
