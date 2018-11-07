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

const stableSort = (array: RowContent[], cmp: (a: any, b: any) => number) => {
  const flatten = (a: Cell) =>
    isObject(a) && has(a, 'contentToSort')
      ? (a as TObj).contentToSort
      : has(a, 'render')
        ? (a as TObj).render
        : (a as T)
  const stabilizedThis = array.map((el, index) => [el, index])
  stabilizedThis.sort((a: any, b: any) => {
    const fa: any = flatten(a)
    const fb: any = flatten(b)

    const order = cmp(fa[0], fb[0])
    if (order !== 0) return order
    return fa[1] - fb[1]
  })

  return stabilizedThis.map((el) => el[0])
}

const getSorting = (order: SortDirection, orderBy: string) => {
  return order === 'desc'
    ? (a: any, b: any) => desc(a, b, orderBy)
    : (a: any, b: any) => -desc(a, b, orderBy)
}

const desc = (a: Content, b: Content, orderBy: string): number => {
  if (b[orderBy] < a[orderBy]) {
    return -1
  }
  if (b[orderBy] > a[orderBy]) {
    return 1
  }
  return 0
}

export default class Sort extends React.Component<TableProps> {
  state: SortState = {
    sortColumn: '',
    sortDirection: 'desc',
  }
  sortHandler = (column: string) => {
    this.setState((prevState: SortState) => {
      let sortDirection = prevState.sortDirection
      if (prevState.sortColumn !== column) {
        sortDirection = 'desc'
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
