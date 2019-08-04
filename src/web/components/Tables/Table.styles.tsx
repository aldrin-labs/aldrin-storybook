import styled from 'styled-components'
import { Table } from '@material-ui/core'

export const StyledTable = styled(Table)`
  td:first-child {
    padding: 0.75rem 1rem 0.75rem 0.75rem !important;
  }

  th:first-child {
    padding: 0.75rem 1rem 0.75rem 0.75rem;
  }
`
