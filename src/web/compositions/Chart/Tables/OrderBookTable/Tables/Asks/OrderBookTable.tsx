import React, { PureComponent } from 'react'
import { withTheme } from '@material-ui/styles'

import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer';
import { Column, Table } from 'react-virtualized';
import 'react-virtualized/styles.css';

import { withErrorFallback } from '@core/hoc/withErrorFallback'
import { IProps } from './OrderBookTable.types'

import { sortDesc, getDataForTable, rowStyles } from '@core/utils/chartPageUtils'

import { TableWrapper } from '../../OrderBookTableContainer.styles'

@withTheme
class OrderBookTable extends PureComponent<IProps> {
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
                width={width}
                height={height}
                rowCount={sortedData.length}
                headerHeight={window.outerHeight / 60}
                headerStyle={{ paddingLeft: '.5rem', paddingTop: '.25rem', letterSpacing: '.075rem' }}
                rowHeight={window.outerHeight / 60}
                scrollToIndex={sortedData.length - 1}
                rowGetter={({ index }) => sortedData[index]}>
                <Column label="Price" dataKey="price" width={width} style={{ ...rowStyles, color: '#DD6956' }} />
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

export default withErrorFallback(OrderBookTable)
