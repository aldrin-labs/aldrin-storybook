import React from 'react'
import { withRouter } from 'react-router-dom'
import { withTheme } from '@material-ui/core/styles'
import { compose } from 'recompose'
import { graphql } from 'react-apollo'

// import stableCoins from '@core/config/stableCoins'
import { withMarketUtilsHOC } from '@core/hoc/withMarketUtilsHOC'
import { queryRendererHoc } from '@core/components/QueryRenderer'
import { ADD_CHART } from '@core/graphql/mutations/chart/addChart'
import { GET_CHARTS } from '@core/graphql/queries/chart/getCharts'
// import { getSelectorSettings } from '@core/graphql/queries/chart/getSelectorSettings'
// import { MARKETS_BY_EXCHANE_QUERY } from '@core/graphql/queries/chart/MARKETS_BY_EXCHANE_QUERY'

// import TextInputLoader from '@sb/components/Placeholders/TextInputLoader'

import { IProps, IState } from './AutoSuggestSeletec.types'
import { ExchangePair, SelectR } from './AutoSuggestSelect.styles'
import { GET_VIEW_MODE } from '@core/graphql/queries/chart/getViewMode'
import { CHANGE_CURRENCY_PAIR } from '@core/graphql/mutations/chart/changeCurrencyPair'
import { updateFavoritePairs } from '@core/graphql/mutations/chart/updateFavoritePairs'
import SelectWrapper from '../SelectWrapper/SelectWrapper'

class IntegrationReactSelect extends React.PureComponent<IProps, IState> {
  state = {
    isClosed: true,
    isMenuOpen: false,
  }

  componentDidMount() {
    const { value, markets, setMarketAddress } = this.props
    console.log('componentDidMount value: ', value)
    console.log('componentDidMount markets: ', markets)

    // Need to refactor this, address of a coin should be in the value, not name
    // console.log('value: ', value)
    const selectedMarketFromUrl = markets.find((el) => el.name.split('/').join('_') === value)
    // console.log('selectedMarketFormSelector', selectedMarketFormSelector)
    setMarketAddress(selectedMarketFromUrl.address.toBase58())
  }

  componentDidUpdate(prevProps) {
    if (prevProps.value !== this.props.value) {
      const { value, markets, setMarketAddress } = this.props

      // Need to refactor this, address of a coin should be in the value, not name
      // console.log('value: ', value)
      const selectedMarketFromUrl = markets.find((el) => el.name.split('/').join('_') === value)
      // console.log('selectedMarketFormSelector', selectedMarketFormSelector)
      setMarketAddress(selectedMarketFromUrl.address.toBase58())
    }
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

  openMenu = () => {
    this.setState({ isMenuOpen: true })
  }

  handleChange = async ({ value }: { value: string }) => {
    const {
      getCharts,
      getViewModeQuery: {
        chart: { view },
      },
      addChartMutation,
      changeCurrencyPairMutation,
      history,
      marketType,
      setMarketAddress,
      markets,
    } = this.props
    const {
      multichart: { charts },
    } = getCharts

    if (!value) {
      return
    }

    this.closeMenu()

    if (view === 'default') {

      // Need to refactor this, address of a coin should be in the value, not name
      // console.log('value: ', value)
      const selectedMarketFormSelector = markets.find((el) => el.name === value)
      // console.log('selectedMarketFormSelector', selectedMarketFormSelector)
      setMarketAddress(selectedMarketFormSelector.address.toBase58())

      const chartPageType = marketType === 0 ? 'spot' : 'futures'
      history.push(`/chart/${chartPageType}/${value.split('/').join('_')}`)

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
      value,
      theme: {
        palette: { divider },
      },
      theme,
      selectStyles,
      updateFavoritePairsMutation,
      marketType,
      activeExchange,
    } = this.props

    const {
      market,
      marketName,
      customMarkets,
      setCustomMarkets,
      setMarketAddress,
      markets,
      style,
      handleDeprecated,
      setHandleDeprecated,
      addMarketVisible,
      setAddMarketVisible,
      deprecatedMarkets,
      getMarketInfos, } = this.props

    const { isClosed, isMenuOpen } = this.state

    return (
      <>
        {isMenuOpen && (
          <SelectWrapper
            theme={theme}
            updateFavoritePairsMutation={updateFavoritePairsMutation}
            onSelectPair={this.handleChange}
            closeMenu={this.closeMenu}
            marketType={1}
            activeExchange={activeExchange}
            markets={markets}
          />
        )}
        <ExchangePair
          style={{ width: '14.4rem', ...style }}
          border={divider}
          selectStyles={selectStyles}
          onClick={this.toggleMenu}
        >
          <SelectR
            id={this.props.id}
            style={{ width: '100%' }}
            value={isClosed && marketName && { marketName, label: marketName }}
            fullWidth={true}
            isDisabled={true}
          />
        </ExchangePair>
      </>
    )
  }
}

export default compose(
  withRouter,
  withTheme(),
  queryRendererHoc({
    query: GET_VIEW_MODE,
    name: 'getViewModeQuery',
  }),
  queryRendererHoc({
    query: GET_CHARTS,
    name: 'getCharts',
  }),
  graphql(CHANGE_CURRENCY_PAIR, {
    name: 'changeCurrencyPairMutation',
  }),
  graphql(updateFavoritePairs, {
    name: 'updateFavoritePairsMutation',
  }),
  graphql(ADD_CHART, { name: 'addChartMutation' }),
  withMarketUtilsHOC,

)(IntegrationReactSelect)
