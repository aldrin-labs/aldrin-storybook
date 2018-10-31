import { WithStyles, Theme, WithTheme } from '@material-ui/core'
import React from 'react'

type T = string | number
type TObj = {
  render: string
  color: string
  variant: 'body' | 'head' | 'footer'
  isNumber: boolean
  style: any
  // if you wrap you render with JSX but still want to use
  //  out-of-the-box sort put value to sort into content
  contentToSort: string | number
}

export type HeadCell = TObj & {
  sortBy: 'number' | 'date' | 'default' | (() => number)
}

export type Cell = T & TObj

export type OnChange = (id: number) => void

export type OnChangeWithEvent = (e: React.ChangeEvent<HTMLInputElement>) => void

export type Row = Cell[]
export type ExtendableRow = Cell[]

export type Rows = { head: HeadCell[]; body: Row[]; footer: Row }

export type sortTypes = {
  sortColumn: number | null
  sortDirection: 'asc' | 'desc'
  sortHandler: (index: number) => void
}

export interface Props extends WithStyles {
  withCheckboxes?: boolean
  expandableRows?: boolean
  theme: Theme
  // removes animation from checkbox
  staticCheckbox?: boolean
  padding: 'default' | 'checkbox' | 'dense' | 'none'
  rows?: Rows
  checkedRows?: number[]
  expandedRows?: number[]
  title?: string | number
  onChange?: OnChange & OnChangeWithEvent
  onSelectAllClick?: OnChange & OnChangeWithEvent
  // Shadow depth, corresponds to dp in the spec. It's accepting values between 0 and 24 inclusive.
  elevation?: number
  sort: sortTypes | undefined
}
