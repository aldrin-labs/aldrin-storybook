import { WithStyles, Theme } from '@material-ui/core'
import React from 'react'

export type renderCellType = {
  cell: Cell
  id: string
  numeric: boolean
  variant?: 'body' | 'footer' | 'head'
}

type T = string | number
export type TObj = {
  render?: string | number
  color?: string
  variant?: 'body' | 'head' | 'footer'
  isNumber?: boolean
  style?: any
  // if you wrap you render with JSX but still want to use
  //  out-of-the-box sort put value to sort into content
  contentToSort?: string | number
}

export type HeadCell = TObj & {
  sortBy: 'number' | 'date' | 'default' | (() => number)
}

export type Cell = T | TObj

export type OnChange = (id: string) => void

export type OnChangeWithEvent = (e: React.ChangeEvent<HTMLInputElement>) => void

// ToDo
// change data structure
// for expandedRows

export type RowContent =
  | {
      [key: string]: Cell
    }
  | {
      expandableContent?: NotExpandableRow[]
    }

export type Options = {
  // implemented only for footer
  static?: true
  // default 'body'
  variant?: 'body' | 'footer' | 'head'
}

export type Row = RowContent & { options?: Options } & { id: string }
export type NotExpandableRow = {
  [key: string]: Cell
} & { options?: Options } & { id: string }

export type Rows = { body: Row[]; footer?: Row[] }

export type sortTypes = {
  sortColumn: number | null
  sortDirection: 'asc' | 'desc'
  sortHandler: (index: number) => void
}

export type Head = {
  id: string
  isNumber?: boolean
  disablePadding?: boolean
  label: string
  style?: object
}

export interface Props extends WithStyles {
  withCheckboxes?: boolean
  expandableRows?: boolean
  theme?: Theme
  // removes animation from checkbox
  staticCheckbox?: boolean
  padding: 'default' | 'checkbox' | 'dense' | 'none'
  data: Rows
  columnNames: Head[]
  checkedRows?: string[]
  expandedRows?: string[]
  title?: string | number
  onChange?: OnChange | OnChangeWithEvent
  onSelectAllClick?: OnChange & OnChangeWithEvent
  // Shadow depth, corresponds to dp in the spec. It's accepting values between 0 and 24 inclusive.
  elevation?: number
  sort: sortTypes | undefined
}
