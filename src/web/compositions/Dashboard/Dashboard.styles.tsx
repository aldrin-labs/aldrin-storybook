import styled from 'styled-components'
import { Row, RowContainer } from '../AnalyticsRoute/index.styles'

export const TableContainer = styled(RowContainer)`
  align-items: flex-start;
  min-height: 30rem;
  max-height: 60rem;
  background: #222429;
  border-radius: 1.5rem;
  position: relative;
  box-shadow: 0px 0px 0.8rem rgba(0, 0, 0, 0.45);
`

export const TableWithTitleContainer = styled(Row)`
  width: 70%;

  @media (max-width: 600px) {
    width: 80%;
  }
`
