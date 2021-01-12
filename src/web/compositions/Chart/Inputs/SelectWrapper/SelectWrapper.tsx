import React from 'react'
import { compose } from 'recompose'
import { Grid, Input, InputAdornment } from '@material-ui/core'
import { withTheme } from '@material-ui/core/styles'
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer'
import { Column, Table } from 'react-virtualized'
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

const excludedPairs = [
  'ALTBEAR_USDT',
  'ALTBULL_USDT',
  'BCHBEAR_USDT',
  'USDC_ODOP',
  'MIDBEAR_USDT',
  'MIDBULL_USDT',
  'XRPBEAR_USDT',
  'XRPBULL_USDT'
]

const datesForQuery = {
  startOfTime: dayjs()
    .startOf('hour')
    .subtract(24, 'hour')
    .valueOf(),

  endOfTime: dayjs()
    .startOf('hour')
    .valueOf(),

  prevStartTimestamp: dayjs()
    .startOf('hour')
    .subtract(48, 'hour')
    .valueOf(),

  prevEndTimestamp: dayjs()
    .startOf('hour')
    .subtract(24, 'hour')
    .valueOf(),
}
class SelectWrapper extends React.PureComponent<IProps, IState> {
  state: IState = {
    searchValue: '',
    tab: 'all',
    tabSpecificCoin: '',
  }

  onChangeSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      AWESOME_MARKETS,
      AWESOME_TOKENS = [],
      setCustomMarkets,
      setMarketAddress,
      customMarkets,
      getSerumMarketDataQuery,
      getSerumMarketDataQueryRefetch
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

    const { getMarketsByExchange = [] } = marketsByExchangeQuery || {
      getMarketsByExchange: [],
    }

    const fiatRegexp = new RegExp(fiatPairs.join('|'), 'gi')

    // console.log('markets', markets)

    const dexMarketSymbols = markets.map((el) => ({
      symbol: el.name,
      isAwesomeMarket: el.isAwesomeMarket,
    }))

    // const filtredMarketsByExchange = getSerumMarketDataQuery.getSerumMarketData.filter(
    const filtredMarketsByExchange = dexMarketSymbols.filter(
      (el) =>
        el.symbol &&
        // +el.volume24hChange &&
        // +el.price &&
        !Array.isArray(el.symbol.match(fiatRegexp)) &&
        !el.symbol.includes('USDC') &&
        !excludedPairs.includes(el.symbol)
      // dexMarketSymbols.includes(el.symbol)
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
    console.log('getSerumMarketDataQuery', getSerumMarketDataQuery)
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
      processedSelectData,
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
      processedSelectData,
    })
  }

  render() {
    const { processedSelectData, showAddMarketPopup } = this.state
    const {
      theme,
      searchValue,
      tab,
      tabSpecificCoin,
      onChangeSearch,
      onTabChange,
      marketType,
      closeMenu,
      onSpecificCoinChange,
      marketsByExchangeQuery,
      setCustomMarkets,
      setMarketAddress,
      customMarkets,
      getSerumMarketDataQueryRefetch
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
      setMarketAddress(customMarket.address)
      
      return true
    }

    return (
      <Grid
        style={{
          top: '2.5rem',
          fontFamily: 'DM Sans',
          left: 'calc(0)',
          position: 'absolute',
          // transform: 'translateX(-100%)',
          zIndex: 900,
          background: theme.palette.white.background,
          minWidth: '43%',
          height: '35rem',
          marginTop: '3rem',
          borderRadius: '.4rem',
          overflow: 'hidden',
          border: `1px solid ${theme.palette.grey.newborder}`,
          boxShadow: '0px .4rem .6rem rgba(8, 22, 58, 0.3)',
        }}
      >
        <Grid
          container
          style={{
            height: '5rem',
            padding: '0.5rem',
            justifyContent: 'flex-start',
            // justifyContent: 'space-around',
            flexDirection: 'row',
            flexWrap: 'nowrap',
            alignItems: 'center',
            borderBottom: `1px solid ${theme.palette.grey.newborder}`,
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
          <Grid
            style={{
              padding: '1rem',
              background: tab === 'all' ? theme.palette.grey.input : '',
              display: 'flex',
              borderRadius: '0.3rem',
              alignItems: 'center',
              cursor: 'pointer',
              height: '2rem',
              fontFamily: 'Avenir Next Demi',
              fontSize: '1.4rem',
              color: theme.palette.grey.text,
              fontWeight: 'bold',
              // borderLeft: `.1rem solid ${theme.palette.grey.newborder}`,
            }}
            onClick={() => onTabChange('all')}
          >
            ALL
          </Grid>
          <Grid
            style={{
              padding: '1rem',
              background: tab === 'usdt' ? theme.palette.grey.input : '',
              display: 'flex',
              alignItems: 'center',
              borderRadius: '0.3rem',
              cursor: 'pointer',
              fontFamily: 'Avenir Next Demi',
              fontSize: '1.4rem',
              height: '2rem',
              color: theme.palette.grey.text,
              fontWeight: 'bold',
              // borderLeft: `.1rem solid ${theme.palette.grey.newborder}`,
            }}
            onClick={() => onTabChange('usdt')}
          >
            USDT
          </Grid>
          {/* <Grid
            style={{
              padding: '1rem',
              background: tab === 'usdc' ? theme.palette.grey.input : '',
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer',
              borderRadius: '0.3rem',
              fontFamily: 'Avenir Next Demi',
              fontSize: '1.4rem',
              height: '2rem',
              color: theme.palette.grey.text,
              fontWeight: 'bold',
              // borderLeft: `.1rem solid ${theme.palette.grey.newborder}`,
            }}
            onClick={() => onTabChange('usdc')}
          >
            USDC
          </Grid>
          <Grid
            style={{
              padding: '1rem',
              height: '2rem',
              background: tab === 'leveraged' ? theme.palette.grey.input : '',
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer',
              borderRadius: '0.3rem',
              fontFamily: 'Avenir Next Demi',
              fontSize: '1.4rem',
              whiteSpace: 'nowrap',
              color: theme.palette.grey.text,
              fontWeight: 'bold',
              // borderLeft: `.1rem solid ${theme.palette.grey.newborder}`,
            }}
            onClick={() => onTabChange('leveraged')}
          >
            Leveraged tokens
          </Grid>
          <Grid
            style={{
              padding: '1rem',
              height: '2rem',
              background: tab === 'public' ? theme.palette.grey.input : '',
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer',
              borderRadius: '0.3rem',
              fontFamily: 'Avenir Next Demi',
              fontSize: '1.4rem',
              whiteSpace: 'nowrap',
              color: theme.palette.grey.text,
              fontWeight: 'bold',
              // borderLeft: `.1rem solid ${theme.palette.grey.newborder}`,
            }}
            onClick={() => onTabChange('public')}
          >
            Public markets
          </Grid>
          <Grid
            style={{
              padding: '1rem',
              height: '2rem',
              background: tab === 'private' ? theme.palette.grey.input : '',
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer',
              borderRadius: '0.3rem',
              fontFamily: 'Avenir Next Demi',
              fontSize: '1.4rem',
              whiteSpace: 'nowrap',
              color: theme.palette.grey.text,
              fontWeight: 'bold',
              // borderLeft: `.1rem solid ${theme.palette.grey.newborder}`,
            }}
            onClick={() => onTabChange('private')}
          >
            Private markets{' '}
          </Grid> */}
          <AddCircleIcon
            onClick={() => this.setState({ showAddMarketPopup: true })}
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
        </Grid>
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
                onRowClick={({ event, index, rowData }) => {
                  rowData.symbol.onClick()
                }}
                gridStyle={{
                  outline: 'none',
                }}
                rowStyle={{
                  outline: 'none',
                  cursor: 'pointer',
                  color: theme.palette.grey.light,
                  borderBottom: `0.05rem solid ${theme.palette.grey.newborder}`,
                }}
                headerHeight={window.outerHeight / 40}
                headerStyle={{
                  color: theme.palette.dark.main,
                  paddingLeft: '.5rem',
                  paddingTop: '.25rem',
                  marginLeft: 0,
                  marginRight: 0,
                  letterSpacing: '.075rem',
                  // borderBottom: '.1rem solid #e0e5ec',
                  fontSize: '1.2rem',
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
                    textAlign: 'center',
                    paddingRight: '6px',
                    paddingLeft: '1rem',
                    fontSize: '1rem',
                    textAlign: 'left',
                    color: theme.palette.grey.text,
                  }}
                  width={width}
                  style={{
                    color: theme.palette.grey.text,

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
                    paddingRight: 'calc(10px)',
                    textAlign: 'center',
                    fontSize: '1rem',
                    textAlign: 'left',
                    color: theme.palette.grey.text,
                  }}
                  width={width}
                  style={{
                    color: theme.palette.grey.text,

                    textAlign: 'left',
                    fontSize: '1.2rem',
                    fontWeight: 'bold',
                  }}
                  cellRenderer={({ cellData }) => cellData.render}
                />
                {/* <Column
                  label={`24H CHANGE`}
                  dataKey="price24hChange"
                  headerStyle={{
                    paddingRight: 'calc(10px)',
                    textAlign: 'left',
                    fontSize: '1rem',
                    textAlign: 'left',
                    color: theme.palette.grey.text,
                  }}
                  width={width}
                  style={{
                    color: theme.palette.grey.text,

                    textAlign: 'left',
                    fontSize: '1.2rem',
                    fontWeight: 'bold',
                  }}
                  cellRenderer={({ cellData }) => cellData.render}
                /> */}
                <Column
                  label={`24H VOLUME`}
                  dataKey="volume24hChange"
                  headerStyle={{
                    paddingRight: 'calc(10px)',
                    textAlign: 'center',
                    fontSize: '1rem',
                    textAlign: 'left',
                    color: theme.palette.grey.text,
                  }}
                  width={width}
                  style={{
                    color: theme.palette.grey.text,

                    textAlign: 'left',
                    fontSize: '1.2rem',
                    fontWeight: 'bold',
                  }}
                  cellRenderer={({ cellData }) => cellData.render}
                />
                {/* <Column
                  label={`trades change 24h`}
                  dataKey="tradesChange24h"
                  headerStyle={{
                    paddingRight: 'calc(10px)',
                    textAlign: 'left',
                    fontSize: '1rem',
                    textAlign: 'left',
                    color: theme.palette.grey.text,
                  }}
                  width={width}
                  style={{
                    color: theme.palette.grey.text,

                    textAlign: 'left',
                    fontSize: '1.2rem',
                    fontWeight: 'bold',
                  }}
                  cellRenderer={({ cellData }) => cellData.render}
                /> */}
                <Column
                  label={`trades 24h`}
                  dataKey="trades24h"
                  headerStyle={{
                    paddingRight: 'calc(10px)',
                    textAlign: 'center',
                    fontSize: '1rem',
                    textAlign: 'left',
                    color: theme.palette.grey.text,
                  }}
                  width={width}
                  style={{
                    color: theme.palette.grey.text,

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
      </Grid>
    )
  }
}

export default compose(
  withMarketUtilsHOC,
  withAuthStatus,
  withPublicKey,
  withTheme(),
  // queryRendererHoc({
  //   query: MARKETS_BY_EXCHANE_QUERY,
  //   name: 'marketsByExchangeQuery',
  //   variables: (props) => ({
  //     splitter: '_',
  //     exchange: 'binance',
  //     marketType: 0,
  //     includeAdditionalMarketData: true,
  //   }),
  //   fetchPolicy: 'cache-and-network',
  //   withOutSpinner: true,
  //   withTableLoader: false,
  // }),
  // queryRendererHoc({
  //   query: getSerumMarketData,
  //   name: 'getSerumMarketDataQuery',
  //   variables: (props) => ({
  //     exchange: 'serum',
  //     publicKey: props.publicKey,
  //     marketType: 0,
  //     startTimestamp: `${datesForQuery.startOfTime}`,
  //     endTimestamp: `${datesForQuery.endOfTime}`,
  //     prevStartTimestamp: `${datesForQuery.prevStartTimestamp}`,
  //     prevEndTimestamp: `${datesForQuery.prevEndTimestamp}`,
  //   }),
  //   // TODO: make chache-first here and in CHART by refetching this after adding market
  //   fetchPolicy: 'cache-first',
  //   withOutSpinner: true,
  //   withTableLoader: false,
  // }),
  // queryRendererHoc({
  //   query: getSelectorSettings,
  //   skip: (props: any) => !props.authenticated,
  //   withOutSpinner: true,
  //   withTableLoader: false,
  //   name: 'getSelectorSettingsQuery',
  // })
)(SelectWrapper)
