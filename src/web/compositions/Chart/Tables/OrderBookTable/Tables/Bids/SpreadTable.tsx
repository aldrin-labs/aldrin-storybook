import React from 'react'
import { Column, Table } from 'react-virtualized'
import { useTheme } from 'styled-components'
import 'react-virtualized/styles.css'

import { StyledAutoSizer } from '@sb/compositions/Chart/Inputs/SelectWrapper/SelectWrapperStyles'
import { useOpenOrders } from '@sb/dexUtils/markets'
import { formatNumberWithSpaces } from '@sb/dexUtils/utils'

import { withErrorFallback } from '@core/hoc/withErrorFallback'
import { getDataFromTree } from '@core/utils/chartPageUtils'

import useMobileSize from '@webhooks/useMobileSize'

import { BidsWrapper } from '../../OrderBookTableContainer.styles'
import defaultRowRenderer, { getRowHeight } from '../../utils'

const SpreadTable = ({
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
  const openOrders = useOpenOrders()
  const isMobile = useMobileSize()
  const theme = useTheme()
  const tableData = getDataFromTree(data.bids, 'bids').reverse()

  const formattedData = tableData.map((el) => {
    return {
      ...el,
      price: formatNumberWithSpaces(el.price),
      size: formatNumberWithSpaces(el.size),
      total: formatNumberWithSpaces(el.total),
    }
  })

  const dataForCalcBackgroundAmount = tableData.map((el) => {
    return {
      size: el.size,
    }
  })

  const amountForBackground =
    dataForCalcBackgroundAmount.reduce((acc, curr) => acc + +curr.size, 0) /
    dataForCalcBackgroundAmount.length

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
              color: theme.colors.gray1,
              paddingLeft: '.5rem',
              paddingTop: '.25rem',
              marginLeft: 0,
              marginRight: 0,
              letterSpacing: '.01rem',
              fontSize: isMobile ? '2rem' : '1.4rem',
              fontFamily: 'Avenir Next Light',
              textTransform: 'capitalize',
            }}
            rowCount={formattedData.length}
            rowHeight={getRowHeight({
              mode,
              height,
              isMobile,
              side: 'bids',
              terminalViewMode,
            })}
            overscanRowCount={0}
            rowGetter={({ index }) => formattedData[index]}
            rowRenderer={(...rest) =>
              defaultRowRenderer({
                theme,
                ...rest[0],
                side: 'bids',
                aggregation,
                marketType,
                arrayOfMarketIds,
                amountForBackground,
                openOrderHistory: openOrders,
              })
            }
          >
            <Column
              label={showHeader ? `price` : ''}
              dataKey="price"
              headerStyle={{ paddingLeft: 'calc(.5rem + 10px)' }}
              width={width}
              style={{
                color: theme.colors.obGreenFont,
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
                  color: theme.colors.white,
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
                color: theme.colors.white,
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
