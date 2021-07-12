import React from 'react'
import { compose } from 'recompose'
import styled from 'styled-components'
import { Grid, Input, InputAdornment } from '@material-ui/core'
import { withTheme } from '@material-ui/core/styles'
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer'
import { Column, Table, SortDirection } from 'react-virtualized'
import 'react-virtualized/styles.css'
import dayjs from 'dayjs'
import { WarningPopup } from '@sb/compositions/Chart/components/WarningPopup'
import { withAuthStatus } from '@core/hoc/withAuthStatus'
import { getSelectorSettings } from '@core/graphql/queries/chart/getSelectorSettings'
import { MARKETS_BY_EXCHANE_QUERY } from '@core/graphql/queries/chart/MARKETS_BY_EXCHANE_QUERY'

import { getSerumMarketData } from '@core/graphql/queries/chart/getSerumMarketData'
import { queryRendererHoc } from '@core/components/QueryRenderer'

import stableCoins, {
  fiatPairs,
  stableCoinsWithoutFiatPairs,
} from '@core/config/stableCoins'
import ReactSelectComponent from '@sb/components/ReactSelectComponent'
import CustomMarketDialog from '@sb/compositions/Chart/Inputs/SelectWrapper/AddCustomMarketPopup'
import favoriteSelected from '@icons/favoriteSelected.svg'
import search from '@icons/search.svg'
import AddCircleIcon from '@material-ui/icons/AddCircle'
import _ from 'lodash'

import { notify } from '@sb/dexUtils/notifications'
import { getMarketInfos } from '@sb/dexUtils/markets'

import {
  // TableWithSort,
  SvgIcon,
} from '@sb/components'

import {
  IProps,
  IState,
  IPropsSelectPairListComponent,
  IStateSelectPairListComponent,
  SelectTabType,
} from './SelectWrapper.types'

import {
  // selectWrapperColumnNames,
  combineSelectWrapperData,
  marketsByCategories,
} from './SelectWrapper.utils'
import { withMarketUtilsHOC } from '@core/hoc/withMarketUtilsHOC'
import { withPublicKey } from '@core/hoc/withPublicKey'
import { Row, RowContainer } from '@sb/compositions/AnalyticsRoute/index.styles'
import { withRouter } from 'react-router'
import {
  dayDuration,
  endOfDayTimestamp,
  getTimezone,
} from '@sb/compositions/AnalyticsRoute/components/utils'
import { getSerumTradesData } from '@core/graphql/queries/chart/getSerumTradesData'

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

const StyledGrid = styled(Grid)`
  display: none;
`

const StyledTab = styled(({ isSelected, ...props }) => <Row {...props} />)`
  && {
    text-transform: capitalize;
    padding: 0.5rem 1.5rem;
    background: ${(props) => (props.isSelected ? '#366CE5' : '#383B45')};
    border-radius: 1.3rem;
    cursor: pointer;
    font-family: ${(props) =>
      props.isSelected ? 'Avenir Next Demi' : 'Avenir Next Medium'};
    font-size: 1.4rem;
    margin: 0.5rem 0.75rem;
    color: #fff;
  }
`

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

    // const { getMarketsByExchange = [] } = marketsByExchangeQuery || {
    //   getMarketsByExchange: [],
    // }

    // console.log('markets', markets)

    // const dexMarketSymbols = markets.map((el) => ({
    //   symbol: el.name.replace('/', '_'),
    //   isAwesomeMarket: el.isAwesomeMarket,
    // }))

    const filtredMarketsByExchange = getSerumMarketDataQuery.getSerumMarketData.filter(
      (el) =>
        el.symbol &&
        !Array.isArray(el.symbol.match(fiatRegexp)) &&
        !excludedPairs.includes(el.symbol)
    )

    const DefiMarkets = [{}]

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
    } = this.props

    const serumMarketsDataMap = new Map()

    const { left } = document
      .getElementById('ExchangePair')
      ?.getBoundingClientRect()
    const { sortBy, sortDirection } = this.state

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
    })

    const sortedData = this._sortList({
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
      customMarkets,
      market,
      tokenMap,
      getSerumTradesDataQuery,
    } = nextProps
    const { data: prevPropsData } = this.props
    const { sortBy, sortDirection } = this.state
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
    })

    const sortedData = this._sortList({
      sortBy,
      sortDirection,
      data: processedSelectData,
    })

    this.setState({
      processedSelectData: sortedData,
    })
  }

  _sortList = ({ sortBy, sortDirection, data }) => {
    let dataToSort = data

    if (!dataToSort) {
      dataToSort = this.state.processedSelectData
    }

    let newList = [...dataToSort]

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
    const { processedSelectData, showAddMarketPopup } = this.state
    const {
      theme,
      searchValue,
      tab,
      id,
      tabSpecificCoin,
      onChangeSearch,
      onTabChange,
      marketType,
      publicKey,
      wallet,
      history,
      onSpecificCoinChange,
      marketsByExchangeQuery,
      setCustomMarkets,
      customMarkets,
      getSerumMarketDataQueryRefetch,
    } = this.props

    const onAddCustomMarket = (customMarket: any) => {
      const marketInfo = getMarketInfos(customMarkets).some(
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
      <StyledGrid
        id={id}
        style={{
          top: `calc(100% - 1rem)`,
          left: `0rem`,
          fontFamily: 'DM Sans',
          position: 'absolute',
          zIndex: 900,
          background: '#222429',
          minWidth: '145rem',
          height: '70rem',
          borderRadius: '2rem',
          overflow: 'hidden',
          border: theme.palette.border.new,
          boxShadow: '0px .4rem .6rem rgba(8, 22, 58, 0.3)',
        }}
      >
        <RowContainer
          style={{
            height: '12rem',
            padding: '0.5rem',
            justifyContent: 'flex-start',
            flexDirection: 'row',
            flexWrap: 'normal',
            alignItems: 'center',
            borderBottom: theme.palette.border.new,
            background: '#17181A',
          }}
        >
          {/* <Grid
            style={{
              display: 'flex',
              padding: '1rem',
              background: tab === 'favorite' ? theme.palette.grey.main : '',
              cursor: 'pointer',
            }}
            onClick={() => onTabChange('favorite')}
          >
            <SvgIcon src={favoriteSelected} width="2rem" height="auto" />
          </Grid> */}
          <StyledTab
            theme={theme}
            isSelected={tab === 'all'}
            onClick={() => onTabChange('all')}
          >
            All{' '}
            <span
              style={{
                color: tab === 'all' ? '#fbf2f2' : '#96999C',
                marginLeft: '0.5rem',
              }}
            >
              {`(${this.props.data.length})`}
            </span>
          </StyledTab>
          <StyledTab
            theme={theme}
            isSelected={tab === 'usdt'}
            onClick={() => onTabChange('usdt')}
          >
            USDT{' '}
            <span
              style={{
                color: tab === 'usdt' ? '#fbf2f2' : '#96999C',
                marginLeft: '0.5rem',
              }}
            >
              {`(${
                this.props.data.filter((el) => el.symbol.includes('USDT'))
                  .length
              })`}
            </span>
          </StyledTab>
          <StyledTab
            theme={theme}
            isSelected={tab === 'usdc'}
            onClick={() => onTabChange('usdc')}
          >
            USDC
            <span
              style={{
                color: tab === 'usdc' ? '#fbf2f2' : '#96999C',
                marginLeft: '0.5rem',
              }}
            >
              {`(${
                this.props.data.filter((el) => el.symbol.includes('USDC'))
                  .length
              })`}
            </span>
          </StyledTab>
          <StyledTab
            theme={theme}
            isSelected={tab === 'sol'}
            onClick={() => onTabChange('sol')}
          >
            SOL{' '}
            <span
              style={{
                color: tab === 'sol' ? '#fbf2f2' : '#96999C',
                marginLeft: '0.5rem',
              }}
            >
              {`(${
                this.props.data.filter((el) => el.symbol.includes('SOL')).length
              })`}
            </span>
          </StyledTab>{' '}
          <StyledTab
            theme={theme}
            isSelected={tab === 'topGainers'}
            onClick={() => {
              onTabChange('topGainers')
              this.setState({
                sortBy: 'price24hChange',
                sortDirection: SortDirection.ASC,
              })
            }}
          >
            Top Gainers{' '}
            <span
              style={{
                color: tab === 'topGainers' ? '#fbf2f2' : '#96999C',
                marginLeft: '0.5rem',
              }}
            ></span>
          </StyledTab>
          <StyledTab
            theme={theme}
            isSelected={tab === 'topLosers'}
            onClick={() => {
              onTabChange('topLosers')
              this.setState({
                sortBy: 'price24hChange',
                sortDirection: SortDirection.DESC,
              })
            }}
          >
            Top Losers{' '}
            <span
              style={{
                color: tab === 'topLosers' ? '#fbf2f2' : '#96999C',
                marginLeft: '0.5rem',
              }}
            ></span>
          </StyledTab>
          {Object.entries(marketsByCategories).map(([category, data]) => {
            return (
              <StyledTab
                theme={theme}
                isSelected={tab === category}
                onClick={() => onTabChange(category)}
              >
                {data.name}
                <span
                  style={{
                    color: tab === category ? '#fbf2f2' : '#96999C',
                    marginLeft: '0.5rem',
                  }}
                >
                  {`(${
                    this.props.data.filter((el) => {
                      const [base, quote] = el.symbol.split('_')

                      return (
                        data.tokens.includes(base) ||
                        data.tokens.includes(quote)
                      )
                    }).length
                  })`}
                </span>
              </StyledTab>
            )
          })}{' '}
          <StyledTab
            theme={theme}
            isSelected={tab === 'leveraged'}
            onClick={() => onTabChange('leveraged')}
          >
            Leveraged tokens{' '}
            <span
              style={{
                color: tab === 'leveraged' ? '#fbf2f2' : '#96999C',
                marginLeft: '0.5rem',
              }}
            >
              {`(${
                this.props.data.filter(
                  (el) =>
                    el.symbol.includes('BULL') ||
                    (el.symbol.includes('BEAR') && !el.isCustomUserMarket)
                ).length
              })`}
            </span>
          </StyledTab>
          <StyledTab
            theme={theme}
            isSelected={tab === 'public'}
            onClick={() => onTabChange('public')}
          >
            Custom markets{' '}
            <span
              style={{
                color: tab === 'public' ? '#fbf2f2' : '#96999C',
                marginLeft: '0.5rem',
              }}
            >
              {`(${
                this.props.data.filter(
                  (el) => el.isCustomUserMarket && !el.isPrivateCustomMarket
                ).length
              })`}
            </span>
          </StyledTab>
          {/* <AddCircleIcon
            onClick={async () => {
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
            style={{
              width: '3rem',
              height: '3rem',
              padding: '.5rem',
              color: '#55BB7C',
              cursor: 'pointer',
            }}
          /> */}
          {marketType === 0 && (
            <>
              <Grid
                style={{
                  padding: '1rem',
                  background: tab === 'btc' ? theme.palette.grey.main : '',
                  display: 'flex',
                  alignItems: 'center',
                  cursor: 'pointer',
                  fontSize: '1.2rem',
                  color: theme.palette.grey.light,
                  fontWeight: 'bold',
                }}
                onClick={() => onTabChange('btc')}
              >
                BTC
              </Grid>

              <Grid
                style={{
                  display: 'flex',
                  padding: '1rem',
                  background: tab === 'alts' ? theme.palette.grey.main : '',
                  alignItems: 'center',
                  cursor: 'pointer',
                  fontSize: '1.2rem',
                  color: theme.palette.grey.light,
                  fontWeight: 'bold',
                }}
                onClick={() => onTabChange('alts')}
              >
                <Grid style={{ paddingRight: '1rem' }}>ALTS</Grid>
                <Grid style={{ width: '6rem' }}>
                  <ReactSelectComponent
                    isSearchable={false}
                    valueContainerStyles={{ padding: 0 }}
                    placeholder="ALL"
                    onChange={onSpecificCoinChange}
                    options={[
                      { label: 'ALL', value: 'ALL' },
                      { value: 'ETH', label: 'ETH' },
                      { value: 'TRX', label: 'TRX' },
                      { value: 'XRP', label: 'XRP' },
                      { label: 'ALL', value: 'ALL' },
                    ]}
                    value={
                      tabSpecificCoin === ''
                        ? { label: 'ALL', value: 'ALL' }
                        : tabSpecificCoin === 'ALL'
                        ? { label: 'ALL', value: 'ALL' }
                        : !['ETH', 'TRX', 'XRP'].includes(tabSpecificCoin)
                        ? { label: 'ALL', value: 'ALL' }
                        : undefined
                    }
                  />
                </Grid>
              </Grid>
              <Grid
                style={{
                  display: 'flex',
                  padding: '1rem',
                  background: tab === 'fiat' ? theme.palette.grey.main : '',
                  alignItems: 'center',
                  cursor: 'pointer',
                  fontSize: '1.2rem',
                  color: theme.palette.grey.light,
                  fontWeight: 'bold',
                }}
                onClick={() => onTabChange('fiat')}
              >
                <Grid style={{ paddingRight: '1rem' }}>STABLE</Grid>
                <Grid style={{ width: '6rem' }}>
                  <ReactSelectComponent
                    isSearchable={false}
                    valueContainerStyles={{ padding: 0 }}
                    placeholder="ALL"
                    onChange={onSpecificCoinChange}
                    options={[
                      { label: 'ALL', value: 'ALL' },
                      ...stableCoinsWithoutFiatPairs.map((el) => ({
                        value: el,
                        label: el,
                      })),
                    ]}
                    value={
                      tabSpecificCoin === ''
                        ? { label: 'ALL', value: 'ALL' }
                        : tabSpecificCoin === 'ALL'
                        ? { label: 'ALL', value: 'ALL' }
                        : !stableCoinsWithoutFiatPairs.includes(tabSpecificCoin)
                        ? { label: 'ALL', value: 'ALL' }
                        : undefined
                    }
                  />
                </Grid>
              </Grid>
            </>
          )}
        </RowContainer>
        <Grid container style={{ justifyContent: 'flex-end', width: '100%' }}>
          <Input
            placeholder="Search by all categories"
            disableUnderline={true}
            style={{
              width: '100%',
              height: '5rem',
              background: '#383B45',
              // borderRadius: '0.3rem',
              fontFamily: 'Avenir Next Light',
              fontSize: '1.5rem',
              color: '#96999C',
              borderBottom: `.1rem solid #383B45`,
              padding: '0 2rem',
            }}
            value={searchValue}
            onChange={onChangeSearch}
            // inputProps={{
            //   style: {
            //     paddingLeft: '1rem',
            //   },
            // }}
            endAdornment={
              <InputAdornment
                style={{
                  width: '10%',
                  justifyContent: 'flex-end',
                  cursor: 'pointer',
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
        <Grid style={{ overflow: 'hidden', height: 'calc(100% - 8rem)' }}>
          <AutoSizer>
            {({ width, height }: { width: number; height: number }) => (
              <Table
                width={width}
                height={height}
                rowCount={processedSelectData.length}
                sort={this._sort}
                sortBy={this.state.sortBy}
                sortDirection={this.state.sortDirection}
                onRowClick={({ event, index, rowData }) => {
                  rowData.symbol.onClick()
                }}
                gridStyle={{
                  outline: 'none',
                }}
                rowStyle={{
                  outline: 'none',
                  cursor: 'pointer',
                  fontSize: '2rem',
                  // color: theme.palette.dark.main,
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
                  // borderBottom: '.1rem solid #e0e5ec',
                  fontFamily: 'Avenir Next Light',
                  fontSize: '2rem',
                  outline: 'none',
                }}
                rowHeight={window.outerHeight / 15}
                rowGetter={({ index }) => processedSelectData[index]}
              >
                {/* <Column
                  label=""
                  dataKey="favorite"
                  headerStyle={{
                    paddingLeft: 'calc(.5rem + 10px)',
                  }}
                  width={width / 5}
                  cellRenderer={({ cellData }) => (
                    <span onClick={(e) => e.stopPropagation()}>
                      {cellData.render}
                    </span>
                  )}
                /> */}
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
                  width={width * 1.5}
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
                  width={width * 1.5}
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
                  width={width * 1.4}
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
                  width={width * 1.3}
                  style={{
                    textAlign: 'left',
                    fontSize: '1.4rem',
                    fontWeight: 'bold',
                  }}
                  cellRenderer={({ cellData }) => cellData.render}
                />
              </Table>
            )}
          </AutoSizer>
        </Grid>
        <Grid
          style={{
            display: 'flex',
            padding: '1rem',
            background: tab === 'fiat' ? theme.palette.grey.main : '',
            alignItems: 'center',
            justifyContent: 'flex-end',
            cursor: 'pointer',
            fontSize: '1.4rem',
            color: theme.palette.grey.light,
            height: '3rem',
          }}
          onClick={() => onTabChange('fiat')}
        >
          {/* Binance liquidity data */}
        </Grid>
        <CustomMarketDialog
          theme={theme}
          open={showAddMarketPopup}
          onClose={() => this.setState({ showAddMarketPopup: false })}
          onAddCustomMarket={onAddCustomMarket}
          getSerumMarketDataQueryRefetch={getSerumMarketDataQueryRefetch}
        />
        <WarningPopup theme={theme} />
      </StyledGrid>
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
    // TODO: make chache-first here and in CHART by refetching this after adding market
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
    // TODO: make chache-first here and in CHART by refetching this after adding market
    fetchPolicy: 'cache-and-network',
  })
  // queryRendererHoc({
  //   query: getSelectorSettings,
  //   skip: (props: any) => !props.authenticated,
  //   withOutSpinner: true,
  //   withTableLoader: false,
  //   name: 'getSelectorSettingsQuery',
  // })
)(SelectWrapper)
