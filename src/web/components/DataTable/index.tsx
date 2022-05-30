import { withTheme } from '@material-ui/core/styles'
import React, { useEffect, useState } from 'react'
import { Column, Table } from 'react-virtualized'
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer'

import 'react-virtualized/styles.css'
import { useLocalStorageState } from '@sb/dexUtils/utils'

import { Hint, SortButton } from './components'
import { NoDataBlock } from './styles'
import {
  DataCellValues,
  DataTableProps,
  DataTableState,
  SORT_ORDER,
} from './types'
import { nextSortOrder, sortData } from './utils'

export * from './types'

const DataTablePure = <E,>(props: DataTableProps<E & { theme: any }>) => {
  const { columns, data, name, onRowClick, noDataText } = props

  const [state, setState] = useLocalStorageState<DataTableState>(`dt_${name}`, {
    sort: {
      field: 'tvl',
      direction: SORT_ORDER.DESC,
    },
  })
  const [sortedData, setSortedData] = useState<DataCellValues<E>[]>([])

  useEffect(() => {
    setSortedData(sortData(data, state.sort.field, state.sort.direction))
  }, [state.sort])

  return (
    <AutoSizer>
      {({ height, width }) => (
        <Table
          width={width > 800 ? width : 800}
          height={height}
          sort={({ sortBy: field }) => {
            const nextDirection = nextSortOrder(state.sort.direction)

            setState({
              ...state,
              sort: {
                field,
                direction: nextDirection,
              },
            })
          }}
          sortBy={state.sort.field}
          sortDirection={
            state.sort.direction === 'NONE' ? undefined : state.sort.direction
          }
          rowCount={sortedData.length}
          noRowsRenderer={() => <>{noDataText}</>}
          onRowClick={onRowClick}
          rowStyle={{
            outline: 'none',
            cursor: 'pointer',
            fontSize: '16px',
            borderBottom: `1px solid rgb(46, 46, 46)`,
            overflow: 'initial',
          }}
          headerHeight={40}
          rowHeight={100}
          rowGetter={({ index }) => sortedData[index]}
        >
          {columns.map((item) => {
            let columnWidth = width

            if (item.key === 'pool') {
              columnWidth *= 2
            } else if (item.key === 'tvl') {
              columnWidth *= 2
            }

            return (
              <Column
                key={item.key}
                label={item.title}
                columnData={item}
                dataKey={item.key}
                headerRenderer={({ label, columnData }) => (
                  <>
                    {label}
                    {columnData.hint && <Hint text={columnData.hint} />}
                    <SortButton
                      sortOrder={state.sort.direction}
                      sortColumn={state.sort.field}
                      columnName={item.key}
                    />
                  </>
                )}
                headerStyle={{
                  textTransform: 'capitalize',
                  fontWeight: 400,
                  fontSize: '0.8em',
                  textAlign: 'left',
                  display: 'flex',
                }}
                width={columnWidth}
                cellRenderer={({ rowData, dataKey }) =>
                  rowData.fields[dataKey].rendered ||
                  rowData.fields[dataKey].rawValue
                }
              />
            )
          })}
        </Table>
      )}
    </AutoSizer>
  )
}

export const DataTable = withTheme()(DataTablePure)

export { NoDataBlock }
