import styled from 'styled-components'

import { Row } from '../../../AnalyticsRoute/index.styles'

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  // table-layout: fixed;
`
export const TableHeader = styled.thead`
  td {
    padding: 1rem 2rem;
  }
`

export const TableBody = styled.tbody`
  height: 90%;
  overflow: auto;
`

export const TableRow = styled.tr``

export const RowTd = styled.td`
  width: auto;
  padding: 0 2rem;
  font-family: 'Avenir Next';
  border-top: 0.2rem solid ${(props) => props.theme.colors.white4};
  color: #f5f5fb;
  font-size: 1.5rem;
`

export const TextColumnContainer = styled(Row)`
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-around;
  padding: 1rem 0;
`
