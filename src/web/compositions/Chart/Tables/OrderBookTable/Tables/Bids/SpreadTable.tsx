import React, { Component, PureComponent } from 'react'
import styled from 'styled-components'
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer'
import { Column, Table } from 'react-virtualized'
import 'react-virtualized/styles.css'

import { IProps } from './SpreadTable.types'
import { withErrorFallback } from '@core/hoc/withErrorFallback'
import { withTheme } from '@material-ui/styles'

import {
  getDataForTable,
  getDataFromTree,
  rowStyles,
} from '@core/utils/chartPageUtils'

import defaultRowRenderer from '../../utils'
import { BidsWrapper } from '../../OrderBookTableContainer.styles'

@withTheme()
class SpreadTable extends Component<IProps> {
  render() {
    const {
      theme,
      data,
      aggregation,
      openOrderHistory,
      mode,
      marketType,
      arrayOfMarketIds,
      // amountForBackground,
      updateTerminalPriceFromOrderbook,
      currencyPair,
    } = this.props

    const tableData = getDataFromTree(data.bids, 'bids').reverse()
    const amountForBackground =
      tableData.reduce((acc, curr) => acc + +curr.size, 0) / tableData.length

    const [base, quote] = currencyPair.split('_')

    return (
      <BidsWrapper mode={mode} isFullHeight={mode === 'bids'}>
        <AutoSizer>
          {({ width, height }: { width: number; height: number }) => (
            <Table
              disableHeader={mode !== 'bids'}
              width={width}
              height={height}
              headerHeight={mode === 'both' ? height / 8 : height / 18}
              onRowClick={({ event, index, rowData }) => {
                updateTerminalPriceFromOrderbook(+rowData.price)
              }}
              headerStyle={{
                color: '#7284A0',
                paddingLeft: '.5rem',
                marginLeft: 0,
                marginRight: 0,
                paddingTop: '.25rem',
                letterSpacing: '.075rem',
                borderBottom: theme.palette.border.main,
                fontSize: '1rem',
              }}
              rowCount={tableData.length}
              rowHeight={mode === 'both' ? height / 8 : height / 18}
              overscanRowCount={0}
              rowGetter={({ index }) => tableData[index]}
              rowRenderer={(...rest) =>
                defaultRowRenderer({
                  theme,
                  ...rest[0],
                  side: 'bids',
                  aggregation,
                  marketType,
                  arrayOfMarketIds,
                  amountForBackground,
                  openOrderHistory,
                })
              }
            >
              <Column
                label={mode === 'bids' ? `price` : ''}
                dataKey="price"
                headerStyle={{ paddingLeft: 'calc(.5rem + 10px)' }}
                width={width - width / 6}
                style={{ color: theme.palette.green.main, fontFamily: 'Avenir Next Demi' }}
              />
              <Column
                label={mode === 'bids' ? `size (${base})` : ''}
                dataKey="size"
                width={width + width / 6}
                headerStyle={{ textAlign: 'left', paddingRight: '.9rem' }}
                style={{
                  textAlign: 'left',
                  color: theme.palette.white.primary,
                }}
              />
              <Column
                label={mode === 'bids' ? `total (${quote})` : ''}
                dataKey="total"
                headerStyle={{
                  paddingRight: 'calc(.5rem + 10px)',
                  textAlign: 'right',
                }}
                width={width}
                style={{ textAlign: 'right', color: theme.palette.white.primary }}
              />
            </Table>
          )}
        </AutoSizer>
      </BidsWrapper>
    )
  }
}

export default withErrorFallback(SpreadTable)
