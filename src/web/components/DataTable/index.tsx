import React from 'react'
import { DataTableProps } from './types'
import { Table, Thead, Tbody, Th, Tr, Td, ThContent } from './styles'
import { Hint } from './components/HInt'

export * from './types'

export function DataTable<E>(props: DataTableProps<E>) {
  const { cells, data, name } = props
  return (
    <Table>
      <Thead>
        {cells.map((c) =>
          <Th key={`datatable_${name}_head_${c.key}`}>
            <ThContent>
              {c.title}
              {c.hint && <Hint text={c.hint} />}
            </ThContent>
          </Th>
        )}
      </Thead>
      <Tbody>
        {data.map((row, idx) =>
          <Tr key={`datatable_${name}_row_${idx}`}>
            {cells.map(({ key }) =>
              <Td key={`datatable_${name}_cell_${idx}_${key}`}>
                {!!row.fields[key] &&
                  <>
                    {row.fields[key].rendered || row.fields[key].rawValue}
                  </>
                }
              </Td>
            )}
          </Tr>
        )}
      </Tbody>
    </Table>
  )
}