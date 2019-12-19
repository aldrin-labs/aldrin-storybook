import React, { PureComponent } from 'react'
import { withTheme } from '@material-ui/styles'
import { IProps, IState } from './TradeHistoryTable.types'

import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer';
import { Column, Table } from 'react-virtualized';
import 'react-virtualized/styles.css';

import {
  rowStyles,
} from '@core/utils/chartPageUtils'

import defaultRowRenderer from '../../OrderBookTable/utils'

@withTheme
class TradeHistoryTable extends PureComponent<IProps, IState> {
  render() {
    const {
      data,
      updateTerminalPriceFromOrderbook
    } = this.props

    return (
      <div style={{ height: "calc(100% - 3rem)" }}>
        <AutoSizer>
          {
            (({ width, height }: { width: number, height: number }) =>
              <Table
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
                width={width}
                height={height}
                rowCount={data.length}
                rowHeight={window.outerHeight / 60}
                rowGetter={({ index }) => data[index]}
                onRowClick={({ event, index, rowData }) => {
                updateTerminalPriceFromOrderbook(+rowData.price)
              }}
                rowRenderer={(...rest) =>
                  defaultRowRenderer({ ...rest[0] })
                }>
                <Column label="Price" dataKey="price" width={width} style={{ color: '' }} headerStyle={{ paddingLeft: 'calc(.5rem + 10px)' }}  />
                <Column label="Size" dataKey="size" width={width} style={{ color: '#16253D' }} />
                <Column label="time" dataKey="time" width={width} style={{ color: '#16253D' }} />
              </Table>
            )
          }
        </AutoSizer>
      </div>
    )
  }
}

export default TradeHistoryTable
