import React, { PureComponent } from 'react'
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer';
import { Column, Table } from 'react-virtualized';
import 'react-virtualized/styles.css';

import { IProps } from './SpreadTable.types'
import { withErrorFallback } from '@core/hoc/withErrorFallback'
import { withTheme } from '@material-ui/styles'

import { getDataForTable, sortDesc, rowStyles } from '@core/utils/chartPageUtils'

import { TableWrapper } from '../../OrderBookTableContainer.styles'

@withTheme
class SpreadTable extends PureComponent<IProps> {
  render() {
    const {
      data,
      digits,
    } = this.props

    const tableData = getDataForTable(data, digits)
    const sortedData = sortDesc(tableData)

    return (
      <TableWrapper>
        <AutoSizer>
          {
            (({ width, height }: { width: number, height: number }) =>
              <Table
                disableHeader
                headerHeight={0}
                width={width}
                height={height}
                rowCount={sortedData.length}
                rowHeight={window.outerHeight / 60}
                // rowStyle={{ backgroundColor: '#000' }}
                rowGetter={({ index }) => sortedData[index]}>

                <Column label="Price" dataKey="price" width={width} style={{ ...rowStyles, color: '#29AC80' }} />
                <Column label="Size" dataKey="size" width={width} style={rowStyles} />
                <Column label="Total" dataKey="total" width={width} style={rowStyles} />
              </Table>
            )
          }
        </AutoSizer>
      </TableWrapper>
    )
  }
}

export default withErrorFallback(SpreadTable)
