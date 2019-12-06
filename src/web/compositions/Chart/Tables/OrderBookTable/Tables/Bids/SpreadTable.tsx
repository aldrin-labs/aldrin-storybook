import React, { Component, PureComponent } from 'react'
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer'
import { Column, Table } from 'react-virtualized'
import 'react-virtualized/styles.css'

import { IProps } from './SpreadTable.types'
import { withErrorFallback } from '@core/hoc/withErrorFallback'
import { withTheme } from '@material-ui/styles'

import {
  getDataForTable,
  getArrayFromAggregatedTree,
  rowStyles,
} from '@core/utils/chartPageUtils'

import defaultRowRenderer from '../../utils'
import { TableWrapper } from '../../OrderBookTableContainer.styles'

@withTheme
class SpreadTable extends Component<IProps> {
  render() {
    const { data, aggregation, openOrderHistory, mode } = this.props
    const tableData =
      aggregation === 0.01
        ? getDataForTable(data, aggregation, 'bids').reverse()
        : getArrayFromAggregatedTree(data.bids, 'bids').reverse()

    return (
      <TableWrapper mode={mode} isFullHeight={mode === 'bids'}>
        <AutoSizer>
          {({ width, height }: { width: number; height: number }) => (
            <Table
              disableHeader={mode !== 'bids'}
              width={width}
              height={height}
              headerHeight={window.outerHeight / 50}
              headerStyle={{
                color: '#7284A0',
                paddingLeft: '.5rem',
                marginLeft: 0,
                marginRight: 0,
                paddingTop: '.25rem',
                letterSpacing: '.075rem',
                borderBottom: '.1rem solid #e0e5ec',
                fontSize: '1rem',
              }}
              gridStyle={{
                overflow: mode !== 'bids' ? 'hidden' : 'hidden auto',
              }}
              rowCount={tableData.length}
              rowHeight={window.outerHeight / 60}
              rowGetter={({ index }) => tableData[index]}
              rowRenderer={(...rest) =>
                defaultRowRenderer({ ...rest[0], openOrderHistory })
              }
            >
              <Column
                label={mode === 'bids' ? 'price' : ''}
                dataKey="price"
                headerStyle={{ paddingLeft: 'calc(.5rem + 10px)' }}
                width={width}
                style={{ ...rowStyles, color: '#29AC80' }}
              />
              <Column
                label={mode === 'bids' ? 'size' : ''}
                dataKey="size"
                width={width}
                style={rowStyles}
              />
              <Column
                label={mode === 'bids' ? 'total' : ''}
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

export default withErrorFallback(SpreadTable)
