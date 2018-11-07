import React from 'react'
import Table from '../'
import { zip, isObject, has } from 'lodash-es'

import { Props as TableProps, Head } from '../index.types'
import { SortState } from './index.types'

const decideSort = (cell: Head, sortDirection: 'asc' | 'desc') => {
  const flatten = (a) =>
    isObject(a) && has(a, 'contentToSort')
      ? a.contentToSort
      : has(a, 'render')
        ? a.render
        : a

  const ascendingNumberSort = (a, b) => flatten(a) - flatten(b)
  const descendingNumberSort = (a, b) => flatten(b) - flatten(a)
  const ascendingDateSort = (a, b) =>
    +new Date(flatten(a)) - +new Date(flatten(b))
  const descendingDateSort = (a, b) =>
    +new Date(flatten(b)) - +new Date(flatten(a))

  if (cell.sortBy === 'number' || cell.isNumber) {
    return sortDirection === 'asc' ? ascendingNumberSort : descendingNumberSort
  }

  if (cell.sortBy === 'date') {
    return sortDirection === 'asc' ? ascendingDateSort : descendingDateSort
  }

  if (typeof cell.sortBy === 'function') {
    return cell.sortBy
  }

  return (a, b) => {
    const flatA = flatten(a).toUpperCase()
    const flatB = flatten(b).toUpperCase()

    if (flatA < flatB) {
      return -1
    }
    if (flatA > flatB) {
      return 1
    }

    // must be equal
    return 0
  }
}

export default class Sort extends React.Component<TableProps> {
  state: SortState = {
    sortColumn: null,
    sortDirection: 'desc',
  }
  sortHandler = (column: number) => {
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

    const sortedBody = zip(
      ...RawRows.body.map((row) => Object.values(row))
    ).map((column, ind) => {
      if (ind === sortColumn) {
        const sortFunction = decideSort(columnNames[ind], sortDirection)

        const sort = column.slice().sort(sortFunction)
        return sortDirection === 'asc' ? sort.reverse() : sort
      }

      return column
    })
    const rows = {
      head: RawRows.head,
      footer: RawRows.footer,
      body: zip(...sortedBody),
    }

    return (
      <Table
        {...{
          ...this.props,
          rows,
          sort: {
            sortHandler: this.sortHandler,
            ...this.state,
          },
        }}
      />
    )
  }
}
