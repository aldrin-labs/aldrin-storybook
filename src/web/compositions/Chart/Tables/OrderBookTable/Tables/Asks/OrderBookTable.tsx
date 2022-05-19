import React from 'react'
import { Column, Table } from 'react-virtualized'
import 'react-virtualized/styles.css'

import styled from 'styled-components'

import { StyledAutoSizer } from '@sb/compositions/Chart/Inputs/SelectWrapper/SelectWrapperStyles'
import { useOpenOrders } from '@sb/dexUtils/markets'
import { withErrorFallback } from '@sb/hoc'

import { getDataFromTree } from '@core/utils/chartPageUtils'

import useMobileSize from '@webhooks/useMobileSize'

import { AsksWrapper } from '../../OrderBookTableContainer.styles'
import defaultRowRenderer, { getRowHeight } from '../../utils'

const StyledTable = styled(Table)`
  & .ReactVirtualized__Grid__innerScrollContainer {
    top: ${(props) => {
      const numberOfRows = props.mode === 'both' ? 8 : 16

      return props.rowCount < numberOfRows
        ? props.height - (props.height / numberOfRows) * (props.rowCount + 1)
        : 0
    }}px;
  }
`

const OrderBookTable = ({
  data,
  theme,
  mode,
  aggregation,
  openOrderHistory,
  marketType,
  arrayOfMarketIds,
  updateTerminalPriceFromOrderbook,
  currencyPair,
  terminalViewMode,
}) => {
  const isMobile = useMobileSize()
  const openOrders = useOpenOrders()
  const tableData =
    isMobile && terminalViewMode === 'mobileChart'
      ? getDataFromTree(data.asks, 'asks')
      : getDataFromTree(data.asks, 'asks').reverse()
  const amountForBackground =
    tableData.reduce((acc, curr) => acc + +curr.size, 0) / tableData.length

  const [base, quote] = currencyPair.split('_')

  return (
    <AsksWrapper
      terminalViewMode={terminalViewMode}
      mode={mode}
      isFullHeight={mode === 'asks'}
    >
      <StyledAutoSizer>
        {({ width, height }: { width: number; height: number }) => {
          return (
            <StyledTable
              mode={mode}
              width={width}
              height={height}
              rowCount={tableData.length}
              onRowClick={({ event, index, rowData }) => {
                updateTerminalPriceFromOrderbook(+rowData.price)
              }}
              headerHeight={getRowHeight({
                mode,
                height,
                isMobile,
                side: 'asks',
                terminalViewMode,
              })}
              headerStyle={{
                color: theme.palette.grey.text,
                paddingLeft: '.5rem',
                paddingTop: '.25rem',
                marginLeft: 0,
                marginRight: 0,
                letterSpacing: '.01rem',
                fontSize: isMobile ? '2rem' : '1.4rem',
                fontFamily: 'Avenir Next Light',
                textTransform: 'capitalize',
              }}
              rowHeight={getRowHeight({
                mode,
                height,
                isMobile,
                side: 'asks',
                terminalViewMode,
              })}
              overscanRowCount={0}
              scrollToIndex={
                isMobile && terminalViewMode === 'mobileChart'
                  ? 0
                  : tableData.length - 1
              }
              rowGetter={({ index }) => tableData[index]}
              rowRenderer={(...rest) =>
                defaultRowRenderer({
                  theme,
                  ...rest[0],
                  side: 'asks',
                  marketType,
                  aggregation,
                  arrayOfMarketIds,
                  openOrderHistory: openOrders,
                  amountForBackground,
                })
              }
            >
              <Column
                label="Price"
                dataKey="price"
                headerStyle={{ paddingLeft: 'calc(.5rem + 10px)' }}
                width={width}
                style={{
                  color: theme.palette.red.main,
                  fontFamily: 'Avenir Next Demi',
                  ...(isMobile ? { fontSize: '1.8rem' } : {}),
                }}
              />
              {!isMobile && (
                <Column
                  label={`Size (${base})`}
                  dataKey="size"
                  headerStyle={{ textAlign: 'left', paddingRight: '6px' }}
                  width={width}
                  style={{
                    textAlign: 'left',
                    color: theme.palette.white.primary,
                  }}
                />
              )}

              <Column
                label={`Total (${quote})`}
                dataKey="total"
                headerStyle={{
                  paddingRight: 'calc(10px)',
                  textAlign: 'right',
                }}
                width={width}
                style={{
                  textAlign: 'right',
                  color: theme.palette.white.primary,
                  ...(isMobile ? { fontSize: '1.8rem' } : {}),
                }}
              />
            </StyledTable>
          )
        }}
      </StyledAutoSizer>
      {/* <AutoSizerMobile>
        {({ width, height }: { width: number; height: number }) => {
          return (
            <StyledTable
              mode={mode}
              width={width}
              height={height}
              rowCount={tableData.length}
              onRowClick={({ event, index, rowData }) => {
                updateTerminalPriceFromOrderbook(+rowData.price)
              }}
              headerHeight={getRowHeight({
                mode,
                height,
                isMobile,
                side: 'asks',
                terminalViewMode,
              })}
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
              rowHeight={getRowHeight({
                mode,
                height,
                isMobile,
                side: 'asks',
                terminalViewMode,
              })}
              overscanRowCount={0}
              scrollToIndex={
                isMobile && terminalViewMode === 'mobileChart'
                  ? 0
                  : tableData.length - 1
              }
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
                width={width}
                style={{
                  color: theme.palette.red.main,
                  fontFamily: 'Avenir Next Demi',
                  fontSize: '1.8rem',
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
                style={{
                  textAlign: 'right',
                  color: theme.palette.white.primary,
                  fontSize: '1.8rem',
                }}
              />
            </StyledTable>
          )
        }}
      </AutoSizerMobile> */}
    </AsksWrapper>
  )
}

export default withErrorFallback(OrderBookTable)
