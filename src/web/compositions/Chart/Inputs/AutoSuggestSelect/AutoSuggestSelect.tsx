import React from 'react'
import { withTheme } from '@material-ui/styles'
import { compose } from 'recompose'
import { graphql } from 'react-apollo'

import stableCoins from '@core/config/stableCoins'
import { queryRendererHoc } from '@core/components/QueryRenderer'
import { ADD_CHART } from '@core/graphql/mutations/chart/addChart'
import { GET_CHARTS } from '@core/graphql/queries/chart/getCharts'
import { getSelectorSettings } from '@core/graphql/queries/chart/getSelectorSettings'
import { MARKETS_BY_EXCHANE_QUERY } from '@core/graphql/queries/chart/MARKETS_BY_EXCHANE_QUERY'

import TextInputLoader from '@sb/components/Placeholders/TextInputLoader'

import { IProps, IState } from './AutoSuggestSeletec.types'
import { ExchangePair, SelectR } from './AutoSuggestSelect.styles'
import { GET_VIEW_MODE } from '@core/graphql/queries/chart/getViewMode'
import { CHANGE_CURRENCY_PAIR } from '@core/graphql/mutations/chart/changeCurrencyPair'
import { updateFavoritePairs } from '@core/graphql/mutations/chart/updateFavoritePairs'
import SelectWrapper from '../SelectWrapper/SelectWrapper'

@withTheme()
class IntegrationReactSelect extends React.PureComponent<IProps, IState> {
  state = {
    isClosed: true,
    isMenuOpen: false,
  }

  onMenuOpen = () => {
    this.setState({ isClosed: false })
  }

  onMenuClose = () => {
    this.setState({ isClosed: true })
  }

  toggleMenu = () => {
    this.setState((prevState) => ({ isMenuOpen: !prevState.isMenuOpen }))
  }

  closeMenu = () => {
    this.setState({ isMenuOpen: false })
  }

  handleChange = async ({ value }: { value: string }) => {
    const {
      getCharts,
      getViewModeQuery: {
        chart: { view },
      },
      addChartMutation,
      changeCurrencyPairMutation,
    } = this.props
    const {
      multichart: { charts },
    } = getCharts

    if (!value) {
      return
    }

    this.closeMenu()

    if (view === 'default') {
      await changeCurrencyPairMutation({
        variables: {
          pairInput: {
            pair: value,
          },
        },
      })

      return
    } else if (charts.length < 8 && view === 'onlyCharts') {
      await addChartMutation({
        variables: {
          chart: value,
        },
      })

      return
    }
  }

  render() {
    const {
      getViewModeQuery: {
        chart: { view },
      },
      value,
      data,
      theme: {
        palette: { divider },
      },
      theme,
      selectStyles,
      getSelectorSettingsQuery,
      updateFavoritePairsMutation,
    } = this.props

    const { isClosed, isMenuOpen } = this.state

    const {
      getAccountSettings: {
        selectorSettings: { favoritePairs },
      },
    } = getSelectorSettingsQuery

    const favoritePairsMap = favoritePairs.reduce(
      (acc: Map<string, string>, el: string) => {
        acc.set(el, el)

        return acc
      },
      new Map()
    )

    const { getMarketsByExchange = [] } = data || { getMarketsByExchange: [] }

    const customFilterOption = (
      option: { value: string; label: string },
      rawInput: string
    ) => {
      const words = rawInput.split(' ')
      return words.reduce(
        (acc, cur) =>
          acc && option.label.toLowerCase().includes(cur.toLowerCase()),
        true
      )
    }

    console.time('processing')
    const suggestions = getMarketsByExchange
      .map((el) => el.symbol)
      .filter(
        (symbol: string, index, origArray) =>
          origArray.indexOf(symbol) === index &&
          (symbol.split('_')[0] !== 'undefined' &&
            symbol.split('_')[1] !== 'undefined')
      )
      .sort((a, b) =>
        /BTC_/.test(a) ? -1 : /BTC_/.test(b) ? 1 : /_BTC/.test(b) ? 0 : -1
      )
      .map((symbol: string) => ({
        value: symbol,
        label: symbol,
      }))

    const stableCoinsRegexp = new RegExp(stableCoins.join('|'), 'g')
    const altCoinsRegexp = new RegExp(`${stableCoins.join('|')}|BTC`, 'g')

    const StableCoinsPairs = suggestions.filter((el) =>
      stableCoinsRegexp.test(el.label)
    )
    const BTCCoinsPairs = suggestions.filter(
      (el) => /BTC/g.test(el.label) && !stableCoinsRegexp.test(el.label)
    )
    const AltCoinsPairs = suggestions.filter(
      (el) => !altCoinsRegexp.test(el.label)
    )

    console.timeEnd('processing')

    console.log('StableCoinsPairs', StableCoinsPairs)
    console.log('BTCCoinsPairs', BTCCoinsPairs)
    console.log('AltCoinsPairs', AltCoinsPairs)

    return (
      <>
        {isMenuOpen && (
          <SelectWrapper
            data={getMarketsByExchange}
            theme={theme}
            favoritePairsMap={favoritePairsMap}
            updateFavoritePairsMutation={updateFavoritePairsMutation}
            onSelectPair={this.handleChange}
            closeMenu={this.closeMenu}
          />
        )}
        <ExchangePair
          style={{ width: '14.4rem' }}
          border={divider}
          selectStyles={selectStyles}
          onClick={this.toggleMenu}
          // onMouseOver={this.toggleMenu}
        >
          <SelectR
            id={this.props.id}
            style={{ width: '100%' }}
            // filterOption={customFilterOption}
            // placeholder="Add chart"
            value={isClosed && value && { value, label: value }}
            fullWidth={true}
            isDisabled={true}
            // options={suggestions || []}
            // onChange={this.handleChange}
            // onMenuOpen={this.onMenuOpen}
            // onMenuClose={this.onMenuClose}
            // closeMenuOnSelect={view === 'default'}
          />
        </ExchangePair>
      </>
    )
  }
}

export default compose(
  queryRendererHoc({
    query: MARKETS_BY_EXCHANE_QUERY,
    variables: (props) => ({
      splitter: '_',
      exchange: props.activeExchange.symbol,
      marketType: props.marketType,
      includeAdditionalMarketData: true,
    }),
    fetchPolicy: 'cache-and-network',
    withOutSpinner: true,
    withTableLoader: true,
    centerAlign: false,
    placeholder: <TextInputLoader style={{ width: 100, margin: 0 }} />,
  }),
  queryRendererHoc({
    query: getSelectorSettings,
    withOutSpinner: true,
    withTableLoader: true,
    name: 'getSelectorSettingsQuery',
  }),
  queryRendererHoc({
    query: GET_VIEW_MODE,
    withOutSpinner: true,
    name: 'getViewModeQuery',
  }),
  queryRendererHoc({
    query: GET_CHARTS,
    withOutSpinner: true,
    withTableLoader: false,
    name: 'getCharts',
  }),
  graphql(CHANGE_CURRENCY_PAIR, {
    name: 'changeCurrencyPairMutation',
  }),
  graphql(updateFavoritePairs, {
    name: 'updateFavoritePairsMutation',
  }),
  graphql(ADD_CHART, { name: 'addChartMutation' })
)(IntegrationReactSelect)
