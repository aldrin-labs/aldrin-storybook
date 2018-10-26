import React from 'react'
import Table from '.'
import { Props as TableProps, HeadCell, Cell } from './index.types'
import { zip, isObject, has } from 'lodash-es'

interface Props extends TableProps {
  sort: {
    sortColumn: number | null
    sortDirection: 'up' | 'down'
  }
}
const decideSort = (cell: HeadCell, sortDirection: 'up' | 'down') => {
  const ascendingNumberSort = (a, b) => a - b
  const descendingNumberSort = (a, b) => b - a
  const ascendingDateSort = (a, b) => +new Date(a) - +new Date(b)
  const descendingDateSort = (a, b) => +new Date(b) - +new Date(a)

  if (cell.sortBy === 'number' || cell.isNumber) {
    return sortDirection === 'up' ? ascendingNumberSort : descendingNumberSort
  }

  if (cell.sortBy === 'date') {
    return sortDirection === 'up' ? ascendingDateSort : descendingDateSort
  }

  if (typeof cell.sortBy === 'function') {
    return cell.sortBy
  }

  return undefined
}

export default class Sort extends React.Component<Props> {
  render() {
    const {
      rows: RawRows,
      sort: { sortColumn, sortDirection },
    } = this.props

    const sortedBody = zip(...RawRows.body).map((column, ind) => {
      if (ind === sortColumn) {
        const sortFunction = decideSort(RawRows.head[ind], sortDirection)
        const flatColumn = column.map(
          (cell: Cell) =>
            isObject(cell) && has(cell, 'contentToSort')
              ? cell.contentToSort
              : has(cell, 'render')
                ? cell.render
                : cell
        )

        const sort = flatColumn.slice().sort(sortFunction)
        return sortDirection === 'up' ? sort.reverse() : sort
      }

      return column
    })
    const rows = {
      head: RawRows.head,
      footer: RawRows.footer,
      body: zip(...sortedBody),
    }

    console.log(rows.body)
    return <Table {...{ ...this.props, rows }} />
  }
}
