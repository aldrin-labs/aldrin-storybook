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
import {
  AutoSizerDesktop,
  AutoSizerMobile,
} from '@sb/compositions/Chart/Inputs/SelectWrapper/SelectWrapperStyles'

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
      terminalViewMode,
    } = this.props

    const tableData = getDataFromTree(data.bids, 'bids').reverse()
    const amountForBackground =
      tableData.reduce((acc, curr) => acc + +curr.size, 0) / tableData.length

    const [base, quote] = currencyPair.split('_')

    return (
      <BidsWrapper
        terminalViewMode={terminalViewMode}
        mode={mode}
        isFullHeight={mode === 'bids'}
      >
        <AutoSizerDesktop>
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
                width={width}
                style={{
                  color: theme.palette.green.main,
                  fontFamily: 'Avenir Next Demi',
                }}
              />
              <Column
                label={mode === 'bids' ? `size (${base})` : ''}
                dataKey="size"
                width={width}
                headerStyle={{ textAlign: 'left', paddingRight: '.9rem' }}
                style={{
                  textAlign: 'left',
                  color: theme.palette.white.primary,
                }}
              />
              <Column
                label={mode === 'bids' ? `total (${quote})` : ''}
                dataKey="total"
                width={width}
                headerStyle={{
                  paddingRight: 'calc(.5rem + 10px)',
                  textAlign: 'right',
                }}
                style={{
                  textAlign: 'right',
                  color: theme.palette.white.primary,
                }}
              />
            </Table>
          )}
        </AutoSizerDesktop>
        <AutoSizerMobile>
          {({ width, height }: { width: number; height: number }) => (
            <Table
              disableHeader={terminalViewMode !== 'mobileChart'}
              width={width}
              height={height}
              onRowClick={({ event, index, rowData }) => {
                updateTerminalPriceFromOrderbook(+rowData.price)
              }}
              headerHeight={height / 7}
              headerStyle={{
                color: theme.palette.grey.text,
                paddingLeft: '.5rem',
                paddingTop: '.25rem',
                marginLeft: 0,
                marginRight: 0,
                letterSpacing: '.01rem',
                fontSize: '2rem',
                fontFamily: 'Avenir Next Light',
                textTransform: 'capitalize',
              }}
              rowCount={tableData.length}
              rowHeight={
                terminalViewMode === 'mobileChart' ? height / 7 : height / 6
              }
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
                label={`price`}
                dataKey="price"
                headerStyle={{ paddingLeft: 'calc(.5rem + 10px)' }}
                width={width}
                style={{
                  color: theme.palette.green.main,
                  fontFamily: 'Avenir Next Demi',
                  fontSize: '1.8rem',
                }}
              />
              <Column
                label={`total (${quote})`}
                dataKey="total"
                width={width}
                headerStyle={{
                  paddingRight: 'calc(.5rem + 10px)',
                  textAlign: 'right',
                }}
                style={{
                  textAlign: 'right',
                  color: theme.palette.white.primary,
                  fontSize: '1.8rem',
                }}
              />
            </Table>
          )}
        </AutoSizerMobile>
      </BidsWrapper>
    )
  }
}

export default withErrorFallback(SpreadTable)
