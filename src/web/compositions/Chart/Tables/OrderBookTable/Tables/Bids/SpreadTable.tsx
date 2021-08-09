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

import defaultRowRenderer, { getRowHeight } from '../../utils'
import { BidsWrapper } from '../../OrderBookTableContainer.styles'
import { StyledAutoSizer } from '@sb/compositions/Chart/Inputs/SelectWrapper/SelectWrapperStyles'
import useMobileSize from '@webhooks/useMobileSize'

const SpreadTable = ({
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
}) => {
  const isMobile = useMobileSize()
  const tableData = getDataFromTree(data.bids, 'bids').reverse()
  const amountForBackground =
    tableData.reduce((acc, curr) => acc + +curr.size, 0) / tableData.length

  const [base, quote] = currencyPair.split('_')
  const showHeader = mode === 'bids' || terminalViewMode === 'mobileChart'
  return (
    <BidsWrapper
      terminalViewMode={terminalViewMode}
      mode={mode}
      isFullHeight={mode === 'bids'}
    >
      <StyledAutoSizer>
        {({ width, height }: { width: number; height: number }) => (
          <Table
            disableHeader={!showHeader}
            width={width}
            height={height}
            headerHeight={getRowHeight({
              mode,
              height,
              isMobile,
              side: 'bids',
              terminalViewMode,
            })}
            onRowClick={({ event, index, rowData }) => {
              updateTerminalPriceFromOrderbook(+rowData.price)
            }}
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
            rowCount={tableData.length}
            rowHeight={getRowHeight({
              mode,
              height,
              isMobile,
              side: 'bids',
              terminalViewMode,
            })}
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
              label={showHeader ? `price` : ''}
              dataKey="price"
              headerStyle={{ paddingLeft: 'calc(.5rem + 10px)' }}
              width={width}
              style={{
                color: theme.palette.green.main,
                fontFamily: 'Avenir Next Demi',
                ...(isMobile ? { fontSize: '1.8rem' } : {}),
              }}
            />
            {!isMobile && (
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
            )}
            <Column
              label={showHeader ? `total (${quote})` : ''}
              dataKey="total"
              width={width}
              headerStyle={{
                paddingRight: 'calc(.5rem + 10px)',
                textAlign: 'right',
              }}
              style={{
                textAlign: 'right',
                color: theme.palette.white.primary,
                ...(isMobile ? { fontSize: '1.8rem' } : {}),
              }}
            />
          </Table>
        )}
      </StyledAutoSizer>
    </BidsWrapper>
  )
}

export default withErrorFallback(SpreadTable)
