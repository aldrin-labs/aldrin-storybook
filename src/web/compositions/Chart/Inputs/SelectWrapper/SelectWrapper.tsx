import { queryRendererHoc } from '@core/components/QueryRenderer'
import { fiatPairs } from '@core/config/stableCoins'
import { getSerumMarketData } from '@core/graphql/queries/chart/getSerumMarketData'
import { withMarketUtilsHOC } from '@core/hoc/withMarketUtilsHOC'
import { withPublicKey } from '@core/hoc/withPublicKey'
import search from '@icons/search.svg'
import { sortBy as sort } from 'lodash-es'
import { Grid, InputAdornment } from '@material-ui/core'
import { withTheme } from '@material-ui/core/styles'
import { SvgIcon } from '@sb/components'
import { Row } from '@sb/compositions/AnalyticsRoute/index.styles'
import { useLocalStorageState } from '@sb/dexUtils/utils'
import dayjs from 'dayjs'
import React, { useState } from 'react'
import { withRouter } from 'react-router'
import { SortDirection, SortDirectionType } from 'react-virtualized'
import 'react-virtualized/styles.css'
import { compose } from 'recompose'
import { MarketsFeedbackPopup } from './MarketsFeedbackPopup'
import { MintsPopup } from './MintsPopup'
import {
  IProps,
  IPropsSelectPairListComponent,
  ISelectData,
  ISelectUIDataItem,
  SelectTabType,
  UserTabs,
} from './SelectWrapper.types'
import { filterSelectorDataByTab, prepareData } from './SelectWrapper.utils'
import { StyledGrid, StyledInput, TableFooter } from './SelectWrapperStyles'
import { TableHeader } from './TableHeader'
import { TableInner } from './TableInner'
import { useAllMarketsList } from '../../../../dexUtils/markets'
import { useTokenInfos } from '../../../../dexUtils/tokenRegistry'

export const excludedPairs: string[] = [
  // 'USDC_ODOP',
  // 'KIN_USDT',
  // 'MIDBEAR_USDT',
  // 'MIDBULL_USDT',
  // 'XRPBEAR_USDT',
  // 'XRPBULL_USDT',
  // 'SWAG_USDT'
]

export const datesForQuery = {
  startOfTime: () => dayjs()
    .startOf('hour')
    .subtract(24, 'hour')
    .unix(),

  endOfTime: () => dayjs()
    .endOf('hour')
    .unix(),

  prevStartTimestamp: () => dayjs()
    .startOf('hour')
    .subtract(48, 'hour')
    .unix(),

  prevEndTimestamp: () => dayjs()
    .startOf('hour')
    .subtract(24, 'hour')
    .unix(),
}

export const fiatRegexp = new RegExp(fiatPairs.join('|'), 'gi')

const SelectWrapper: React.FC<IProps> = (props) => {
  const [searchValue, setSearchValue] = useState('')
  const [tab, setTab] = useState<SelectTabType>('all')

  // TODO: Uncomment once Postgres HA deployed

  // const [selectorMode, setSelectorMode] = useLocalStorageState(
  //   'selectorMode',
  //   'basic'
  // )

  const selectorMode = 'basic'
  const setSelectorMode = () => { }

  const [favouriteMarketsRaw, setFavouriteMarkets] = useLocalStorageState(
    'favouriteMarkets',
    JSON.stringify([])
  )

  const favouriteMarkets: string[] = JSON.parse(favouriteMarketsRaw)

  const toggleFavouriteMarket = (pair: string) => {
    if (favouriteMarkets.includes(pair)) {
      setFavouriteMarkets(
        JSON.stringify(favouriteMarkets.filter((el) => el !== pair))
      )
    } else {
      setFavouriteMarkets(JSON.stringify([...favouriteMarkets, pair]))
    }
  }

  const onChangeSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!`${e.target.value}`.match(/[a-zA-Z1-9]/) && e.target.value !== '') {
      return
    }

    setSearchValue(e.target.value)
  }

  const { getSerumMarketDataQuery = { getSerumMarketData: [] } } = props

  const filtredMarketsByExchange = getSerumMarketDataQuery.getSerumMarketData.filter(
    (el) =>
      el.symbol &&
      !Array.isArray(el.symbol.match(fiatRegexp)) &&
      !excludedPairs.includes(el.symbol)
  )

  const favouritePairs = favouriteMarkets.reduce(
    (acc, el: string) => {
      acc.add(el)

      return acc
    },
    new Set<string>()
  )

  // console.log('filtredMarketsByExchange:', filtredMarketsByExchange)
  return (
    <SelectPairListComponent
      tab={tab}
      data={filtredMarketsByExchange}
      favouritePairs={favouritePairs}
      searchValue={searchValue}
      selectorMode={selectorMode}
      setSelectorMode={setSelectorMode}
      onChangeSearch={onChangeSearch}
      onTabChange={setTab}
      toggleFavouriteMarket={toggleFavouriteMarket}
      {...props}
    />
  )
}

const SEARCH_INPUT_PROPS = {
  style: {
    color: '#96999C',
    fontSize: '16px',
  },
}
const SEARCH_ADORMENT_STYLE = {
  width: '10%',
  justifyContent: 'flex-end',
  cursor: 'pointer',
  color: '#96999C',
}


// const itemsSorter = (pairObjectA: ISelectUIDataItem, pairObjectB: ISelectUIDataItem) => {
//   const quoteA = pairObjectA.symbol.split('_')[1]
//   const quoteB = pairObjectB.symbol.split('_')[1]

//   if (quoteA === 'USDT' && quoteB === 'USDT') {
//     return (
//       pairObjectB.volume24hChange.contentToSort -
//       pairObjectA.volume24hChange.contentToSort
//     )
//   } else if (quoteA === 'USDT') {
//     return -1
//   } else if (quoteB === 'USDT') {
//     return 1
//   } else if (quoteA !== 'USDT' && quoteB !== 'USDT') {
//     return (
//       pairObjectB.volume24hChange.contentToSort -
//       pairObjectA.volume24hChange.contentToSort
//     )
//   }
//   return 0
// }

interface MarketData {
  symbol: string
  marketAddress: string
}

const dataSorter = (
  sortBy: string,
  sortDirection: SortDirectionType,
  tab: SelectTabType | null = null,
  data: ISelectUIDataItem[],
  marketType: 0 | 1
): ISelectUIDataItem[] => {
  let newList = [...data]

  if (tab === 'topGainers' || tab === 'topLosers') {
    return newList
  }

  // const CCAIMarket = newList.find(v => v.symbol.contentToSort === 'RIN_USDC')

  if (marketType === 0 && sortBy === 'volume24hChange') {
    // newList.sort(itemsSorter)
  } else {
    newList = sort(newList, [sortBy])
    if (sortDirection === SortDirection.DESC) {
      newList = newList.reverse()
    }
  }

  const ccaiIndex = newList.findIndex(
    (v) => v.symbol === 'RIN_USDC'
  )
  if (ccaiIndex === -1) return newList

  const updatedList = [
    newList[ccaiIndex],
    ...newList.slice(0, ccaiIndex),
    ...newList.slice(ccaiIndex + 1),
  ]

  return updatedList
}

const groupDataByCategory = (
  data: ISelectData,
  allMarketsMap: Map<string, any>,
  tokenMap: Map<string, any>,
  favouritePairs: Set<string>,
) => {
  const result: { [c: string]: ISelectData } = {}
  for (const tab in UserTabs) {
    result[tab] = filterSelectorDataByTab({
      tab: tab as SelectTabType, // TODO
      data,
      allMarketsMap,
      tokenMap,
      favouritePairs
    })
  }
  return result
}

const SelectPairListComponent: React.FC<IPropsSelectPairListComponent> = (props) => {
  const [sortBy, setSortBy] = useState('volume24hChange')
  const [sortDirection, setSortDirection] = useState<SortDirectionType>(SortDirection.DESC)
  const [choosenMarketData, changeChoosenMarketData] = useState<MarketData | null>(null)
  const [isMintsPopupOpen, setIsMintsPopupOpen] = useState(false)
  const [isFeedBackPopupOpen, setFeedBackPopupOpen] = useState(false)

  const allMarketsMap = useAllMarketsList()
  const tokenMap = useTokenInfos()


  const _sort = (info: { sortBy: string; sortDirection: SortDirectionType }) => {
    const { sortBy, sortDirection } = info
    // const processedSelectData = dataSorter(sortBy, sortDirection, tab, processedSelectData, marketType)
    setSortBy(sortBy)
    setSortDirection(sortDirection)
    // setProcessedSelectedData(processedSelectData)
  }

  const {
    theme,
    searchValue,
    tab,
    id,
    data,
    onChangeSearch,
    selectorMode,
    favouritePairs,
    setSelectorMode,
    onTabChange,
    marketType,
    toggleFavouriteMarket,
    onSelectPair,
  } = props


  const byTab = groupDataByCategory(data, allMarketsMap, tokenMap, favouritePairs)

  const isAdvancedSelectorMode = selectorMode === 'advanced'

  const dataForTab = prepareData(byTab[tab], favouritePairs, allMarketsMap, tokenMap, searchValue)

  const sorted = dataSorter(sortBy, sortDirection, tab, dataForTab, marketType)
  // console.log('dataForTab: ', data, dataForTab, tab)

  return (
    <StyledGrid
      theme={theme}
      id={id}
      isAdvancedSelectorMode={isAdvancedSelectorMode}
    >
      <TableHeader
        theme={theme}
        tab={tab}
        onTabChange={onTabChange}
        isAdvancedSelectorMode={isAdvancedSelectorMode}
        setSelectorMode={setSelectorMode}
        marketsByTab={byTab}
      />
      <Grid container style={{ justifyContent: 'flex-end', width: '100%' }}>
        <StyledInput
          placeholder="Search"
          disableUnderline={true}
          value={searchValue}
          onChange={onChangeSearch}
          inputProps={SEARCH_INPUT_PROPS}
          endAdornment={
            <InputAdornment
              style={SEARCH_ADORMENT_STYLE}
              disableTypography={true}
              position="end"
            >
              <SvgIcon src={search} width="1.5rem" height="auto" />
            </InputAdornment>
          }
        />
      </Grid>
      <TableInner
        theme={theme}
        data={sorted}
        isAdvancedSelectorMode={isAdvancedSelectorMode}
        sort={_sort}
        sortBy={sortBy}
        sortDirection={sortDirection}
        toggleFavouriteMarket={toggleFavouriteMarket}
        changeChoosenMarketData={changeChoosenMarketData}
        setIsMintsPopupOpen={setIsMintsPopupOpen}
        onSelectPair={(p) => {
          onChangeSearch({ target: { value: '' } })
          onSelectPair(p)
        }}
      />
      <TableFooter container>
        <Row
          style={{
            padding: '0 2rem',
            height: '4rem',
            fontFamily: 'Avenir Next Medium',
            color: theme?.palette.blue.serum,
            alignItems: 'center',
            fontSize: '1.5rem',
            textTransform: 'none',
            textDecoration: 'underline',
          }}
          onClick={(e) => {
            e.stopPropagation()
            setFeedBackPopupOpen(true)
          }}
        >
          Found an error in the catalog? Let us know!
        </Row>
      </TableFooter>
      {choosenMarketData &&
        <MintsPopup
          theme={theme}
          symbol={choosenMarketData.symbol}
          marketAddress={choosenMarketData.marketAddress}
          open={isMintsPopupOpen}
          onClose={() => setIsMintsPopupOpen(false)}
        />
      }
      <MarketsFeedbackPopup
        theme={theme}
        open={isFeedBackPopupOpen}
        onClose={() => setFeedBackPopupOpen(false)}
      />
    </StyledGrid>

  )
}

export default compose(
  withMarketUtilsHOC,
  withRouter,
  // withAuthStatus,
  withPublicKey,
  withTheme(),
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
  // queryRendererHoc({
  //   query: getSerumTradesData,
  //   name: 'getSerumTradesDataQuery',
  //   variables: (props) => ({
  //     timezone: getTimezone(),
  //     timestampTo: endOfDayTimestamp(),
  //     timestampFrom: endOfDayTimestamp() - dayDuration * 14,
  //   }),
  //   withoutLoading: true,
  //   withOutSpinner: true,
  //   withTableLoader: false,
  //   showNoLoader: true,
  //   fetchPolicy: 'cache-and-network',
  // })
)(SelectWrapper)
