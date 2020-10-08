import React, { PureComponent } from 'react'
import styled from 'styled-components'
import { withTheme } from '@material-ui/styles'
import { IProps, IState } from './TradeHistoryTable.types'

import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer'
import { Column, Table } from 'react-virtualized'
import 'react-virtualized/styles.css'

import { rowStyles } from '@core/utils/chartPageUtils'

import defaultRowRenderer from '../../OrderBookTable/utils'

const Wrapper = styled.div`
  height: calc(100% - 3rem);
  & .ReactVirtualized__Grid {
    overflow: hidden !important;
  }
`

@withTheme()
class TradeHistoryTable extends PureComponent<IProps, IState> {
  render() {
    const {
      data,
      theme,
      updateTerminalPriceFromOrderbook,
      amountForBackground,
    } = this.props

    return (
      <Wrapper>
        <AutoSizer>
          {({ width, height }: { width: number; height: number }) => (
            <Table
              headerHeight={window.outerHeight / 50}
              headerStyle={{
                color: theme.palette.grey.text,
                paddingLeft: '.5rem',
                marginLeft: 0,
                marginRight: 0,
                paddingTop: '.25rem',
                letterSpacing: '.075rem',
                borderBottom: theme.palette.border.main,
                fontSize: '1rem',
              }}
              gridStyle={{
                overflow: 'hidden',
              }}
              width={width}
              height={height}
              rowCount={data.length}
              overscanRowCount={0}
              rowHeight={window.outerHeight / 60}
              rowGetter={({ index }) => data[index]}
              onRowClick={({ event, index, rowData }) => {
                updateTerminalPriceFromOrderbook(+rowData.price)
              }}
              rowRenderer={(...rest) =>
                defaultRowRenderer({
                  ...rest[0],
                  fall: rest[0].side === "buy" ? 0 : 1,
                  theme,
                  amountForBackground,
                  openOrderHistory: [],
                })
              }
            >
              <Column
                label="Price"
                dataKey="price"
                width={width}
                style={{ color: theme.palette.dark.main }}
                headerStyle={{ paddingLeft: 'calc(.5rem + 10px)' }}
              />
              <Column
                label="Size"
                dataKey="size"
                width={width}
                style={{ color: theme.palette.dark.main }}
              />
              <Column
                label="time"
                dataKey="time"
                width={width}
                style={{ color: theme.palette.dark.main }}
              />
            </Table>
          )}
        </AutoSizer>
      </Wrapper>
    )
  }
}

export default TradeHistoryTable
