import { Grid, InputAdornment } from '@material-ui/core'
import dayjs from 'dayjs'
import { sortBy, partition } from 'lodash-es'
import React, { useState, useEffect, useCallback } from 'react'
import { withRouter } from 'react-router'
import { useHistory } from 'react-router-dom'
import { SortDirection } from 'react-virtualized'
import { compose } from 'recompose'

import { SvgIcon } from '@sb/components'
import { queryRendererHoc } from '@sb/components/QueryRenderer'
import {
  getTimezone,
  endOfDayTimestamp,
} from '@sb/compositions/AnalyticsRoute/components/utils'
import { Row } from '@sb/compositions/AnalyticsRoute/index.styles'
import { WarningPopup } from '@sb/compositions/Chart/components/WarningPopup'
import { notify } from '@sb/dexUtils/notifications'
import { useLocalStorageState } from '@sb/dexUtils/utils'
import { withMarketUtilsHOC } from '@sb/hoc'
import { withPublicKey } from '@sb/hoc/withPublicKey'

import { fiatPairs } from '@core/config/stableCoins'
import { getSerumMarketData } from '@core/graphql/queries/chart/getSerumMarketData'
import { getSerumTradesData } from '@core/graphql/queries/chart/getSerumTradesData'
import { withAuthStatus } from '@core/hoc/withAuthStatus'
import { dayDuration } from '@core/utils/dateUtils'

import search from '@icons/search.svg'

import 'react-virtualized/styles.css'

import { DEX_PID } from '../../../../../../../core/src/config/dex'
import { useAllMarketsList } from '../../../../dexUtils/markets'
import { MarketsFeedbackPopup } from './MarketsFeedbackPopup'
import { MintsPopup } from './MintsPopup'
import {
  IProps,
  IPropsSelectPairListComponent,
  SelectTabType,
} from './SelectWrapper.types'
import { combineSelectWrapperData } from './SelectWrapper.utils'
import { StyledGrid, StyledInput, TableFooter } from './SelectWrapperStyles'
import { TableHeader } from './TableHeader'
import { TableInner } from './TableInner'

const PINNED_LIST = ['RIN_USDC']

export const datesForQuery = {
  startOfTime: () => dayjs().startOf('hour').subtract(24, 'hour').unix(),
  endOfTime: () => dayjs().endOf('hour').unix(),
  prevStartTimestamp: () => dayjs().startOf('hour').subtract(48, 'hour').unix(),
  prevEndTimestamp: () => dayjs().startOf('hour').subtract(24, 'hour').unix(),
}

export const fiatRegexp = new RegExp(fiatPairs.join('|'), 'gi')

const SelectPairListComponent = (props: IPropsSelectPairListComponent) => {
  const history = useHistory()
  const [displayedData, setDisplayedData] = useState([])
  const [sort, setSort] = useState({
    field: 'volume24hChange',
    direction: SortDirection.DESC,
  })
  const [choosenMarketData, setChoosenMarketData] = useState({})
  const [isMintsPopupOpen, setIsMintsPopupOpen] = useState(false)
  const [isFeedbackPopupOpen, setIsFeedbackPopupOpen] = useState(false)
  const [isLoading, setIsLoading] = useState<boolean | null>(null)

  const {
    data,
    toggleFavouriteMarket,
    onSelectPair,
    theme,
    searchValue,
    tab,
    getSerumTradesDataQuery,
    customMarkets,
    tokenMap,
    allMarketsMap,
    favouriteMarkets,
    marketType,
    id,
    onChangeSearch,
    selectorMode,
    setSelectorMode,
    setCustomMarkets,
    getSerumMarketDataQueryRefetch,
    onTabChange,
    marketName,
  } = props

  const isLoaded = isLoading === false

  const isAdvancedSelectorMode = selectorMode === 'advanced'

  const changeChoosenMarketData = ({ symbol, marketAddress }) => {
    setChoosenMarketData({ symbol, marketAddress })
  }

  const _sortList = (data) => {
    let newList = [...data]

    if (tab === 'topGainers' || tab === 'topLosers') {
      return newList
    }

    if (marketType === 0 && sort.field === 'volume24hChange') {
      newList.sort((pairObjectA, pairObjectB) => {
        const quoteA = pairObjectA.symbol.contentToSort.split('_')[1]
        const quoteB = pairObjectB.symbol.contentToSort.split('_')[1]

        if (quoteA === 'USDT' && quoteB === 'USDT') {
          return (
            pairObjectB.volume24hChange.contentToSort -
            pairObjectA.volume24hChange.contentToSort
          )
        }
        if (quoteA === 'USDT') {
          return -1
        }
        if (quoteB === 'USDT') {
          return 1
        }
        if (quoteA !== 'USDT' && quoteB !== 'USDT') {
          return (
            pairObjectB.volume24hChange.contentToSort -
            pairObjectA.volume24hChange.contentToSort
          )
        }
      })
    } else {
      newList = sortBy(data, [`${sort.field}.contentToSort`])
      if (sort.direction === SortDirection.DESC) {
        newList = newList.reverse()
      }
    }

    const ccaiIndex = newList.findIndex(
      (v) => v.symbol.contentToSort === 'RIN_USDC'
    )
    if (ccaiIndex === -1) return newList

    const [topMarkets, regularMarkets] = partition(newList, (item) =>
      PINNED_LIST.includes(item.id)
    )

    return [...topMarkets, ...regularMarkets]
  }

  const _sort = ({ sortBy, sortDirection }) => {
    setSort({ field: sortBy, direction: sortDirection })
  }

  const onAddCustomMarket = (customMarket: any) => {
    const marketInfo = [...allMarketsMap.values()].some(
      (m) => m.address.toBase58() === customMarket.address
    )

    if (marketInfo) {
      notify({
        message: `A market with the given ID already exists`,
        type: 'error',
      })

      return false
    }

    const newCustomMarkets = [...customMarkets, customMarket]
    setCustomMarkets(newCustomMarkets)
    history.push(`/chart/spot/${customMarket.name.replace('/', '_')}`)

    return true
  }

  const getData = () => {
    const serumMarketsDataMap = new Map()

    getSerumTradesDataQuery?.getSerumTradesData?.forEach((el) =>
      serumMarketsDataMap.set(el.pair, el)
    )

    return _sortList(
      combineSelectWrapperData({
        data,
        toggleFavouriteMarket,
        onSelectPair,
        favouriteMarkets,
        theme,
        searchValue,
        tab,
        tokenMap,
        serumMarketsDataMap,
        allMarketsMap,
        setIsMintsPopupOpen,
        changeChoosenMarketData,
      })
    )
  }

  useEffect(() => {
    setIsLoading(true)

    setDisplayedData(getData())

    setIsLoading(false)
  }, [])

  useEffect(() => {
    if (isLoaded) {
      setDisplayedData(_sortList(getData()))
    }
  }, [sort])

  useEffect(() => {
    if (isLoaded) {
      setDisplayedData(getData())
    }
  }, [tab, searchValue])

  useEffect(() => {
    if (isLoaded) {
      setDisplayedData(getData())
    }
  }, [favouriteMarkets])

  return (
    <StyledGrid id={id} isAdvancedSelectorMode={isAdvancedSelectorMode}>
      <TableHeader
        tab={tab}
        favouriteMarkets={favouriteMarkets}
        tokenMap={tokenMap}
        data={data}
        onTabChange={onTabChange}
        allMarketsMap={allMarketsMap}
        isAdvancedSelectorMode={isAdvancedSelectorMode}
        setSelectorMode={setSelectorMode}
      />
      <Grid container style={{ justifyContent: 'flex-end', width: '100%' }}>
        <StyledInput
          placeholder="Search"
          disableUnderline
          value={searchValue}
          onChange={onChangeSearch}
          inputProps={{
            style: {
              color: theme.palette.grey.new,
              fontSize: '16px',
            },
          }}
          endAdornment={
            <InputAdornment
              style={{
                width: '10%',
                justifyContent: 'flex-end',
                cursor: 'pointer',
                color: theme.palette.grey.new,
              }}
              disableTypography
              position="end"
              autoComplete="off"
            >
              <SvgIcon src={search} width="1.5rem" height="auto" />
            </InputAdornment>
          }
        />
      </Grid>
      <TableInner
        selectorMode={selectorMode}
        processedSelectData={displayedData}
        isAdvancedSelectorMode={isAdvancedSelectorMode}
        sort={_sort}
        sortBy={sort.field}
        sortDirection={sort.direction}
        selectedPair={marketName?.replace('/', '_')}
      />
      <TableFooter container>
        <Row
          style={{
            padding: '0 2rem',
            height: '4rem',
            fontFamily: 'Avenir Next Medium',
            color: theme.palette.blue.serum,
            alignItems: 'center',
            fontSize: '1.5rem',
            textTransform: 'none',
            textDecoration: 'underline',
          }}
          onClick={async (e) => {
            e.stopPropagation()
            setIsFeedbackPopupOpen(true)
          }}
        >
          Found an error in the catalog? Let us know!
        </Row>
      </TableFooter>
      <WarningPopup />
      <MintsPopup
        symbol={choosenMarketData?.symbol}
        marketAddress={choosenMarketData?.marketAddress}
        open={isMintsPopupOpen}
        onClose={() => setIsMintsPopupOpen(false)}
      />
      <MarketsFeedbackPopup
        open={isFeedbackPopupOpen}
        onClose={() => setIsFeedbackPopupOpen(false)}
      />
    </StyledGrid>
  )
}

const SelectWrapper = (props: IProps) => {
  const [searchValue, setSearchValue] = useState('')
  const [tab, setTab] = useState<SelectTabType>('live')
  const markets = useAllMarketsList()

  const [selectorMode, setSelectorMode] = useLocalStorageState(
    'selectorMode',
    'basic'
  )

  const [favouriteMarkets, setFavouriteMarkets] = useLocalStorageState<
    string[]
  >('favouriteMarkets', [])

  const toggleFavouriteMarket = useCallback(
    (pair: string) => {
      const newFavouriteMarkets = favouriteMarkets.includes(pair)
        ? favouriteMarkets.filter((el) => el !== pair)
        : [...favouriteMarkets, pair]

      setFavouriteMarkets(newFavouriteMarkets)
    },
    [favouriteMarkets]
  )

  const onChangeSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!`${e.target.value}`.match(/[a-zA-Z1-9]/) && e.target.value !== '') {
      return
    }

    setSearchValue(e.target.value)
  }

  const { getSerumMarketDataQuery = { getSerumMarketData: [] } } = props

  const filtredMarketsByExchange = getSerumMarketDataQuery.getSerumMarketData
    .filter((el) => {
      return el.symbol && !Array.isArray(el.symbol.match(fiatRegexp))
    })
    .map((_) => ({
      ..._,
      programId: _.programId || markets.get(_.symbol)?.programId?.toString(),
    }))

  filtredMarketsByExchange.push({
    address: null,
    closePrice: 0,
    isCustomUserMarket: null,
    isPrivateCustomMarket: null,
    lastPriceDiff: 0,
    maxPrice: null,
    minPrice: null,
    precentageTradesDiff: -100,
    programId: DEX_PID,
    symbol: 'RIN_USDC_deprecated',
    tradesCount: null,
    tradesDiff: 0,
    volume: 0,
    volumeChange: 0,
  })

  return (
    <SelectPairListComponent
      tab={tab}
      data={filtredMarketsByExchange}
      favouriteMarkets={favouriteMarkets}
      toggleFavouriteMarket={toggleFavouriteMarket}
      searchValue={searchValue}
      selectorMode={selectorMode}
      setSelectorMode={setSelectorMode}
      onChangeSearch={onChangeSearch}
      onTabChange={setTab}
      {...props}
    />
  )
}

export default compose(
  withMarketUtilsHOC,
  withRouter,
  withAuthStatus,
  withPublicKey,
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
    fetchPolicy: 'cache-and-network',
    withOutSpinner: true,
    withTableLoader: false,
    showNoLoader: true,
  }),
  queryRendererHoc({
    query: getSerumTradesData,
    name: 'getSerumTradesDataQuery',
    variables: () => ({
      timezone: getTimezone(),
      timestampTo: endOfDayTimestamp(),
      timestampFrom: endOfDayTimestamp() - dayDuration * 14,
    }),
    withoutLoading: true,
    withOutSpinner: true,
    withTableLoader: false,
    showNoLoader: true,
    fetchPolicy: 'cache-and-network',
  })
)(SelectWrapper)
