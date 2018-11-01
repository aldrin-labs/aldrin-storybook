import { WithStyles, Theme, WithTheme } from '@material-ui/core'
import React from 'react'

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

export type OnChange = (id: number) => void

export type OnChangeWithEvent = (e: React.ChangeEvent<HTMLInputElement>) => void

// ToDo
// change data structure
// for expandedRows

export type RowContent = {
  [key: string]: Cell
} & { id: string } & {
  expandableContent?: ExpandedContent[]
}

export type Options = {
  // default 'body'
  variant?: 'body' | 'footer' | 'head'
}

export type ExpandedContent = RowContent & { id: string } & {
  options?: Options
}

export type Row = RowContent & { options?: Options }

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
  theme: Theme
  // removes animation from checkbox
  staticCheckbox?: boolean
  padding: 'default' | 'checkbox' | 'dense' | 'none'
  data: Rows
  columnNames: Head[]
  checkedRows?: string[]
  expandedRows?: string[]
  title?: string | number
  onChange?: OnChange & OnChangeWithEvent
  onSelectAllClick?: OnChange & OnChangeWithEvent
  // Shadow depth, corresponds to dp in the spec. It's accepting values between 0 and 24 inclusive.
  elevation?: number
  sort: sortTypes | undefined
}
