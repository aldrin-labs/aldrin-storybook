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

export type DataCellValues = { [c: string]: DataCellValue }

export interface DataTableProps { // TODO: extract column names & pass to values 
  cells: DataHead[]
  data: DataCellValues[]
  defaultSortColumn?: string
  defaultSortOrder?: SORT_ORDER
  name: string
}