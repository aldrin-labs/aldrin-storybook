import { BORDER_RADIUS } from '@variables/variables'
import styled from 'styled-components'

import { Row } from '@sb/compositions/AnalyticsRoute/index.styles'

export const BlockTemplate = styled(Row)`
  background: ${(props) => props.theme.colors[props.background || 'white5']};
  border-radius: ${BORDER_RADIUS.lg};
`

export const TableSwitcherWrap = styled.div`
  min-height: 60px;
`
