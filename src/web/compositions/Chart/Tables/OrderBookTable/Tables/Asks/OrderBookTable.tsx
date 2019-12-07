import React, { Component, PureComponent } from 'react'
import { withTheme } from '@material-ui/styles'

import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer'
import { Column, Table } from 'react-virtualized'
import 'react-virtualized/styles.css'

import { withErrorFallback } from '@core/hoc/withErrorFallback'
import { IProps } from './OrderBookTable.types'

import {
  getDataForTable,
  getArrayFromAggregatedTree,
  rowStyles,
} from '@core/utils/chartPageUtils'

import defaultRowRenderer from '../../utils'
import { TableWrapper } from '../../OrderBookTableContainer.styles'

@withTheme
class OrderBookTable extends Component<IProps> {
  render() {
    const { data, mode, aggregation, openOrderHistory } = this.props
    const tableData =
      aggregation === 0.01
        ? getDataForTable(data, aggregation, 'asks').reverse()
        : getArrayFromAggregatedTree(data.asks, 'asks').reverse()

    return (
      <TableWrapper mode={mode} isFullHeight={mode === 'asks'}>
        <AutoSizer>
          {({ width, height }: { width: number; height: number }) => (
            <Table
              width={width}
              height={height}
              rowCount={tableData.length}
              headerHeight={window.outerHeight / 50}
              headerStyle={{
                color: '#7284A0',
                paddingLeft: '.5rem',
                paddingTop: '.25rem',
                marginLeft: 0,
                marginRight: 0,
                letterSpacing: '.075rem',
                borderBottom: '.1rem solid #e0e5ec',
                fontSize: '1rem',
              }}
              gridStyle={{
                overflow: mode !== 'asks' ? 'hidden' : 'hidden auto',
              }}
              rowHeight={window.outerHeight / 60}
              scrollToIndex={tableData.length - 1}
              rowGetter={({ index }) => tableData[index]}
              rowRenderer={(...rest) =>
                defaultRowRenderer({ ...rest[0], openOrderHistory })
              }
            >
              <Column
                label="Price"
                dataKey="price"
                headerStyle={{ paddingLeft: 'calc(.5rem + 10px)' }}
                width={width}
                style={{ ...rowStyles, color: '#DD6956' }}
              />
              <Column
                label="Size"
                dataKey="size"
                width={width}
                style={rowStyles}
              />
              <Column
                label="Total"
                dataKey="total"
                width={width}
                style={rowStyles}
              />
            </Table>
          )}
        </AutoSizer>
      </TableWrapper>
    )
  }
}

export default withErrorFallback(OrderBookTable)
