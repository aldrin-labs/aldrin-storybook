import useMobileSize from '@webhooks/useMobileSize'
import React from 'react'
import { Column, Table } from 'react-virtualized'
import { useTheme } from 'styled-components'

import { StyledTable, StyledAutoSizer } from './SelectWrapperStyles'

export const TableInner = ({
  isAdvancedSelectorMode,
  processedSelectData,
  sort,
  sortBy,
  sortDirection,
}: {
  isAdvancedSelectorMode: boolean
  processedSelectData: any[]
  sort: () => void
  sortBy: string
  sortDirection: any
}) => {
  const isMobile = useMobileSize()
  const theme = useTheme()

  return (
    <StyledTable
      id="marketSelector"
      isAdvancedSelectorMode={isAdvancedSelectorMode}
    >
      <StyledAutoSizer>
        {({ width, height }: { width: number; height: number }) => (
          <Table
            width={width}
            height={height}
            rowCount={processedSelectData.length}
            sort={sort}
            sortBy={sortBy}
            sortDirection={sortDirection}
            onRowClick={({ rowData }) => {
              rowData.symbol.onClick()
            }}
            gridStyle={{
              outline: 'none',
            }}
            rowClassName="pairSelectorRow"
            rowStyle={{
              overflow: 'visible',
              outline: 'none',
              cursor: 'pointer',
              fontSize: '2rem',
              borderBottom: `0.05rem solid ${theme.colors.white6}`,
            }}
            headerHeight={isMobile ? 0 : window.outerHeight / 25}
            headerStyle={{
              color: theme.colors.white1,
              paddingLeft: '.5rem',
              paddingTop: '.25rem',
              marginLeft: 0,
              marginRight: 0,
              letterSpacing: '.075rem',
              textTransform: 'capitalize',
              fontFamily: 'Avenir Next Light',
              fontSize: '2rem',
              outline: 'none',
              ...(isMobile ? { display: 'none' } : {}),
            }}
            rowHeight={
              isMobile ? window.outerHeight / 12 : window.outerHeight / 14
            }
            rowGetter={({ index }) => processedSelectData[index]}
          >
            {!isMobile && (
              <Column
                label={` `}
                dataKey="favourite"
                disableSort
                headerStyle={{
                  color: theme.colors.persistent.white1,
                  paddingRight: 'calc(10px)',
                  fontSize: '1.5rem',
                  textAlign: 'left',
                  fontFamily: 'Avenir Next Light',
                }}
                width={width / 2}
                style={{
                  textAlign: 'center',
                  fontSize: '1.4rem',
                  fontWeight: 'bold',
                }}
                cellRenderer={({ cellData }) => cellData.render}
              />
            )}
            <Column
              label={` `}
              dataKey="emoji"
              disableSort
              headerStyle={{
                color: theme.colors.white1,
                paddingRight: 'calc(10px)',
                fontSize: '1.5rem',
                textAlign: 'left',
                fontFamily: 'Avenir Next Light',
              }}
              width={isMobile ? width / 4.5 : width / 2}
              style={{
                textAlign: 'left',
                fontSize: '1.4rem',
                fontWeight: 'bold',
              }}
              cellRenderer={({ cellData }) => cellData.render}
            />
            <Column
              label="Market"
              dataKey="symbol"
              headerStyle={{
                color: theme.colors.white1,
                paddingRight: '6px',
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
              label="last price"
              dataKey="price"
              headerStyle={{
                color: theme.colors.white1,
                paddingRight: 'calc(10px)',
                fontSize: '1.5rem',
                textAlign: 'left',
                fontFamily: 'Avenir Next Light',
              }}
              width={width * 2}
              style={{
                textAlign: 'left',
                fontSize: '1.4rem',
                fontWeight: 'bold',
              }}
              cellRenderer={({ cellData }) => cellData.render}
            />
            {isAdvancedSelectorMode && !isMobile && (
              <Column
                label="change 24h"
                dataKey="price24hChange"
                headerStyle={{
                  color: theme.colors.white1,
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
            )}
            {!isMobile && isAdvancedSelectorMode && (
              <Column
                label="Min 24h"
                dataKey="min24h"
                headerStyle={{
                  color: theme.colors.white1,
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
            )}
            {!isMobile && isAdvancedSelectorMode && (
              <Column
                label="Max 24h"
                dataKey="max24h"
                headerStyle={{
                  color: theme.colors.white1,
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
            )}
            {!isMobile && isAdvancedSelectorMode && (
              <Column
                label="volume 24h"
                dataKey="volume24hChange"
                headerStyle={{
                  color: theme.colors.white1,
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
            )}
            {!isMobile && isAdvancedSelectorMode && (
              <Column
                label="trades 24h"
                dataKey="trades24h"
                headerStyle={{
                  color: theme.colors.white1,
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
            )}
            {!isMobile && isAdvancedSelectorMode && (
              <Column
                label="Avg.Buy 14d"
                dataKey="avgBuy14d"
                headerStyle={{
                  color: theme.colors.white1,
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
            )}
            {!isMobile && isAdvancedSelectorMode && (
              <Column
                label="Avg.Sell 14d"
                dataKey="avgSell14d"
                headerStyle={{
                  color: theme.colors.white1,
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
            )}
            {!isMobile && (
              <Column
                label="Links"
                dataKey="links"
                disableSort
                headerStyle={{
                  color: theme.colors.white1,
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
            )}
          </Table>
        )}
      </StyledAutoSizer>
    </StyledTable>
  )
}
