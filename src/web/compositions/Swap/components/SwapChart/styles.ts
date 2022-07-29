import styled from 'styled-components'

import { RowContainer } from '@sb/compositions/AnalyticsRoute/index.styles'

export const SwapChartContainer = styled(RowContainer)`
  height: 90%;
  padding: 1em 0 1em 1em;
  border: 1px solid ${(props) => props.theme.colors.white6};
  border-right: none;
  border-radius: 16px 0 0 16px;
`
