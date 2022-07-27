import styled from 'styled-components'

import { RowContainer } from '@sb/compositions/AnalyticsRoute/index.styles'

export const SwapChartContainer = styled(RowContainer)`
  height: 100%;
  padding: 1em;
  border: 1px solid ${(props) => props.theme.colors.white6};
  border-radius: 16px;
`
