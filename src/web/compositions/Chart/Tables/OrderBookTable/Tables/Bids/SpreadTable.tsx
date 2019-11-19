import React, { Component, PureComponent } from 'react'
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer'
import { Column, Table } from 'react-virtualized'
import 'react-virtualized/styles.css'

import { IProps } from './SpreadTable.types'
import { withErrorFallback } from '@core/hoc/withErrorFallback'
import { withTheme } from '@material-ui/styles'

import { getDataForTable, rowStyles } from '@core/utils/chartPageUtils'

import { TableWrapper } from '../../OrderBookTableContainer.styles'

@withTheme
class SpreadTable extends Component<IProps> {
  render() {
    const { data, group, mode } = this.props
    // const tableData = getDataForTable(data, group, 'bids')
    const tableData = []

    return (
      <TableWrapper mode={mode} isFullHeight={mode === 'bids'}>
        <AutoSizer>
          {({ width, height }: { width: number; height: number }) => (
            <Table
              disableHeader={mode !== 'bids'}
              width={width}
              height={height}
              headerHeight={window.outerHeight / 60}
              headerStyle={{
                color: '#7284A0',
                paddingLeft: '.5rem',
                marginLeft: 0,
                marginRight: 0,
                paddingTop: '.25rem',
                letterSpacing: '.075rem',
                borderBottom: '.1rem solid #e0e5ec',
              }}
              rowCount={0}
              //rowCount={tableData.length <= 20 ? tableData.length : 20}
              rowHeight={window.outerHeight / 60}
              // rowStyle={{ backgroundColor: '#000' }}
              rowGetter={({ index }) => tableData[index]}
            >
              <Column
                label=''
                dataKey='price'
                headerStyle={{ paddingLeft: 'calc(.5rem + 10px)' }}
                width={width}
                style={{ ...rowStyles, color: '#29AC80' }}
              />
              <Column label='' dataKey='size' width={width} style={rowStyles} />
              <Column
                label=''
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

export default withErrorFallback(SpreadTable)
