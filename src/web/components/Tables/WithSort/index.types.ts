import { SortDirection } from '@material-ui/core/TableCell'

export interface SortState {
  sortDirection: SortDirection
  sortColumn: string
  defaultSort: defaultSortTypes
}

export type defaultSortTypes = {
  sortColumn: string
  sortDirection: 'asc' | 'desc'
}
