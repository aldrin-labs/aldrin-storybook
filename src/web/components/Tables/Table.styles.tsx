import styled from 'styled-components'
import {
  Table,
  TableSortLabel,
  TablePagination,
  withStyles,
} from '@material-ui/core'

export const StyledTable = styled(Table)`
  td:first-child {
    padding: 0.75rem 1rem 0.75rem 0.75rem;
  }

  th:first-child {
    padding: 0.75rem 1rem 0.75rem 0.75rem;
  }
`

export const StyledTableSortLabel = withStyles({
  root: {
    position: 'relative',
    color: 'inherit !important',
  },
  icon: {
    display: 'none',
  },
  active: {
    color: 'inherit',
    '& $icon': {
      display: 'inline',
      position: 'absolute',
      left: '100%',
    },
  },
})(TableSortLabel)

export const StyledTablePagination = withStyles({
  toolbar: {
    height: '3rem',
    minHeight: 0,
  },
  caption: {
    fontSize: '1.175rem',
  },
})(TablePagination)
