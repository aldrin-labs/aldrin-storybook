import React from 'react'
import Table from '../'
import { isObject, has } from 'lodash-es'

import {
  Props as TableProps,
  RowContent,
  Cell,
  TObj,
  T,
  Content,
} from '../index.types'
import { SortState } from './index.types'
import { SortDirection } from '@material-ui/core/TableCell'

const stableSort = (
  array: ReadonlyArray<RowContent>,
  cmp: (a: any, b: any) => number
) => {
  const stabilizedThis = array.map((el, index) => [el, index])
  stabilizedThis.sort((a: any, b: any) => {
    const order = cmp(a[0], b[0])
    if (order !== 0) return order
    return a[1] - b[1]
  })

  return stabilizedThis.map((el) => el[0])
}

const getSorting = (order: SortDirection, orderBy: string) => {
  return order === 'desc'
    ? (a: any, b: any) => desc(a, b, orderBy)
    : (a: any, b: any) => -desc(a, b, orderBy)
}

const desc = (a: Content, b: Content, orderBy: string): number => {
  const flatten = (o: Cell) =>
    isObject(o) && has(o, 'contentToSort')
      ? (o as TObj).contentToSort
      : has(o, 'render')
      ? (o as TObj).render
      : (o as T)

  const fa = flatten(a[orderBy])
  const fb = flatten(b[orderBy])
  if (typeof fb === 'undefined' || typeof fa === 'undefined') {
    return 0
  }
  if (fb < fa) {
    return -1
  }
  if (fb > fa) {
    return 1
  }
  return 0
}

export default class Sort extends React.Component<TableProps> {
  state: SortState = {
    sortColumn: '',
    sortDirection: 'asc',
  }
  sortHandler = (column: string) => {
    this.setState((prevState: SortState) => {
      let sortDirection = prevState.sortDirection
      if (prevState.sortColumn !== column) {
        sortDirection = 'asc'
      } else {
        sortDirection = prevState.sortDirection === 'asc' ? 'desc' : 'asc'
      }

      return { sortDirection, sortColumn: column }
    })
  }

  render() {
    const { data: RawRows, columnNames } = this.props
    const { sortColumn, sortDirection } = this.state

    const result = {
      head: columnNames,
      data: {
        footer: RawRows.footer,
        body:
          stableSort(RawRows.body, getSorting(sortDirection, sortColumn)) || [],
      },
    }

    return (
      <Table
        {...{
          ...this.props,
          data: result.data,
          columnNames: result.head,
          sort: {
            sortHandler: this.sortHandler,
            ...this.state,
          },
        }}
      />
    )
  }
}
