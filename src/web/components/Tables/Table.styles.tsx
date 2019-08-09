import styled from 'styled-components'
import { Table, TableSortLabel, TablePagination, withStyles } from '@material-ui/core'

export const StyledTable = styled(Table)`
  td:first-child {
    padding: 0.75rem 1rem 0.75rem 0.75rem !important;
  }

  th:first-child {
    padding: 0.75rem 1rem 0.75rem 0.75rem;
  }
`

export const StyledTableSortLabel = withStyles({
  icon: {
    display: 'none',
  },
  active: {
      '& $icon': {
          display: 'inline',
      },
  }
})(TableSortLabel)

export const StyledTablePagination = withStyles({
  caption: {
    fontSize: '1.175rem'
  }
})(TablePagination)
