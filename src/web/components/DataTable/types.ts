import { ReactNode, SyntheticEvent } from "react";

export interface DataHeadColumn {
  key: string
  sortable?: boolean
  hint?: ReactNode
  title: ReactNode
}

export interface DataCellValue {
  rawValue: string | number | boolean
  rendered?: ReactNode
}

export enum SORT_ORDER {
  ASC = 'ASC',
  DESC = 'DESC',
  NONE = 'NONE'
}

export type DataCellValues<E = undefined> = {
  fields: { [c: string]: DataCellValue }
  extra: E
}

export interface DataTableProps<E> { // TODO: extract column names & pass to values 
  columns: DataHeadColumn[]
  data: DataCellValues<E>[]
  defaultSortColumn?: string
  defaultSortOrder?: SORT_ORDER
  name: string
  expandableContent?: (row: DataCellValues<E>) => ReactNode
  onRowClick?: (e: SyntheticEvent<HTMLTableRowElement>, row: DataCellValues<E>) => void
  noDataText?: ReactNode
}

export interface DataTableState {
  sortColumn: string
  sortOrder: SORT_ORDER
}