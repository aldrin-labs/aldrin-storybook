import React, { useState } from 'react'
import { DataTableProps, DataTableState, SORT_ORDER } from './types'
import {
  Table,
  Thead,
  Tbody,
  Th,
  Tr,
  Td,
  ThContent,
  NoDataBlock,
  TableBody,
} from './styles'
import { Hint, SortButton } from './components'
import { useLocalStorageState } from '../../dexUtils/utils'
import { sortData, nextSortOrder } from './utils'

export * from './types'

const nop = () => {}

export function DataTable<E>(props: DataTableProps<E>) {
  const {
    columns,
    data,
    name,
    defaultSortColumn = '',
    defaultSortOrder = SORT_ORDER.NONE,
    expandableContent,
    onRowClick = nop,
    noDataText,
  } = props
  const [state, setState] = useLocalStorageState<DataTableState>(`dt_${name}`, {
    sortColumn: defaultSortColumn,
    sortOrder: defaultSortOrder,
  })

  const [expandedIdx, setExpandedIdx] = useState<number | null>(null)

  const isExpandable = !!expandableContent

  const sortedData = sortData(data, state.sortColumn, state.sortOrder)

  const setSort = (column: string) => {
    setExpandedIdx(null)
    if (column !== state.sortColumn) {
      setState({ ...state, sortColumn: column, sortOrder: SORT_ORDER.DESC })
    } else {
      setState({ ...state, sortOrder: nextSortOrder(state.sortOrder) })
    }
  }

  const setExpanded = (idx: number) => {
    if (expandedIdx === idx) {
      setExpandedIdx(null)
    } else {
      setExpandedIdx(idx)
    }
  }

  const cols = columns.length + (isExpandable ? 1 : 0)

  return (
    <TableBody>
      <Table>
        <Thead>
          <Tr>
            {columns.map((c) => (
              <Th
                className={`${c.sortable ? 'sortable ' : ''}`}
                key={`datatable_${name}_head_${c.key}`}
              >
                <ThContent onClick={c.sortable ? () => setSort(c.key) : nop}>
                  {c.title}
                  {c.hint && <Hint text={c.hint} />}
                  {c.sortable && (
                    <SortButton
                      sortOrder={state.sortOrder}
                      sortColumn={state.sortColumn}
                      columnName={c.key}
                    />
                  )}
                </ThContent>
              </Th>
            ))}
            {isExpandable && <Th />}
          </Tr>
        </Thead>
        <Tbody>
          {sortedData.map((row, idx) => (
            // eslint-disable-next-line react/no-array-index-key
            <React.Fragment key={`datatable_${name}_row_${idx}`}>
              <Tr onClick={(e) => onRowClick(e, row)}>
                {columns.map(({ key }) => (
                  // eslint-disable-next-line react/no-array-index-key
                  <Td key={`datatable_${name}_cell_${idx}_${key}`}>
                    {!!row.fields[key] && (
                      <>
                        {row.fields[key].rendered || row.fields[key].rawValue}
                      </>
                    )}
                  </Td>
                ))}
                {isExpandable && (
                  <Td onClick={() => setExpanded(idx)}>Details</Td>
                )}
              </Tr>
              {!!expandableContent && expandedIdx === idx && (
                <Tr>
                  <Td colSpan={cols}>{expandableContent(row)}</Td>
                </Tr>
              )}
            </React.Fragment>
          ))}
          {sortedData.length === 0 && (
            <Tr className="no-hover">
              <Td colSpan={cols}>
                {noDataText || (
                  <NoDataBlock justifyContent="center">No data</NoDataBlock>
                )}
              </Td>
            </Tr>
          )}
        </Tbody>
      </Table>
    </TableBody>
  )
}

export { NoDataBlock }
