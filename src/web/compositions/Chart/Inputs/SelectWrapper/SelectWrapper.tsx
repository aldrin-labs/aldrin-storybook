import React from 'react'
import { compose } from 'recompose'
import styled from 'styled-components'
import { Grid, Input, InputAdornment } from '@material-ui/core'
import { withTheme } from '@material-ui/core/styles'
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer'
import { Column, Table, SortDirection } from 'react-virtualized'
import 'react-virtualized/styles.css'
import dayjs from 'dayjs'

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
} from './SelectWrapper.utils'
import { withMarketUtilsHOC } from '@core/hoc/withMarketUtilsHOC'
import { withPublicKey } from '@core/hoc/withPublicKey'
import { Row, RowContainer } from '@sb/compositions/AnalyticsRoute/index.styles'
import { withRouter } from 'react-router'

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
    padding: 1rem;
    background: ${(props) =>
      props.isSelected ? props.theme.palette.dark.background : 'inherit'};
    border-radius: 0.3rem;
    cursor: pointer;
    font-family: Avenir Next Demi;
    font-size: 1.4rem;
    color: ${(props) =>
      props.isSelected
        ? props.theme.palette.dark.main
        : props.theme.palette.grey.text};
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
      getSerumMarketDataQuery,
    } = this.props

    const { left } = document
      .getElementById('ExchangePair')
      ?.getBoundingClientRect()
    const { sortBy, sortDirection } = this.state

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
    })

    this.setState({
      processedSelectData: this._sortList({
        sortBy,
        sortDirection,
        data: processedSelectData,
      }),
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
    } = nextProps
    const { data: prevPropsData } = this.props
    const { sortBy, sortDirection } = this.state

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
    })

    this.setState({
      processedSelectData: this._sortList({
        sortBy,
        sortDirection,
        data: processedSelectData,
      }),
    })
  }

  _sortList = ({ sortBy, sortDirection, data }) => {
    let dataToSort = data

    if (!dataToSort) {
      dataToSort = this.state.processedSelectData
    }

    let newList = [...dataToSort]

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

    return newList
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
          background: theme.palette.white.background,
          minWidth: '70rem',
          height: '35rem',
          borderRadius: '.4rem',
          overflow: 'hidden',
          border: theme.palette.border.new,
          boxShadow: '0px .4rem .6rem rgba(8, 22, 58, 0.3)',
        }}
      >
        <RowContainer
          style={{
            height: '5rem',
            padding: '0.5rem',
            justifyContent: 'space-around',
            flexDirection: 'row',
            flexWrap: 'nowrap',
            alignItems: 'center',
            borderBottom: theme.palette.border.new,
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
            All
          </StyledTab>
          <StyledTab
            theme={theme}
            isSelected={tab === 'usdt'}
            onClick={() => onTabChange('usdt')}
          >
            USDT
          </StyledTab>
          <StyledTab
            theme={theme}
            isSelected={tab === 'usdc'}
            onClick={() => onTabChange('usdc')}
          >
            USDC
          </StyledTab>
          <StyledTab
            theme={theme}
            isSelected={tab === 'leveraged'}
            onClick={() => onTabChange('leveraged')}
          >
            Leveraged tokens
          </StyledTab>
          <StyledTab
            theme={theme}
            isSelected={tab === 'public'}
            onClick={() => onTabChange('public')}
          >
            Public markets
          </StyledTab>
          <StyledTab
            theme={theme}
            isSelected={tab === 'private'}
            onClick={() => onTabChange('private')}
          >
            Private markets{' '}
          </StyledTab>
          <AddCircleIcon
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
          />
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
            placeholder="Search"
            disableUnderline={true}
            style={{
              width: '100%',
              height: '3rem',
              background: theme.palette.white.background,
              // borderRadius: '0.3rem',
              color: theme.palette.grey.placeholder,
              borderBottom: `.1rem solid ${theme.palette.grey.newborder}`,
              paddingLeft: '1rem',
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
                  justifyContent: 'center',
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
                  // color: theme.palette.dark.main,
                  borderBottom: `0.05rem solid ${theme.palette.grey.newborder}`,
                }}
                headerHeight={window.outerHeight / 40}
                headerStyle={{
                  color: theme.palette.grey.title,
                  paddingLeft: '.5rem',
                  paddingTop: '.25rem',
                  marginLeft: 0,
                  marginRight: 0,
                  letterSpacing: '.075rem',
                  // borderBottom: '.1rem solid #e0e5ec',
                  fontSize: '1.2rem',
                  outline: 'none',
                }}
                rowHeight={window.outerHeight / 30}
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
                  label={`Pair`}
                  dataKey="symbol"
                  headerStyle={{
                    color: theme.palette.grey.title,
                    paddingRight: '6px',
                    paddingLeft: '1rem',
                    fontSize: '1rem',
                    textAlign: 'left',
                  }}
                  width={width}
                  style={{
                    textAlign: 'left',
                    fontSize: '1.2rem',
                    fontWeight: 'bold',
                  }}
                  cellRenderer={({ cellData }) => cellData.render}
                />
                <Column
                  label={`last price`}
                  dataKey="price"
                  headerStyle={{
                    color: theme.palette.grey.title,
                    paddingRight: 'calc(10px)',
                    fontSize: '1rem',
                    textAlign: 'left',
                  }}
                  width={width}
                  style={{
                    textAlign: 'left',
                    fontSize: '1.2rem',
                    fontWeight: 'bold',
                  }}
                  cellRenderer={({ cellData }) => cellData.render}
                />
                <Column
                  label={`24H CHANGE`}
                  dataKey="price24hChange"
                  headerStyle={{
                    color: theme.palette.grey.title,
                    paddingRight: 'calc(10px)',
                    fontSize: '1rem',
                    textAlign: 'left',
                  }}
                  width={width * 1.5}
                  style={{
                    textAlign: 'left',
                    fontSize: '1.2rem',
                    fontWeight: 'bold',
                  }}
                  cellRenderer={({ cellData }) => cellData.render}
                />
                <Column
                  label={`24H VOLUME`}
                  dataKey="volume24hChange"
                  headerStyle={{
                    color: theme.palette.grey.title,
                    paddingRight: 'calc(10px)',
                    fontSize: '1rem',
                    textAlign: 'left',
                  }}
                  width={width}
                  style={{
                    textAlign: 'left',
                    fontSize: '1.2rem',
                    fontWeight: 'bold',
                  }}
                  cellRenderer={({ cellData }) => cellData.render}
                />
                <Column
                  label={`trades 24h`}
                  dataKey="trades24h"
                  headerStyle={{
                    color: theme.palette.grey.title,
                    paddingRight: 'calc(10px)',
                    fontSize: '1rem',
                    textAlign: 'left',
                  }}
                  width={width}
                  style={{
                    textAlign: 'left',
                    fontSize: '1.2rem',
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
  })
  // queryRendererHoc({
  //   query: getSelectorSettings,
  //   skip: (props: any) => !props.authenticated,
  //   withOutSpinner: true,
  //   withTableLoader: false,
  //   name: 'getSelectorSettingsQuery',
  // })
)(SelectWrapper)
