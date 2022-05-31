import { ReactNode } from 'react'

export interface DataHeadColumn {
  key: string
  sortable?: boolean
  hint?: ReactNode
  title: ReactNode
  getWidth?: (width: number) => number
}

export interface DataCellValue {
  rawValue: string | number | boolean
  rendered?: ReactNode
}

export enum SORT_ORDER {
  ASC = 'ASC',
  DESC = 'DESC',
  NONE = 'NONE',
}

export type DataCellValues<E = undefined> = {
  fields: { [c: string]: DataCellValue }
  extra: E
}

export interface DataTableProps<E> {
  // TODO: extract column names & pass to values
  columns: DataHeadColumn[]
  data: DataCellValues<E>[]
  sort?: {
    field: string
    direction: string
  }
  name: string
  expandableContent?: (row: DataCellValues<E>) => ReactNode
  onRowClick?: (
    rowData: DataCellValues<E>
  ) => void
  noDataText?: ReactNode
}

export interface DataTableState {
  sort: {
    field: string
    direction: SORT_ORDER.DESC | SORT_ORDER.ASC | SORT_ORDER.NONE
  }
}
