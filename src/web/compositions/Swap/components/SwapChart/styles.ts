import { BORDER_RADIUS } from '@variables/variables'
import styled from 'styled-components'

import { RowContainer } from '@sb/compositions/AnalyticsRoute/index.styles'

export const SwapChartContainer = styled(RowContainer)`
  height: 100%;
  padding: 1em 0 1em 1em;
  border: 1px solid ${(props) => props.theme.colors.white6};
  border-right: none;
  border-radius: 16px 0 0 16px;
`

export const CrossSwapChartContainer = styled(RowContainer)`
  border: 1px solid ${({ theme }) => theme.colors.yellow4};
  border-right: 0;
  border-top-left-radius: ${BORDER_RADIUS.lg};
  border-bottom-left-radius: ${BORDER_RADIUS.lg};
`
