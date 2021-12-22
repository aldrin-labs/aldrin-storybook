import { ReactNode } from 'react'
import { SORT_ORDER } from '..'

export interface SortButtonProps {
  sortOrder: SORT_ORDER
  sortColumn: string
  columnName: string
}

export interface HintProps {
  text: ReactNode
}
