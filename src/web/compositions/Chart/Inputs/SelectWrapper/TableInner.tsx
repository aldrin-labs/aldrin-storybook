import React from 'react'
import { Grid } from '@material-ui/core'
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer'
import { Column, Table } from 'react-virtualized'
import {
  StyledTable,
  AutoSizerDesktop,
  AutoSizerMobile,
} from './SelectWrapperStyles'
import { defaultRowRenderer } from '@sb/compositions/AnalyticsRoute/components/PairSelector'

export const TableInner = ({
  theme,
  processedSelectData,
  sort,
  sortBy,
  sortDirection,
  selectedPair,
}) => {
  return (
    <StyledTable>
      <AutoSizerDesktop>
        {({ width, height }: { width: number; height: number }) => (
          <Table
            width={width}
            height={height}
            rowCount={processedSelectData.length}
            sort={sort}
            sortBy={sortBy}
            sortDirection={sortDirection}
            onRowClick={({ event, index, rowData }) => {
              rowData.symbol.onClick()
            }}
            gridStyle={{
              outline: 'none',
            }}
            rowClassName={'pairSelectorRow'}
            rowStyle={{
              outline: 'none',
              cursor: 'pointer',
              fontSize: '2rem',
              borderBottom: `0.05rem solid ${theme.palette.grey.newborder}`,
            }}
            headerHeight={window.outerHeight / 25}
            headerStyle={{
              color: '#fff',
              paddingLeft: '.5rem',
              paddingTop: '.25rem',
              marginLeft: 0,
              marginRight: 0,
              letterSpacing: '.075rem',
              textTransform: 'capitalize',
              fontFamily: 'Avenir Next Light',
              fontSize: '2rem',
              outline: 'none',
            }}
            rowHeight={window.outerHeight / 14}
            rowGetter={({ index }) => processedSelectData[index]}
          >
            <Column
              label={` `}
              dataKey="emoji"
              headerStyle={{
                color: '#fff',
                paddingRight: 'calc(10px)',
                fontSize: '1.5rem',
                textAlign: 'left',
                fontFamily: 'Avenir Next Light',
              }}
              width={width / 2.5}
              style={{
                textAlign: 'left',
                fontSize: '1.4rem',
                fontWeight: 'bold',
              }}
              cellRenderer={({ cellData }) => cellData.render}
            />
            <Column
              label={`Pair`}
              dataKey="symbol"
              headerStyle={{
                color: '#fff',
                paddingRight: '6px',
                paddingLeft: '1rem',
                fontSize: '1.5rem',
                textAlign: 'left',
                fontFamily: 'Avenir Next Light',
              }}
              width={width * 1.8}
              style={{
                textAlign: 'left',
                fontSize: '1.4rem',
                fontWeight: 'bold',
              }}
              cellRenderer={({ cellData }) => cellData.render}
            />
            <Column
              label={`last price`}
              dataKey="price"
              headerStyle={{
                color: '#fff',
                paddingRight: 'calc(10px)',
                fontSize: '1.5rem',
                textAlign: 'left',
                fontFamily: 'Avenir Next Light',
              }}
              width={width * 1.2}
              style={{
                textAlign: 'left',
                fontSize: '1.4rem',
                fontWeight: 'bold',
              }}
              cellRenderer={({ cellData }) => cellData.render}
            />
            <Column
              label={`change 24h`}
              dataKey="price24hChange"
              headerStyle={{
                color: '#fff',
                paddingRight: 'calc(10px)',
                fontSize: '1.5rem',
                textAlign: 'left',
                fontFamily: 'Avenir Next Light',
              }}
              width={width * 1.8}
              style={{
                textAlign: 'left',
                fontSize: '1.4rem',
                fontWeight: 'bold',
              }}
              cellRenderer={({ cellData }) => cellData.render}
            />
            <Column
              label={`Min 24h`}
              dataKey="min24h"
              headerStyle={{
                color: '#fff',
                paddingRight: 'calc(10px)',
                fontSize: '1.5rem',
                textAlign: 'left',
                fontFamily: 'Avenir Next Light',
              }}
              width={width * 1.6}
              style={{
                textAlign: 'left',
                fontSize: '1.4rem',
                fontWeight: 'bold',
              }}
              cellRenderer={({ cellData }) => cellData.render}
            />
            <Column
              label={`Max 24h`}
              dataKey="max24h"
              headerStyle={{
                color: '#fff',
                paddingRight: 'calc(10px)',
                fontSize: '1.5rem',
                textAlign: 'left',
                fontFamily: 'Avenir Next Light',
              }}
              width={width * 1.4}
              style={{
                textAlign: 'left',
                fontSize: '1.4rem',
                fontWeight: 'bold',
              }}
              cellRenderer={({ cellData }) => cellData.render}
            />
            <Column
              label={`volume 24h`}
              dataKey="volume24hChange"
              headerStyle={{
                color: '#fff',
                paddingRight: 'calc(10px)',
                fontSize: '1.5rem',
                textAlign: 'left',
                fontFamily: 'Avenir Next Light',
              }}
              width={width * 1.3}
              style={{
                textAlign: 'left',
                fontSize: '1.4rem',
                fontWeight: 'bold',
              }}
              cellRenderer={({ cellData }) => cellData.render}
            />
            <Column
              label={`trades 24h`}
              dataKey="trades24h"
              headerStyle={{
                color: '#fff',
                paddingRight: 'calc(10px)',
                fontSize: '1.5rem',
                textAlign: 'left',
                fontFamily: 'Avenir Next Light',
              }}
              width={width * 1.3}
              style={{
                textAlign: 'left',
                fontSize: '1.4rem',
                fontWeight: 'bold',
              }}
              cellRenderer={({ cellData }) => cellData.render}
            />
            <Column
              label={`Avg.Buy 14d`}
              dataKey="avgBuy14d"
              headerStyle={{
                color: '#fff',
                paddingRight: 'calc(10px)',
                fontSize: '1.5rem',
                textAlign: 'left',
                fontFamily: 'Avenir Next Light',
              }}
              width={width * 1.4}
              style={{
                textAlign: 'left',
                fontSize: '1.4rem',
                fontWeight: 'bold',
              }}
              cellRenderer={({ cellData }) => cellData.render}
            />
            <Column
              label={`Avg.Sell 14d`}
              dataKey="avgSell14d"
              headerStyle={{
                color: '#fff',
                paddingRight: 'calc(10px)',
                fontSize: '1.5rem',
                textAlign: 'left',
                fontFamily: 'Avenir Next Light',
              }}
              width={width * 1.4}
              style={{
                textAlign: 'left',
                fontSize: '1.4rem',
                fontWeight: 'bold',
              }}
              cellRenderer={({ cellData }) => cellData.render}
            />
            <Column
              label={`Links`}
              dataKey="links"
              headerStyle={{
                color: '#fff',
                paddingRight: 'calc(10px)',
                fontSize: '1.5rem',
                textAlign: 'left',
                fontFamily: 'Avenir Next Light',
              }}
              width={width * 2.1}
              style={{
                textAlign: 'left',
                fontSize: '1.4rem',
                fontWeight: 'bold',
              }}
              cellRenderer={({ cellData }) => cellData.render}
            />
          </Table>
        )}
      </AutoSizerDesktop>
      <AutoSizerMobile>
        {({ width, height }: { width: number; height: number }) => (
          <Table
            width={width}
            height={height}
            rowCount={processedSelectData.length}
            sort={sort}
            sortBy={sortBy}
            sortDirection={sortDirection}
            onRowClick={({ event, index, rowData }) => {
              rowData.symbol.onClick()
            }}
            gridStyle={{
              outline: 'none',
            }}
            rowClassName={'pairSelectorRow'}
            rowStyle={{
              outline: 'none',
              cursor: 'pointer',
              fontSize: '2rem',
              borderBottom: `0.05rem solid #383B45`,
            }}
            rowRenderer={(...props) =>
              defaultRowRenderer({ ...props[0], selectedPair })
            }
            headerHeight={0}
            headerStyle={{
              color: '#fff',
              paddingLeft: '.5rem',
              paddingTop: '.25rem',
              marginLeft: 0,
              marginRight: 0,
              letterSpacing: '.075rem',
              textTransform: 'capitalize',
              fontFamily: 'Avenir Next Light',
              fontSize: '2rem',
              outline: 'none',
              display: 'none',
              height: '0',
            }}
            rowHeight={window.outerHeight / 12}
            rowGetter={({ index }) => processedSelectData[index]}
          >
            <Column
              label={` `}
              dataKey="emoji"
              headerStyle={{
                color: '#fff',
                paddingRight: 'calc(10px)',
                fontSize: '1.5rem',
                textAlign: 'left',
                fontFamily: 'Avenir Next Light',
              }}
              width={width / 12}
              style={{
                textAlign: 'left',
                fontSize: '1.4rem',
                fontWeight: 'bold',
              }}
              cellRenderer={({ cellData }) => cellData.render}
            />
            <Column
              label={` `}
              dataKey="symbol"
              headerStyle={{
                color: '#fff',
                paddingRight: '6px',
                paddingLeft: '1rem',
                fontSize: '1.5rem',
                textAlign: 'left',
                fontFamily: 'Avenir Next Light',
              }}
              width={width / 3}
              style={{
                textAlign: 'left',
                fontSize: '2.6rem',
                fontWeight: 'bold',
              }}
              cellRenderer={({ cellData }) => cellData.render}
            />

            <Column
              label={`change 24h`}
              dataKey="price24hChange"
              headerStyle={{
                color: '#fff',
                paddingRight: 'calc(10px)',
                fontSize: '1.5rem',
                textAlign: 'left',
                fontFamily: 'Avenir Next Light',
              }}
              width={width / 2.1}
              style={{
                textAlign: 'left',
                fontSize: '2rem',
                fontWeight: 'bold',
              }}
              cellRenderer={({ cellData }) => cellData.render}
            />
          </Table>
        )}
      </AutoSizerMobile>
    </StyledTable>
  )
}
