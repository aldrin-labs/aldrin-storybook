import React, { Component, PureComponent } from 'react'
import { withTheme } from '@material-ui/styles'

import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer'
import { Column, Table } from 'react-virtualized'
import 'react-virtualized/styles.css'

import { withErrorFallback } from '@core/hoc/withErrorFallback'
import { IProps } from './OrderBookTable.types'

import { getDataForTable, rowStyles } from '@core/utils/chartPageUtils'

import { TableWrapper } from '../../OrderBookTableContainer.styles'

@withTheme
class OrderBookTable extends Component<IProps> {
  render() {
    const { data, mode, group } = this.props
    const tableData = getDataForTable(data, group, 'asks')

    return (
      <TableWrapper mode={mode} isFullHeight={mode === 'asks'}>
        <AutoSizer>
          {({ width, height }: { width: number; height: number }) => (
            <Table
              width={width}
              height={height}
              rowCount={tableData.length}
              headerHeight={window.outerHeight / 60}
              headerStyle={{
                color: '#7284A0',
                paddingLeft: '.5rem',
                paddingTop: '.25rem',
                marginLeft: 0,
                marginRight: 0,
                letterSpacing: '.075rem',
                borderBottom: '.1rem solid #e0e5ec',
              }}
              rowHeight={window.outerHeight / 60}
              scrollToIndex={tableData.length - 1}
              rowGetter={({ index }) => tableData[index]}
            >
              <Column
                label='Price'
                dataKey='price'
                headerStyle={{ paddingLeft: 'calc(.5rem + 10px)' }}
                width={width}
                style={{ ...rowStyles, color: '#DD6956' }}
              />
              <Column
                label='Size'
                dataKey='size'
                width={width}
                style={rowStyles}
              />
              <Column
                label='Total'
                dataKey='total'
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
