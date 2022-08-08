import styled from 'styled-components'

import { Row } from '@sb/components/Layout'
import { InlineText } from '@sb/components/Typography'

export const SwapChartAndPriceContainer = styled(Row)`
  width: 100%;
  height: auto;
  margin: 0 0 1em 0;
`

export const SwapChartContainer = styled(Row)`
  width: 100%;
  height: 90%;
  padding: 1em 0 1em 1em;
  border: 1px solid
    ${(props) =>
      props.isCrossOHLCV
        ? props.theme.colors.yellow4
        : props.theme.colors.white6};
  border-right: none;
  border-radius: 16px 0 0 16px;
`

export const CrossSwapChartContainer = styled(Row)`
  width: 100%;
  height: 100%;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

export const SymbolText = styled(InlineText)`
  letter-spacing: -0.05em;
`

export const PricesSymbolsContainer = styled(Row)`
  width: 100%;
  justify-content: space-between;
`

export const TokenIconsContainer = styled(Row)`
  align-items: center;
`

export const EmptyOHLCVTextContainer = styled(Row)`
  margin: 1em 0 0 0;
  height: auto;
`
