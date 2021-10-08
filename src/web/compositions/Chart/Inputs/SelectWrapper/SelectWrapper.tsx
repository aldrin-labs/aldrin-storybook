import { queryRendererHoc } from '@core/components/QueryRenderer'
import { fiatPairs } from '@core/config/stableCoins'
import { getSerumMarketData } from '@core/graphql/queries/chart/getSerumMarketData'
import { withAuthStatus } from '@core/hoc/withAuthStatus'
import { withMarketUtilsHOC } from '@core/hoc/withMarketUtilsHOC'
import { withPublicKey } from '@core/hoc/withPublicKey'
import search from '@icons/search.svg'
import { sortBy as sort } from 'lodash-es'
import { Grid, InputAdornment } from '@material-ui/core'
import { withTheme } from '@material-ui/core/styles'
import { SvgIcon } from '@sb/components'
import { Row } from '@sb/compositions/AnalyticsRoute/index.styles'
import { WarningPopup } from '@sb/compositions/Chart/components/WarningPopup'
import CustomMarketDialog from '@sb/compositions/Chart/Inputs/SelectWrapper/AddCustomMarketPopup'
import { notify } from '@sb/dexUtils/notifications'
import { useLocalStorageState } from '@sb/dexUtils/utils'
import dayjs from 'dayjs'
import React, { useState } from 'react'
import { withRouter } from 'react-router'
import { SortDirection } from 'react-virtualized'
import 'react-virtualized/styles.css'
import { compose } from 'recompose'
import { MarketsFeedbackPopup } from './MarketsFeedbackPopup'
import { MintsPopup } from './MintsPopup'
import {
  IProps,
  IPropsSelectPairListComponent,
  IStateSelectPairListComponent,
  SelectTabType,
} from './SelectWrapper.types'
import { combineSelectWrapperData } from './SelectWrapper.utils'
import { StyledGrid, StyledInput, TableFooter } from './SelectWrapperStyles'
import { TableHeader } from './TableHeader'
import { TableInner } from './TableInner'

export const excludedPairs = [
  // 'USDC_ODOP',
  // 'KIN_USDT',
  // 'MIDBEAR_USDT',
  // 'MIDBULL_USDT',
  // 'XRPBEAR_USDT',
  // 'XRPBULL_USDT',
  // 'SWAG_USDT'
]

export const datesForQuery = {
  startOfTime: () => dayjs().startOf('hour').subtract(24, 'hour').unix(),

  endOfTime: () => dayjs().endOf('hour').unix(),

  prevStartTimestamp: () => dayjs().startOf('hour').subtract(48, 'hour').unix(),

  prevEndTimestamp: () => dayjs().startOf('hour').subtract(24, 'hour').unix(),
}

export const fiatRegexp = new RegExp(fiatPairs.join('|'), 'gi')

const SelectWrapper = (props: IProps) => {
  const [searchValue, setSearchValue] = useState('')
  const [tab, setTab] = useState<SelectTabType>('all')

  // TODO: Uncomment once Postgres HA deployed

  // const [selectorMode, setSelectorMode] = useLocalStorageState(
  //   'selectorMode',
  //   'basic'
  // )

  const selectorMode = 'basic'
  const setSelectorMode = () => {}

  const [favouriteMarketsRaw, setFavouriteMarkets] = useLocalStorageState(
    'favouriteMarkets',
    JSON.stringify([])
  )

  const favouriteMarkets = JSON.parse(favouriteMarketsRaw)

  const toggleFavouriteMarket = (pair) => {
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

  const filtredMarketsByExchange =
    getSerumMarketDataQuery.getSerumMarketData.filter(
      (el) =>
        el.symbol &&
        !Array.isArray(el.symbol.match(fiatRegexp)) &&
        !excludedPairs.includes(el.symbol)
    )

  const favouritePairsMap = favouriteMarkets.reduce(
    (acc: Map<string, string>, el: string) => {
      acc.set(el, el)

      return acc
    },
    new Map()
  )

  return (
    <SelectPairListComponent
      tab={tab}
      data={filtredMarketsByExchange}
      favouritePairsMap={favouritePairsMap}
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

class SelectPairListComponent extends React.PureComponent<
  IPropsSelectPairListComponent,
  IStateSelectPairListComponent
> {
  state: IStateSelectPairListComponent = {
    processedSelectData: [],
    showAddMarketPopup: false,
    left: 0,
    sortBy: 'volume24hChange',
    sortDirection: SortDirection.DESC,
    choosenMarketData: {},
    isMintsPopupOpen: false,
    isFeedBackPopupOpen: false,
  }

  changeChoosenMarketData = ({ symbol, marketAddress }) => {
    this.setState({ choosenMarketData: { symbol, marketAddress } })
  }

  setIsMintsPopupOpen = (isMintsPopupOpen) => {
    this.setState({ isMintsPopupOpen })
  }

  setIsFeedbackPopupOpen = (isFeedBackPopupOpen) => {
    this.setState({ isFeedBackPopupOpen })
  }

  componentDidMount() {
    const {
      data,
      toggleFavouriteMarket,
      onSelectPair,
      theme,
      searchValue,
      tab,
      getSerumTradesDataQuery,
      customMarkets,
      market,
      tokenMap,
      markets,
      allMarketsMap,
      favouritePairsMap,
      marketType,
    } = this.props

    const serumMarketsDataMap = new Map()

    const { left } = document
      .getElementById('ExchangePair')
      ?.getBoundingClientRect()

    const { sortBy, sortDirection, isMintsPopupOpen, isFeedBackPopupOpen } =
      this.state

    getSerumTradesDataQuery?.getSerumTradesData?.forEach((el) =>
      serumMarketsDataMap.set(el.pair, el)
    )

    const processedSelectData = combineSelectWrapperData({
      data,
      toggleFavouriteMarket,
      onSelectPair,
      favouritePairsMap,
      theme,
      searchValue,
      tab,
      marketType,
      customMarkets,
      market,
      tokenMap,
      serumMarketsDataMap,
      allMarketsMap,
      isMintsPopupOpen,
      setIsMintsPopupOpen: this.setIsMintsPopupOpen,
      changeChoosenMarketData: this.changeChoosenMarketData,
    })

    const sortedData = this._sortList({
      tab,
      sortBy,
      sortDirection,
      data: processedSelectData,
    })

    this.setState({
      processedSelectData: sortedData,
      left,
    })
  }

  componentWillReceiveProps(nextProps: IPropsSelectPairListComponent) {
    const {
      data,
      toggleFavouriteMarket,
      onSelectPair,
      theme,
      searchValue,
      tab,
      favouritePairsMap,
      marketType,
      markets,
      customMarkets,
      market,
      tokenMap,
      getSerumTradesDataQuery,
      allMarketsMap,
      onTabChange,
    } = nextProps
    const { data: prevPropsData } = this.props
    const { sortBy, sortDirection, isMintsPopupOpen, isFeedBackPopupOpen } =
      this.state

    const serumMarketsDataMap = new Map()

    getSerumTradesDataQuery?.getSerumTradesData?.forEach((el) =>
      serumMarketsDataMap?.set(el.pair, el)
    )
    const processedSelectData = combineSelectWrapperData({
      data,
      toggleFavouriteMarket,
      previousData: prevPropsData,
      onSelectPair,
      theme,
      searchValue,
      tab,
      favouritePairsMap,
      marketType,
      market,
      tokenMap,
      serumMarketsDataMap,
      allMarketsMap,
      isMintsPopupOpen,
      setIsMintsPopupOpen: this.setIsMintsPopupOpen,
      changeChoosenMarketData: this.changeChoosenMarketData,
    })

    const sortedData = this._sortList({
      tab,
      sortBy,
      sortDirection,
      data: processedSelectData,
    })

    this.setState({
      processedSelectData: sortedData,
    })
  }

  _sortList = ({ sortBy, sortDirection, data, tab }) => {
    let dataToSort = data

    if (!dataToSort) {
      dataToSort = this.state.processedSelectData
    }

    let newList = [...dataToSort]

    if (tab === 'topGainers' || tab === 'topLosers') {
      return newList
    }

    // const CCAIMarket = newList.find(v => v.symbol.contentToSort === 'RIN_USDC')

    if (this.props.marketType === 0 && sortBy === 'volume24hChange') {
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
      newList = sort(dataToSort, [`${sortBy}.contentToSort`])
      if (sortDirection === SortDirection.DESC) {
        newList = newList.reverse()
      }
    }

    const ccaiIndex = newList.findIndex(
      (v) => v.symbol.contentToSort === 'RIN_USDC'
    )
    if (ccaiIndex === -1) return newList

    const updatedList = [
      newList[ccaiIndex],
      ...newList.slice(0, ccaiIndex),
      ...newList.slice(ccaiIndex + 1),
    ]

    return updatedList
  }

  _sort = ({ sortBy, sortDirection }) => {
    const processedSelectData = this._sortList({ sortBy, sortDirection })
    this.setState({ sortBy, sortDirection, processedSelectData })
  }

  render() {
    const {
      processedSelectData,
      showAddMarketPopup,
      choosenMarketData,
      isMintsPopupOpen,
      isFeedBackPopupOpen,
    } = this.state

    const {
      theme,
      searchValue,
      tab,
      id,
      onChangeSearch,
      marketType,
      publicKey,
      wallet,
      history,
      tokenMap,
      selectorMode,
      favouritePairsMap,
      setSelectorMode,
      setCustomMarkets,
      customMarkets,
      allMarketsMap,
      getSerumMarketDataQueryRefetch,
      onTabChange,
      marketName,
      closeMenu,
    } = this.props

    const isAdvancedSelectorMode = selectorMode === 'advanced'

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
      console.log('onAddCustomMarket', newCustomMarkets)
      return true
    }

    return (
      <>
        <StyledGrid
          theme={theme}
          id={id}
          isAdvancedSelectorMode={isAdvancedSelectorMode}
        >
          <TableHeader
            theme={theme}
            tab={tab}
            favouritePairsMap={favouritePairsMap}
            tokenMap={tokenMap}
            data={this.props.data}
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
                  color: '#96999C',
                  fontSize: '16px',
                },
              }}
              endAdornment={
                <InputAdornment
                  style={{
                    width: '10%',
                    justifyContent: 'flex-end',
                    cursor: 'pointer',
                    color: '#96999C',
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
            theme={theme}
            selectorMode={selectorMode}
            processedSelectData={processedSelectData}
            isAdvancedSelectorMode={isAdvancedSelectorMode}
            sort={this._sort}
            sortBy={this.state.sortBy}
            sortDirection={this.state.sortDirection}
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
                this.setIsFeedbackPopupOpen(true)
              }}
            >
              Found an error in the catalog? Let us know!
            </Row>
            {/* <Row
              style={{
                padding: '0 2rem',
                height: '4rem',
                fontFamily: 'Avenir Next Medium',
                color: theme.palette.blue.serum,
                alignItems: 'center',
                fontSize: '1.5rem',
                textTransform: 'none',
              }}
              onClick={async (e) => {
                e.stopPropagation()
                if (publicKey === '') {
                  notify({
                    message: 'Connect your wallet first',
                    type: 'error',
                  })
                  wallet.connect()
                  return
                }

                this.setState({ showAddMarketPopup: true })
                closeMenu()
              }}
            >
              + Add Market
            </Row> */}
          </TableFooter>
          <CustomMarketDialog
            theme={theme}
            open={showAddMarketPopup}
            onClose={() => this.setState({ showAddMarketPopup: false })}
            onAddCustomMarket={onAddCustomMarket}
            getSerumMarketDataQueryRefetch={getSerumMarketDataQueryRefetch}
          />
          <WarningPopup theme={theme} />
          <MintsPopup
            theme={theme}
            symbol={choosenMarketData?.symbol}
            marketAddress={choosenMarketData?.marketAddress}
            open={isMintsPopupOpen}
            onClose={() => this.setIsMintsPopupOpen(false)}
          />
          <MarketsFeedbackPopup
            theme={theme}
            open={isFeedBackPopupOpen}
            onClose={() => this.setIsFeedbackPopupOpen(false)}
          />
        </StyledGrid>
      </>
    )
  }
}

export default compose(
  withMarketUtilsHOC,
  withRouter,
  withAuthStatus,
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
  })
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
