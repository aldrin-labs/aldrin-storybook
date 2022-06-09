import styled from 'styled-components'

import { Row } from '@sb/compositions/AnalyticsRoute/index.styles'

export const BlockTemplate = styled(Row)`
  // box-shadow: 0px 0px 48px rgba(0, 0, 0, 0.55);
  background: ${(props) => props.theme.colors[props.background || 'gray6']};
  border-radius: 1.6rem;
`

export const TableSwitcherWrap = styled.div`
  min-height: 60px;
`
