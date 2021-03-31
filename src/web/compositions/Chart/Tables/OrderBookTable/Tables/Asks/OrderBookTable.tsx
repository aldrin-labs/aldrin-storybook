import React, { Component, PureComponent } from 'react'
import { withTheme } from '@material-ui/styles'

import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer'
import { Column, Table } from 'react-virtualized'
import 'react-virtualized/styles.css'

import { withErrorFallback } from '@core/hoc/withErrorFallback'
import { IProps } from './OrderBookTable.types'

import { getDataFromTree } from '@core/utils/chartPageUtils'

import defaultRowRenderer from '../../utils'
import { AsksWrapper } from '../../OrderBookTableContainer.styles'

@withTheme()
class OrderBookTable extends Component<IProps> {
  render() {
    const {
      data,
      theme,
      mode,
      aggregation,
      openOrderHistory,
      marketType,
      arrayOfMarketIds,
      //amountForBackground,
      updateTerminalPriceFromOrderbook,
      currencyPair,
    } = this.props
    const tableData = getDataFromTree(data.asks, 'asks').reverse()
    const amountForBackground =
      tableData.reduce((acc, curr) => acc + +curr.size, 0) / tableData.length

    const [base, quote] = currencyPair.split('_')

    return (
      <AsksWrapper mode={mode} isFullHeight={mode === 'asks'}>
        <AutoSizer>
          {({ width, height }: { width: number; height: number }) => (
            <Table
              width={width}
              height={height}
              rowCount={tableData.length}
              onRowClick={({ event, index, rowData }) => {
                updateTerminalPriceFromOrderbook(+rowData.price)
              }}
              headerHeight={window.outerHeight / 45}
              headerStyle={{
                color: theme.palette.grey.text,
                paddingLeft: '.5rem',
                paddingTop: '.25rem',
                marginLeft: 0,
                marginRight: 0,
                letterSpacing: '.075rem',
                borderBottom: theme.palette.border.main,
                fontSize: '1rem',
              }}
              gridStyle={{
                // overflow: mode !== 'asks' ? 'hidden' : 'hidden auto',
                overflow: 'hidden',
              }}
              rowHeight={window.outerHeight / 45}
              overscanRowCount={0}
              scrollToIndex={tableData.length - 1}
              rowGetter={({ index }) => tableData[index]}
              rowRenderer={(...rest) =>
                defaultRowRenderer({
                  theme,
                  ...rest[0],
                  side: 'asks',
                  marketType,
                  aggregation,
                  arrayOfMarketIds,
                  openOrderHistory,
                  amountForBackground,
                })
              }
            >
              <Column
                label="Price"
                dataKey="price"
                headerStyle={{ paddingLeft: 'calc(.5rem + 10px)' }}
                width={width - width / 6}
                style={{ color: theme.palette.red.main, fontFamily: 'Avenir Next Demi' }}
              />
              <Column
                label={`Size (${base})`}
                dataKey="size"
                headerStyle={{ textAlign: 'right', paddingRight: '6px' }}
                width={width + width / 6}
                style={{
                  textAlign: 'right',
                  color: theme.palette.dark.main,
                }}
              />
              <Column
                label={`Total (${quote})`}
                dataKey="total"
                headerStyle={{
                  paddingRight: 'calc(10px)',
                  textAlign: 'right',
                }}
                width={width}
                style={{ textAlign: 'right', color: theme.palette.dark.main }}
              />
            </Table>
          )}
        </AutoSizer>
      </AsksWrapper>
    )
  }
}

export default withErrorFallback(OrderBookTable)
