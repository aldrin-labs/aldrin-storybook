import { WithStyles } from '@material-ui/core'
import React from 'react'

type T = string | number
type TObj = {
  render: string
  color: string
  isNumber: boolean
  style: any
}

export type Cell = T & TObj

export type OnChange = (
  e: React.ChangeEvent<HTMLInputElement>,
  id: number
) => void

export type Row = Cell[]

export interface Props extends WithStyles {
  withCheckboxes?: boolean
  // removes animation from checkbox
  staticCheckbox?: boolean
  // use NaN if you want to select nothing
  expandedRow?: number
  padding: 'default' | 'checkbox' | 'dense' | 'none'
  rows?: { head: TObj[]; body: Row[]; footer: Row }
  checkedRows?: number[]
  title?: string | number
  onChange?: OnChange
  onSelectAllClick?: (e: React.ChangeEvent<HTMLInputElement>) => void
  // Shadow depth, corresponds to dp in the spec. It's accepting values between 0 and 24 inclusive.
  elevation?: number
}
