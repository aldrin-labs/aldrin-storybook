import React from 'react'
import { compose } from 'recompose'
import { Grid, Input, InputAdornment } from '@material-ui/core'
import { withTheme } from '@material-ui/core/styles'
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer'
import { Column, Table } from 'react-virtualized'
import 'react-virtualized/styles.css'

import { withAuthStatus } from '@core/hoc/withAuthStatus'
import { getSelectorSettings } from '@core/graphql/queries/chart/getSelectorSettings'
import { MARKETS_BY_EXCHANE_QUERY } from '@core/graphql/queries/chart/MARKETS_BY_EXCHANE_QUERY'
import { queryRendererHoc } from '@core/components/QueryRenderer'
import stableCoins, {
  fiatPairs,
  stableCoinsWithoutFiatPairs,
} from '@core/config/stableCoins'
import ReactSelectComponent from '@sb/components/ReactSelectComponent'
import favoriteSelected from '@icons/favoriteSelected.svg'
import search from '@icons/search.svg'

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
    const { marketsByExchangeQuery, getSelectorSettingsQuery, markets = [] } = this.props

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

    const dexMarketSymbols = markets.map(el => ({ symbol: el.name }))

    const filtredMarketsByExchange = dexMarketSymbols.filter(
      (el) =>
        el.symbol &&
        // +el.volume24hChange &&
        // +el.price &&
        !Array.isArray(el.symbol.match(fiatRegexp)) 
        // dexMarketSymbols.includes(el.symbol)
    )

    const stableCoinsRegexp = new RegExp(stableCoins.join('|'), 'g')
    const altCoinsRegexp = new RegExp(`${stableCoins.join('|')}|BTC`, 'g')

    let stableCoinsPairsMap = new Map()
    let btcCoinsPairsMap = new Map()
    let altCoinsPairsMap = new Map()
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
      marketType,
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
      favoritePairsMap,
      marketType,
    })

    this.setState({
      processedSelectData,
    })
  }

  render() {
    const { processedSelectData } = this.state
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
    } = this.props

    return (
      <Grid
        style={{
          top: '2.5rem',
          left:
            'calc(14rem)',
          position: 'absolute',
          transform: 'translateX(-100%)',
          zIndex: 900,
          background: theme.palette.white.background,
          minWidth: '35%',
          height: '35rem',
          marginTop: '3rem',
          borderRadius: '.4rem',
          overflow: 'hidden',
          border: theme.palette.border.main,
          boxShadow: '0px .4rem .6rem rgba(8, 22, 58, 0.3)',
        }}
      >
        <Grid container style={{ padding: '0.5rem' }}>
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
              background: tab === 'all' ? theme.palette.grey.main : '',
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer',
              fontSize: '1.2rem',
              color: theme.palette.grey.light,
              fontWeight: 'bold',
            }}
            onClick={() => onTabChange('all')}
          >
            ALL
          </Grid>
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
        <Grid container style={{ padding: '1rem 0' }}>
          <Input
            placeholder="Search..."
            disableUnderline={true}
            style={{
              width: '100%',
              background: theme.palette.grey.main,
              borderTop: theme.palette.border.main,
              borderBottom: theme.palette.border.main,
            }}
            value={searchValue}
            onChange={onChangeSearch}
            inputProps={{
              style: {
                paddingLeft: '1rem',
              },
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
                autoComplete="off"
              >
                <SvgIcon src={search} width="1.5rem" height="auto" />
              </InputAdornment>
            }
          />
        </Grid>
        <Grid style={{ overflow: 'hidden', height: 'calc(69% - 2rem)' }}>
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
                  borderBottom: theme.palette.border.main,
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
                    textAlign: 'left',
                    paddingRight: '6px',
                    paddingLeft: '1rem',
                  }}
                  width={width}
                  style={{
                    textAlign: 'left',
                    fontSize: '1.2rem',
                    fontWeight: 'bold',
                  }}
                  cellRenderer={({ cellData }) => cellData.render}
                />
                {/* <Column
                  label={`last price`}
                  dataKey="price"
                  headerStyle={{
                    paddingRight: 'calc(10px)',
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
                    paddingRight: 'calc(10px)',
                    textAlign: 'right',
                  }}
                  width={width}
                  style={{
                    textAlign: 'right',
                    fontSize: '1.2rem',
                    fontWeight: 'bold',
                  }}
                  cellRenderer={({ cellData }) => cellData.render}
                />
                <Column
                  label={`24H VOLUME`}
                  dataKey="volume24hChange"
                  headerStyle={{
                    paddingRight: 'calc(10px)',
                    textAlign: 'right',
                  }}
                  width={width}
                  style={{
                    textAlign: 'right',
                    fontSize: '1.2rem',
                    fontWeight: 'bold',
                  }}
                  cellRenderer={({ cellData }) => cellData.render}
                /> */}
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
      </Grid>
    )
  }
}

export default compose(
  withAuthStatus,
  withTheme(),
  // queryRendererHoc({
  //   query: MARKETS_BY_EXCHANE_QUERY,
  //   name: 'marketsByExchangeQuery',
  //   variables: (props) => ({
  //     splitter: '_',
  //     exchange: props.activeExchange.symbol,
  //     marketType: props.marketType,
  //     includeAdditionalMarketData: true,
  //   }),
  //   fetchPolicy: 'cache-and-network',
  //   withOutSpinner: true,
  //   withTableLoader: false,
  // }),
  queryRendererHoc({
    query: getSelectorSettings,
    skip: (props: any) => !props.authenticated,
    withOutSpinner: true,
    withTableLoader: false,
    name: 'getSelectorSettingsQuery',
  })
)(SelectWrapper)
