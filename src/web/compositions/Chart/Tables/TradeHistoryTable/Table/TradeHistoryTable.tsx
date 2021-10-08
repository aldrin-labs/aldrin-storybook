import React from 'react'
import styled from 'styled-components'

import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer'
import { Column, Table } from 'react-virtualized'
import 'react-virtualized/styles.css'

import useMobileSize from '@webhooks/useMobileSize'
import defaultRowRenderer from '../../OrderBookTable/utils'

const Wrapper = styled.div`
  height: calc(100% - 3rem);
`

const TradeHistoryTable = ({
  data,
  theme,
  updateTerminalPriceFromOrderbook,
  amountForBackground,
  quantityPrecision,
}) => {
  const isMobile = useMobileSize()

  return (
    <Wrapper>
      <AutoSizer>
        {({ width, height }: { width: number; height: number }) => (
          <Table
            headerHeight={height / 19}
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
            width={width}
            height={height}
            rowCount={data.length}
            overscanRowCount={0}
            rowHeight={height / 19}
            rowGetter={({ index }) => data[index]}
            onRowClick={({ event, index, rowData }) => {
              updateTerminalPriceFromOrderbook(+rowData.price)
            }}
            rowRenderer={(...rest) =>
              defaultRowRenderer({
                ...rest[0],
                fall: rest[0].side === 'buy' ? 0 : 1,
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
              style={{ fontFamily: 'Avenir Next Demi' }}
              headerStyle={{ paddingLeft: 'calc(.5rem + 10px)' }}
            />
            <Column
              label="Size"
              dataKey="size"
              width={width}
              style={{ color: theme.palette.white.primary }}
            />
            <Column
              label="time"
              dataKey="time"
              width={width}
              style={{ color: theme.palette.white.primary }}
            />
          </Table>
        )}
      </AutoSizer>
    </Wrapper>
  )
}

export default TradeHistoryTable
