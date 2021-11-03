import { ReactNode } from "react";

export interface DataHead {
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
  ASC,
  DESC
}

export type DataCellValues<E = any> = {
  fields: { [c: string]: DataCellValue }
  extra?: E
}

export interface DataTableProps<E> { // TODO: extract column names & pass to values 
  cells: DataHead[]
  data: DataCellValues<E>[]
  defaultSortColumn?: string
  defaultSortOrder?: SORT_ORDER
  name: string
  expandableContent?: (cell: DataCellValues<E>) => ReactNode
}