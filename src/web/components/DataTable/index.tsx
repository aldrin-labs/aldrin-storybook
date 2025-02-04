import React, { useMemo } from 'react'
import { Column, Table } from 'react-virtualized'
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer'

import 'react-virtualized/styles.css'
import { DefaultTheme, useTheme } from 'styled-components'

import { useLocalStorageState } from '@sb/dexUtils/utils'

import { InlineText } from '../Typography'
import { Hint, SortButton } from './components'
import { NoDataBlock } from './styles'
import { DataTableProps, DataTableState, SORT_ORDER } from './types'
import { nextSortOrder, sortData } from './utils'

export * from './types'

const rowStyle = (theme: DefaultTheme) => ({
  outline: 'none',
  cursor: 'pointer',
  fontSize: '16px',
  borderBottom: `1px solid ${theme.colors.border}`,
  overflow: 'initial',
})

const headerStyle = {
  textTransform: 'capitalize',
  fontWeight: 400,
  fontSize: '0.8em',
  textAlign: 'left',
  display: 'flex',
  alignItems: 'center',
}

const noRowsStyles = {
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
}

const TABLE_HEIGHT = 600
const MOBILE_WIDTH = 800
const HEADER_HEIGHT = 40
const ROW_HEIGHT = 100

export const DataTable = <E,>(props: DataTableProps<E>) => {
  const { columns, data, name, onRowClick, noDataText } = props

  const [state, setState] = useLocalStorageState<DataTableState>(
    `dtable_${name}`,
    {
      sort: {
        field: 'tvl',
        direction: SORT_ORDER.DESC,
      },
    }
  )

  const sortedData = useMemo(
    () => sortData(data, state.sort.field, state.sort.direction),
    [state.sort, data]
  )

  const theme = useTheme()
  const preparedStyle = rowStyle(theme)

  return (
    <AutoSizer disableHeight>
      {({ width }) => (
        <Table
          className={name}
          width={Math.max(MOBILE_WIDTH, width)}
          height={
            sortedData.length
              ? Math.min(
                  TABLE_HEIGHT,
                  HEADER_HEIGHT + sortedData.length * ROW_HEIGHT
                )
              : HEADER_HEIGHT + ROW_HEIGHT * 2
          }
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
            state.sort.direction === SORT_ORDER.NONE
              ? undefined
              : state.sort.direction
          }
          rowCount={sortedData.length}
          noRowsRenderer={() => <div style={noRowsStyles}>{noDataText}</div>}
          onRowClick={onRowClick}
          rowStyle={preparedStyle}
          headerHeight={HEADER_HEIGHT}
          rowHeight={ROW_HEIGHT}
          rowGetter={({ index }) => sortedData[index]}
        >
          {columns.map((item) => {
            return (
              <Column
                key={item.key}
                label={item.title}
                columnData={item}
                dataKey={item.key}
                headerRenderer={({ label, columnData }) => (
                  <>
                    <InlineText>{label}</InlineText>
                    {columnData.hint && <Hint text={columnData.hint} />}
                    <SortButton
                      sortOrder={state.sort.direction}
                      sortColumn={state.sort.field}
                      columnName={item.key}
                    />
                  </>
                )}
                headerStyle={headerStyle}
                width={item.getWidth ? item.getWidth(width) : width}
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

export { NoDataBlock }
