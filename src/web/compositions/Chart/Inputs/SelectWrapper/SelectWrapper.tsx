import React from 'react'
import { compose } from 'recompose'
import { Grid, Input, InputAdornment } from '@material-ui/core'
import { withTheme } from '@material-ui/core/styles'
import { SortDirection } from 'react-virtualized'
import 'react-virtualized/styles.css'
import dayjs from 'dayjs'
import { WarningPopup } from '@sb/compositions/Chart/components/WarningPopup'
import { withAuthStatus } from '@core/hoc/withAuthStatus'

import { getSerumMarketData } from '@core/graphql/queries/chart/getSerumMarketData'
import { queryRendererHoc } from '@core/components/QueryRenderer'

import stableCoins, { fiatPairs } from '@core/config/stableCoins'
import CustomMarketDialog from '@sb/compositions/Chart/Inputs/SelectWrapper/AddCustomMarketPopup'
import search from '@icons/search.svg'
import _ from 'lodash'

import { StyledGrid } from './SelectWrapperStyles'
import { notify } from '@sb/dexUtils/notifications'

import { SvgIcon } from '@sb/components'

import {
  IProps,
  IState,
  IPropsSelectPairListComponent,
  IStateSelectPairListComponent,
  SelectTabType,
} from './SelectWrapper.types'

import { combineSelectWrapperData } from './SelectWrapper.utils'
import { withMarketUtilsHOC } from '@core/hoc/withMarketUtilsHOC'
import { withPublicKey } from '@core/hoc/withPublicKey'
import { Row } from '@sb/compositions/AnalyticsRoute/index.styles'
import { withRouter } from 'react-router'
import {
  dayDuration,
  endOfDayTimestamp,
  getTimezone,
} from '@sb/compositions/AnalyticsRoute/components/utils'
import { getSerumTradesData } from '@core/graphql/queries/chart/getSerumTradesData'
import { TableHeader } from './TableHeader'
import { TableInner } from './TableInner'
import { MintsPopup } from './MintsPopup'
import { MarketsFeedbackPopup } from './MarketsFeedbackPopup'

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
  startOfTime: dayjs()
    .startOf('hour')
    .subtract(24, 'hour')
    .unix(),

  endOfTime: dayjs()
    .endOf('hour')
    .unix(),

  prevStartTimestamp: dayjs()
    .startOf('hour')
    .subtract(48, 'hour')
    .unix(),

  prevEndTimestamp: dayjs()
    .startOf('hour')
    .subtract(24, 'hour')
    .unix(),
}

export const fiatRegexp = new RegExp(fiatPairs.join('|'), 'gi')

class SelectWrapper extends React.PureComponent<IProps, IState> {
  state: IState = {
    searchValue: '',
    tab: 'all',
    tabSpecificCoin: '',
  }

  onChangeSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!`${e.target.value}`.match(/[a-zA-Z1-9]/) && e.target.value !== '') {
      return
    }

    this.setState({ searchValue: e.target.value })
  }

  onTabChange = (tab: SelectTabType) => {
    // this.setState({ tab, tabSpecificCoin: '' })
    this.setState((prevState) => ({
      tab,
      tabSpecificCoin: prevState.tab !== tab ? '' : prevState.tabSpecificCoin,
    }))
  }

  onSpecificCoinChange = ({ value }: { value: string }) => {
    this.setState({ tabSpecificCoin: value })
  }
  render() {
    const { searchValue, tab, tabSpecificCoin } = this.state
    const {
      marketsByExchangeQuery,
      getSelectorSettingsQuery,
      markets,
      AWESOME_TOKENS = [],
      setCustomMarkets,
      customMarkets,
      getSerumMarketDataQuery = { getSerumMarketData: [] },
      getSerumMarketDataQueryRefetch,
    } = this.props

    const {
      getAccountSettings: {
        selectorSettings: { favoritePairs } = { favoritePairs: [] },
      } = {
        selectorSettings: { favoritePairs: [] },
      },
    } = getSelectorSettingsQuery || {
      getAccountSettings: {
        selectorSettings: { favoritePairs: [] },
      },
    }

    const filtredMarketsByExchange = getSerumMarketDataQuery.getSerumMarketData.filter(
      (el) =>
        el.symbol &&
        !Array.isArray(el.symbol.match(fiatRegexp)) &&
        !excludedPairs.includes(el.symbol)
    )

    const stableCoinsRegexp = new RegExp(stableCoins.join('|'), 'g')
    const altCoinsRegexp = new RegExp(`${stableCoins.join('|')}|BTC`, 'g')
    let altCoinsPairsMap = new Map()
    let stableCoinsPairsMap = new Map()
    let btcCoinsPairsMap = new Map()
    let usdcPairsMap = new Map()
    let usdtPairsMap = new Map()
    const favoritePairsMap = favoritePairs.reduce(
      (acc: Map<string, string>, el: string) => {
        acc.set(el, el)

        return acc
      },
      new Map()
    )

    filtredMarketsByExchange.forEach((el) => {
      if (
        stableCoinsRegexp.test(el.symbol.split('_')[0]) ||
        stableCoinsRegexp.test(el.symbol.split('_')[1])
      ) {
        stableCoinsPairsMap.set(el.symbol, el.price)
      }

      if (
        /BTC/g.test(el.symbol.split('_')[1]) &&
        !stableCoinsRegexp.test(el.symbol.split('_')[0]) &&
        !stableCoinsRegexp.test(el.symbol.split('_')[1])
      ) {
        btcCoinsPairsMap.set(el.symbol, el.price)
      }
      if (
        /USDC/g.test(el.symbol.split('_')[0]) ||
        /USDC/g.test(el.symbol.split('_')[1])
      ) {
        usdcPairsMap.set(el.symbol, el.price)
      }
      if (
        /USDT/g.test(el.symbol.split('_')[0]) ||
        /USDT/g.test(el.symbol.split('_')[1])
      ) {
        usdtPairsMap.set(el.symbol, el.price)
      }
      if (
        !altCoinsRegexp.test(el.symbol) &&
        !stableCoinsRegexp.test(el.symbol.split('_')[0]) &&
        !stableCoinsRegexp.test(el.symbol.split('_')[1])
      ) {
        altCoinsPairsMap.set(el.symbol, el.price)
      }
    })

    return (
      <SelectPairListComponent
        data={filtredMarketsByExchange}
        favoritePairsMap={favoritePairsMap}
        stableCoinsPairsMap={stableCoinsPairsMap}
        btcCoinsPairsMap={btcCoinsPairsMap}
        altCoinsPairsMap={altCoinsPairsMap}
        usdcPairsMap={usdcPairsMap}
        usdtPairsMap={usdtPairsMap}
        searchValue={searchValue}
        tab={tab}
        tabSpecificCoin={tabSpecificCoin}
        onChangeSearch={this.onChangeSearch}
        onTabChange={this.onTabChange}
        onSpecificCoinChange={this.onSpecificCoinChange}
        {...this.props}
      />
    )
  }
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
      updateFavoritePairsMutation,
      onSelectPair,
      theme,
      searchValue,
      tab,
      tabSpecificCoin,
      stableCoinsPairsMap,
      btcCoinsPairsMap,
      altCoinsPairsMap,
      favoritePairsMap,
      usdcPairsMap,
      usdtPairsMap,
      marketType,
      getSerumTradesDataQuery,
      customMarkets,
      market,
      tokenMap,
      markets,
      allMarketsMap,
      onTabChange,
    } = this.props

    const serumMarketsDataMap = new Map()

    const { left } = document
      .getElementById('ExchangePair')
      ?.getBoundingClientRect()
    const {
      sortBy,
      sortDirection,
      isMintsPopupOpen,
      isFeedBackPopupOpen,
    } = this.state

    getSerumTradesDataQuery?.getSerumTradesData?.forEach((el) =>
      serumMarketsDataMap.set(el.pair, el)
    )

    const processedSelectData = combineSelectWrapperData({
      data,
      updateFavoritePairsMutation,
      onSelectPair,
      theme,
      searchValue,
      tab,
      tabSpecificCoin,
      stableCoinsPairsMap,
      btcCoinsPairsMap,
      altCoinsPairsMap,
      favoritePairsMap,
      usdcPairsMap,
      usdtPairsMap,
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
      updateFavoritePairsMutation,
      onSelectPair,
      theme,
      searchValue,
      tab,
      tabSpecificCoin,
      stableCoinsPairsMap,
      btcCoinsPairsMap,
      altCoinsPairsMap,
      usdcPairsMap,
      usdtPairsMap,
      favoritePairsMap,
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
    const {
      sortBy,
      sortDirection,
      isMintsPopupOpen,
      isFeedBackPopupOpen,
    } = this.state

    const serumMarketsDataMap = new Map()

    getSerumTradesDataQuery?.getSerumTradesData?.forEach((el) =>
      serumMarketsDataMap?.set(el.pair, el)
    )
    const processedSelectData = combineSelectWrapperData({
      data,
      updateFavoritePairsMutation,
      previousData: prevPropsData,
      onSelectPair,
      theme,
      searchValue,
      tab,
      tabSpecificCoin,
      stableCoinsPairsMap,
      btcCoinsPairsMap,
      altCoinsPairsMap,
      usdcPairsMap,
      usdtPairsMap,
      favoritePairsMap,
      marketType,
      customMarkets,
      market,
      tokenMap,
      serumMarketsDataMap: serumMarketsDataMap,
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

    // const CCAIMarket = newList.find(v => v.symbol.contentToSort === 'CCAI_USDC')

    if (this.props.marketType === 0 && sortBy === 'volume24hChange') {
      newList.sort((pairObjectA, pairObjectB) => {
        const quoteA = pairObjectA.symbol.contentToSort.split('_')[1]
        const quoteB = pairObjectB.symbol.contentToSort.split('_')[1]

        if (quoteA === 'USDT' && quoteB === 'USDT') {
          return (
            pairObjectB.volume24hChange.contentToSort -
            pairObjectA.volume24hChange.contentToSort
          )
        } else if (quoteA === 'USDT') {
          return -1
        } else if (quoteB === 'USDT') {
          return 1
        } else if (quoteA !== 'USDT' && quoteB !== 'USDT') {
          return (
            pairObjectB.volume24hChange.contentToSort -
            pairObjectA.volume24hChange.contentToSort
          )
        }
      })
    } else {
      newList = _.sortBy(dataToSort, [`${sortBy}.contentToSort`])
      if (sortDirection === SortDirection.DESC) {
        newList = newList.reverse()
      }
    }

    const ccaiIndex = newList.findIndex(
      (v) => v.symbol.contentToSort === 'CCAI_USDC'
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
      tabSpecificCoin,
      onChangeSearch,
      marketType,
      publicKey,
      wallet,
      history,
      onSpecificCoinChange,
      marketsByExchangeQuery,
      setCustomMarkets,
      customMarkets,
      allMarketsMap,
      getSerumMarketDataQueryRefetch,
      onTabChange,
    } = this.props

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
          id={id}
          style={{
            top: `calc(100% - 1rem)`,
            left: `0rem`,
            fontFamily: 'DM Sans',
            position: 'absolute',
            zIndex: 900,
            background: '#222429',
            minWidth: '155rem',
            height: '73rem',
            borderRadius: '2rem',
            overflow: 'hidden',
            border: theme.palette.border.new,
            filter: 'drop-shadow(0px 0px 8px rgba(125, 125, 131, 0.2))',
          }}
        >
          <TableHeader
            theme={theme}
            tab={tab}
            data={this.props.data}
            onTabChange={onTabChange}
            allMarketsMap={allMarketsMap}
            marketType={marketType}
          />
          {/* {ReactDOM.createPortal(<StyledOverlay />, document.body)} */}
          <Grid container style={{ justifyContent: 'flex-end', width: '100%' }}>
            <Input
              placeholder="Search by all categories"
              disableUnderline={true}
              style={{
                width: '100%',
                height: '5rem',
                background: '#383B45',
                fontFamily: 'Avenir Next Medium',
                fontSize: '1.5rem',
                color: '#96999C',
                borderBottom: `.1rem solid #383B45`,
                padding: '0 2rem',
              }}
              value={searchValue}
              onChange={onChangeSearch}
              inputProps={{
                style: {
                  color: '#96999C',
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
                  disableTypography={true}
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
            processedSelectData={processedSelectData}
            sort={this._sort}
            sortBy={this.state.sortBy}
            sortDirection={this.state.sortDirection}
          />
          <Grid
            style={{
              justifyContent: 'space-between',
              width: '100%',
              position: 'relative',
              zIndex: 1000,
              background: '#17181A',
              borderTop: '0.1rem solid #383B45',
            }}
            container
          >
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
            <Row
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
              }}
            >
              + Add Market
            </Row>
          </Grid>
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
      startTimestamp: `${datesForQuery.startOfTime}`,
      endTimestamp: `${datesForQuery.endOfTime}`,
      prevStartTimestamp: `${datesForQuery.prevStartTimestamp}`,
      prevEndTimestamp: `${datesForQuery.prevEndTimestamp}`,
    }),
    fetchPolicy: 'cache-and-network',
    withOutSpinner: true,
    withTableLoader: false,
    showNoLoader: true,
  }),
  queryRendererHoc({
    query: getSerumTradesData,
    name: 'getSerumTradesDataQuery',
    variables: (props) => ({
      timezone: getTimezone(),
      timestampTo: endOfDayTimestamp,
      timestampFrom: endOfDayTimestamp - dayDuration * 14,
    }),
    fetchPolicy: 'cache-and-network',
  })
)(SelectWrapper)
