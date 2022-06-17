import styled from 'styled-components'

import { Row, RowContainer } from '../AnalyticsRoute/index.styles'

export const TableContainer = styled(RowContainer)`
  align-items: flex-start;
  min-height: 30rem;
  max-height: 60rem;
  border-radius: 1.5rem;
  position: relative;
`

export const TableWithTitleContainer = styled(Row)`
  width: 70%;

  @media (max-width: 600px) {
    width: 80%;
  }
`
