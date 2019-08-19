import { Theme, PropTypes } from '@material-ui/core'
import React, { CSSProperties } from 'react'
// import { SvgIconProps } from '@material-ui/core/SvgIcon'
import { Padding } from '@material-ui/core/TableCell'
import { Classes } from 'jss'

export type renderCellType = {
  cell: Cell
  id: string
  numeric: boolean
  padding?: Padding
  variant?: 'body' | 'footer' | 'head'
  tableStyles?: TableStyles
}

export type T = string | number
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

export type Cell = T | TObj

export type OnChange = (id: string) => void

export type OnChangeWithEvent = (e: React.ChangeEvent<HTMLInputElement>) => void

// ToDo
// change data structure
// for expandedRows

export type Content = {
  [key: string]: Cell
}

export type RowContent =
  | Content
  | {
      expandableContent?: ReadonlyArray<NotExpandableRow>
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
} & { options?: Options } & { id: string } & { contentToSort?: string }

export type Data = { body: ReadonlyArray<Row>; footer?: ReadonlyArray<Row> }

export type sortTypes = {
  sortColumn: string | null
  sortDirection: 'asc' | 'desc'
  sortHandler: (id: string) => void
}

export type defaultSortTypes = {
  sortColumn: string
  sortDirection: 'asc' | 'desc'
}

export type Head = {
  // id should be equal to shape of body element  to enable sorting by default
  id: string
  isNumber?: boolean
  disablePadding?: boolean
  label: string
  style?: object
  sortBy?: 'default' | (() => number)
  isSortable: boolean
}

export type action = {
  readonly onClick: (event: React.MouseEvent<HTMLElement>) => void
  readonly id: string
  readonly style: object
  readonly icon: React.ReactElement<any>
  readonly color?: PropTypes.Color
  readonly withoutHover?: boolean
}

export type TableStyles = {
  heading?: CSSProperties
  title?: CSSProperties
  cell?: CSSProperties
  tab?: CSSProperties
}

export interface Props {
  classes?: Classes
  withCheckboxes?: boolean
  expandableRows?: boolean
  className?: string
  theme?: Theme
  id?: string
  // removes animation from checkbox
  staticCheckbox?: boolean
  padding?: Padding
  data?: Data
  columnNames?: ReadonlyArray<Head>
  checkedRows?: ReadonlyArray<string>
  expandedRows?: ReadonlyArray<string>
  expandAllRows: boolean
  title?: string | number | React.ReactElement<any>
  onChange?: OnChange | OnChangeWithEvent
  onSelectAllClick?: OnChange & OnChangeWithEvent
  // Shadow depth, corresponds to dp in the spec. It's accepting values between 0 and 24 inclusive.
  elevation?: number
  sort?: sortTypes | undefined
  defaultSort?: defaultSortTypes | undefined
  pagination?: Pagination
  actions?: ReadonlyArray<action>
  // how long will be cell with actions
  actionsColSpan?: number
  borderBottom?: boolean
  rowsWithHover?: boolean
  rowWithHoverBorderRadius?: boolean
  emptyTableText?: string
  tableStyles?: TableStyles
  onTrClick?: () => null
  style?: CSSProperties
}

export type Pagination = {
  enabled: boolean
  handleChangeRowsPerPage: () => void
  handleChangePage: () => void
  rowsPerPageOptions: number[]
  rowsPerPage: number
  // start from  0
  page: number
  fakePagination: boolean
  totalCount: number | null
}

export type PaginationFunctionType = (
  data: ReadonlyArray<any>,
  pagination: Pagination
) => ReadonlyArray<any>
