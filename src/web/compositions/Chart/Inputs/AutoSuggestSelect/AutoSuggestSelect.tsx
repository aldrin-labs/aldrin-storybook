import React from 'react'
import { withRouter } from 'react-router-dom'
import { withTheme } from '@material-ui/core/styles'
import { compose } from 'recompose'
import { graphql } from 'react-apollo'

// import stableCoins from '@core/config/stableCoins'
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
    } = this.props
    const {
      multichart: { charts },
    } = getCharts

    if (!value) {
      return
    }

    this.closeMenu()

    if (view === 'default') {
      const chartPageType = marketType === 0 ? 'spot' : 'futures'

      history.push(`/chart/${chartPageType}/${value}`)

      // await changeCurrencyPairMutation({
      //   variables: {
      //     pairInput: {
      //       pair: value,
      //     },
      //   },
      // })

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

    const { isClosed, isMenuOpen } = this.state

    return (
      <>
        {isMenuOpen && (
          <SelectWrapper
            theme={theme}
            updateFavoritePairsMutation={updateFavoritePairsMutation}
            onSelectPair={this.handleChange}
            closeMenu={this.closeMenu}
            marketType={marketType}
            activeExchange={activeExchange}
          />
        )}

        <ExchangePair
          style={{ width: '14.4rem' }}
          border={divider}
          selectStyles={selectStyles}
          onClick={this.toggleMenu}
        >
          <SelectR
            id={this.props.id}
            style={{ width: '100%' }}
            value={isClosed && value && { value, label: value }}
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
  graphql(ADD_CHART, { name: 'addChartMutation' })
)(IntegrationReactSelect)
