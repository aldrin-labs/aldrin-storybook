import React, { useState, useEffect } from 'react'
import { withRouter } from 'react-router-dom'
import { compose } from 'recompose'
import { Grid, Input, InputAdornment } from '@material-ui/core'
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer'
import { Column, Table, SortDirection } from 'react-virtualized'
import 'react-virtualized/styles.css'

import { Theme } from '@material-ui/core'
import { getSerumMarketData } from '@core/graphql/queries/chart/getSerumMarketData'
import { queryRendererHoc } from '@core/components/QueryRenderer'
import { combineSelectWrapperData } from '@sb/compositions/Chart/Inputs/SelectWrapper/SelectWrapper.utils'
import search from '@icons/search.svg'

import { SvgIcon } from '@sb/components'

import {
  datesForQuery,
  excludedPairs,
  fiatRegexp,
} from '@sb/compositions/Chart/Inputs/SelectWrapper/SelectWrapper'

import {
  HeaderContainer,
  WhiteTitle,
  PairSelectorContainerGrid,
} from '../index.styles'
import { useAllMarketsList, useCustomMarkets } from '@sb/dexUtils/markets'

const _sortList = ({ sortBy, sortDirection, data }) => {
  let dataToSort = data
  let newList = [...dataToSort]
  const isASCSort = sortDirection === SortDirection.ASC

  newList.sort((pairObjectA, pairObjectB) => {
    if (pairObjectA.symbol.contentToSort === 'All markets')
      return isASCSort ? 1 : -1
    if (pairObjectB.symbol.contentToSort === 'All markets')
      return isASCSort ? -1 : 1

    if (pairObjectA.symbol.contentToSort === 'RIN_USDC')
      return isASCSort ? 1 : -1
    if (pairObjectB.symbol.contentToSort === 'RIN_USDC')
      return isASCSort ? -1 : 1

    if (sortBy === 'volume24hChange') {
      return (
        pairObjectB.volume24hChange.contentToSort -
        pairObjectA.volume24hChange.contentToSort
      )
    } else {
      return pairObjectB.symbol.contentToSort.localeCompare(
        pairObjectA.symbol.contentToSort
      )
    }
  })

  if (sortDirection === SortDirection.ASC) {
    newList = newList.reverse()
  }

  // const ccaiIndex = newList.findIndex(
  //   (v) => v.symbol.contentToSort === 'RIN_USDC'
  // )

  // if (ccaiIndex === -1) return newList

  // const updatedList = [
  //   newList[ccaiIndex],
  //   ...newList.slice(0, ccaiIndex),
  //   ...newList.slice(ccaiIndex + 1),
  // ]

  return newList
}

export const defaultRowRenderer = ({
  className,
  columns,
  index,
  key,
  onRowClick,
  onRowDoubleClick,
  onRowMouseOut,
  onRowMouseOver,
  onRowRightClick,
  rowData,
  style,
  selectedPair,
}) => {
  const a11yProps = { 'aria-rowindex': index + 1 }

  if (
    onRowClick ||
    onRowDoubleClick ||
    onRowMouseOut ||
    onRowMouseOver ||
    onRowRightClick
  ) {
    a11yProps['aria-label'] = 'row'
    a11yProps.tabIndex = 0

    if (onRowClick) {
      a11yProps.onClick = (event) => onRowClick({ event, index, rowData })
    }
    if (onRowDoubleClick) {
      a11yProps.onDoubleClick = (event) =>
        onRowDoubleClick({ event, index, rowData })
    }
    if (onRowMouseOut) {
      a11yProps.onMouseOut = (event) => onRowMouseOut({ event, index, rowData })
    }
    if (onRowMouseOver) {
      a11yProps.onMouseOver = (event) =>
        onRowMouseOver({ event, index, rowData })
    }
    if (onRowRightClick) {
      a11yProps.onContextMenu = (event) =>
        onRowRightClick({ event, index, rowData })
    }
  }

  const isSelected =
    rowData &&
    (rowData.symbol.contentToSort === selectedPair ||
      (rowData.symbol.contentToSort.toLowerCase().includes('all') &&
        selectedPair === 'all'))

  console.log('className', className)

  return (
    <div
      {...a11yProps}
      className={className}
      key={key}
      role="row"
      style={{
        ...style,
        background: isSelected ? 'rgba(55, 56, 62, 0.75)' : '',
      }}
    >
      {columns}
    </div>
  )
}

const PairSelector = ({
  theme,
  history,
  selectedPair,
  getSerumMarketDataQuery,
}: {
  theme: Theme
  selectedPair: string
  getSerumMarketDataQuery: {
    getSerumMarketData: {
      symbol: string
      volume: number
      tradesCount: number
      tradesDiff: number
      volumeChange: number
      minPrice: number
      maxPrice: number
      closePrice: number
      precentageTradesDiff: number
      lastPriceDiff: number
      isCustomUserMarket: boolean
      isPrivateCustomMarket: boolean
      address: string
      programId: string
    }[]
  }
}) => {
  const [searchValue, onChangeSearch] = useState('')
  const [sortBy, updateSortBy] = useState('volume24hChange')
  const [sortDirection, updateSortDirection] = useState(SortDirection.DESC)
  const [processedSelectData, updateProcessedSelectData] = useState([])
  const allMarketsMap = useAllMarketsList()

  const filtredMarketsByExchange = getSerumMarketDataQuery.getSerumMarketData.filter(
    (el) =>
      el.symbol &&
      !Array.isArray(el.symbol.match(fiatRegexp)) &&
      !excludedPairs.includes(el.symbol)
  )

  const allMarketsValue = filtredMarketsByExchange
    .filter(
      (market, index, arr) =>
        arr.findIndex(
          (marketInFindIndex) => marketInFindIndex.symbol === market.symbol
        ) === index
    )
    .reduce(
      (acc, curr) => {
        return {
          ...acc,
          volume: acc.volume + +curr.volume,
          tradesCount: acc.tradesCount + curr.tradesCount,
          tradesDiff: acc.tradesDiff + curr.tradesDiff,
          volumeChange: acc.volumeChange + curr.volumeChange,
          minPrice: acc.minPrice + curr.minPrice,
          maxPrice: acc.maxPrice + curr.maxPrice,
          closePrice: acc.closePrice + curr.closePrice,
          precentageTradesDiff:
            acc.precentageTradesDiff + curr.precentageTradesDiff,
          lastPriceDiff: acc.lastPriceDiff + curr.lastPriceDiff,
        }
      },
      {
        symbol: 'All markets',
        volume: 0,
        tradesCount: 0,
        tradesDiff: 0,
        volumeChange: 0,
        minPrice: 0,
        maxPrice: 0,
        closePrice: 0,
        precentageTradesDiff: 0,
        lastPriceDiff: 0,
        isCustomUserMarket: false,
        isPrivateCustomMarket: false,
        address: null,
        programId: null,
      }
    )

  filtredMarketsByExchange.push(allMarketsValue)

  const _sort = ({ sortBy, sortDirection, firstData }) => {
    let data = firstData

    if (!data) data = processedSelectData

    const updatedData = _sortList({ sortBy, sortDirection, data })

    updateSortBy(sortBy)
    updateSortDirection(sortDirection)
    updateProcessedSelectData(updatedData)
  }

  useEffect(() => {
    const processedSelectData = combineSelectWrapperData({
      data: filtredMarketsByExchange,
      onSelectPair: ({ value }) =>
        history.push(`/analytics/${value === 'All markets' ? 'all' : value}`),
      theme,
      searchValue,
      tab: 'all',
      favouritePairs: new Set(),
      tokenMap: new Map(),
      allMarketsMap,
    })

    _sort({ firstData: processedSelectData, sortBy, sortDirection })
  }, [searchValue])
  return (
    <>
      <HeaderContainer theme={theme}>
        <WhiteTitle theme={theme}>Markets</WhiteTitle>
      </HeaderContainer>
      <Grid container style={{ justifyContent: 'flex-end', width: '100%' }}>
        <Input
          placeholder="Search"
          disableUnderline={true}
          style={{
            width: '100%',
            height: '3rem',
            background: '#3A475C',
            // borderRadius: '0.3rem',
            color: theme.palette.grey.placeholder,
            borderBottom: `.1rem solid ${theme.palette.grey.newborder}`,
            paddingLeft: '1rem',
          }}
          value={searchValue}
          onChange={(e) => {
            if (
              !`${e.target.value}`.match(/[a-zA-Z1-9]/) &&
              e.target.value !== ''
            ) {
              return
            }
            onChangeSearch(e.target.value)
          }}
          endAdornment={
            <InputAdornment
              style={{
                width: '10%',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
              disableTypography={true}
              position="end"
              aria-autocomplete="none"
            >
              <SvgIcon src={search} width="1.5rem" height="auto" />
            </InputAdornment>
          }
        />
      </Grid>
      <PairSelectorContainerGrid
        style={{
          overflow: 'hidden',
          width: '100%',
          height: 'calc(100% - 8rem)',
        }}
      >
        <AutoSizer>
          {({ width, height }: { width: number; height: number }) => (
            <Table
              width={width}
              height={height}
              sort={_sort}
              sortDirection={sortDirection}
              sortBy={sortBy}
              rowCount={processedSelectData.length}
              onRowClick={({ event, index, rowData }) => {
                rowData.symbol.onClick()
              }}
              gridStyle={{
                outline: 'none',
              }}
              rowRenderer={(...props) =>
                defaultRowRenderer({ ...props[0], selectedPair })
              }
              rowClassName={'pairSelectorRow'}
              rowStyle={{
                outline: 'none',
                cursor: 'pointer',
                fontSize: '1.4rem',
                color: theme.palette.dark.main,
                borderBottom: `0.05rem solid ${theme.palette.grey.newborder}`,
              }}
              headerHeight={window.outerHeight / 40}
              headerStyle={{
                color: theme.palette.grey.light,
                paddingLeft: '.5rem',
                paddingTop: '.25rem',
                marginLeft: 0,
                marginRight: 0,
                letterSpacing: '.075rem',
                whiteSpace: 'nowrap',
                // borderBottom: '.1rem solid #e0e5ec',
                fontSize: '1.2rem',
                outline: 'none',
              }}
              rowHeight={window.outerHeight / 30}
              rowGetter={({ index }) => processedSelectData[index]}
            >
              <Column
                label={``}
                dataKey="emoji"
                headerStyle={{
                  textTransform: 'capitalize',
                  color: theme.palette.grey.title,
                  paddingRight: '6px',
                  paddingLeft: '1rem',
                  fontSize: '1.2rem',
                  textAlign: 'left',
                }}
                width={width / 1.5}
                cellRenderer={({ cellData }) => cellData.render}
              />
              <Column
                label={`Name`}
                dataKey="symbol"
                headerStyle={{
                  textTransform: 'capitalize',
                  color: theme.palette.grey.title,
                  paddingRight: '6px',
                  paddingLeft: '1rem',
                  fontSize: '1.4rem',
                  textAlign: 'left',
                }}
                width={width * 1.5}
                style={{
                  textAlign: 'left',
                  fontSize: '1.3rem',
                  fontWeight: 'bold',
                }}
                cellRenderer={({ cellData }) => cellData.render}
              />
              <Column
                label={`Volume 24h`}
                dataKey="volume24hChange"
                headerStyle={{
                  textTransform: 'capitalize',
                  color: theme.palette.grey.title,
                  paddingRight: 'calc(10px)',
                  fontSize: '1.4rem',
                  textAlign: 'left',
                }}
                width={width * 2}
                style={{
                  textAlign: 'left',
                  fontSize: '1.3rem',
                  fontWeight: 'bold',
                }}
                cellRenderer={({ cellData }) => cellData.render}
              />
              <Column
                label={` `}
                dataKey="volume24hChangeIcon"
                width={width / 3}
                disableSort
                cellRenderer={({ cellData }) => cellData.render}
              />
            </Table>
          )}
        </AutoSizer>
      </PairSelectorContainerGrid>
    </>
  )
}

export default compose(
  withRouter,
  queryRendererHoc({
    query: getSerumMarketData,
    name: 'getSerumMarketDataQuery',
    variables: (props) => ({
      exchange: 'serum',
      publicKey: props.publicKey,
      marketType: 0,
      startTimestamp: `${datesForQuery.startOfTime()}`,
      endTimestamp: `${datesForQuery.endOfTime()}`,
      prevStartTimestamp: `${datesForQuery.prevStartTimestamp()}`,
      prevEndTimestamp: `${datesForQuery.prevEndTimestamp()}`,
    }),
    // TODO: make chache-first here and in CHART by refetching this after adding market
    fetchPolicy: 'cache-and-network',
    withOutSpinner: true,
    withTableLoader: false,
  })
)(PairSelector)
