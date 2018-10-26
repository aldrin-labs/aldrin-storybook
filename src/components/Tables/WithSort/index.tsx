import React from 'react'
import Table from '../'
import { Props as TableProps, HeadCell } from '../index.types'
import { zip, isObject, has } from 'lodash-es'

const decideSort = (cell: HeadCell, sortDirection: 'asc' | 'desc') => {
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
    const flatA = flatten(a).toascperCase()
    const flatB = flatten(b).toascperCase()

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
  render() {
    const {
      rows: RawRows,
      sort: { sortColumn, sortDirection },
    } = this.props

    const sortedBody = zip(...RawRows.body).map((column, ind) => {
      if (ind === sortColumn) {
        const sortFunction = decideSort(RawRows.head[ind], sortDirection)

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

    return <Table {...{ ...this.props, rows }} />
  }
}
