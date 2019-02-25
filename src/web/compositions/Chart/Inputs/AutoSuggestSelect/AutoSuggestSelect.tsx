import React from 'react'
import { connect } from 'react-redux'
import { withTheme } from '@material-ui/styles'
import { createFilter } from 'react-select'

import { MARKETS_BY_EXCHANE_QUERY } from '@core/graphql/queries/chart/MARKETS_BY_EXCHANE_QUERY'
import * as actions from '@core/redux/chart/actions'
import QueryRenderer from '@core/components/QueryRenderer'
import { Loading } from '@sb/components/Loading/Loading'
import TextInputLoader from '@sb/components/Placeholders/TextInputLoader'

import { ExchangePair, SelectR } from './AutoSuggestSelect.styles'

import { graphql } from 'react-apollo'

import { compose } from 'recompose'
import { ADD_CHART } from '@core/graphql/mutations/chart/addChart'
import { GET_CHARTS } from '@core/graphql/queries/chart/getCharts'

import { queryRendererHoc } from '@core/components/QueryRenderer/index'



type T = { value: string; data: string }

let suggestions: T[] = []

class IntegrationReactSelect extends React.Component {

  state = {
    isClosed: true,
  }

  onMenuOpen = () => {
    this.setState({ isClosed: false })
  }

  onMenuClose = () => {
    this.setState({ isClosed: true })
  }

  handleChange = ({ value }) => {
    const {
      selectCurrencies,
      getCharts,
      view,
      addChart,
      openWarningMessage,
      removeWarningMessage,
      addChartMutation,
    } = this.props
    const { multichart: { charts } } = getCharts

    if (!value) {
      return
    }

    if (view === 'default') {
      selectCurrencies(value)

      return
    } else if (charts.length < 8 && view === 'onlyCharts') {
      addChartMutation({ variables: {
        chart: value,
      } })

      return
    } else {
      setTimeout(() => {
        removeWarningMessage()
      }, 1500)
      openWarningMessage()
    }
  }
  render() {
    const {
      view,
      value,
      data,
      theme: {
        palette: { divider },
      },
    } = this.props
    if (!suggestions || !data) {
      return <Loading centerAligned={true} />
    }

    const matchFrom: 'start' | 'any' = 'start'

    const filterConfig = {
      matchFrom,
      ignoreCase: true,
      trim: true,
    }

    if (data) {
      suggestions = data.getMarketsByExchange
        .filter(
          ({ symbol }: { symbol: string }) =>
            symbol.split('_')[0] !== 'undefined' ||
            symbol.split('_')[1] !== 'undefined'
        )
        .map((suggestion: any) => ({
          value: suggestion.symbol,
          label: suggestion.symbol,
        }))
    }
    return (
      <ExchangePair
        style={{ width: '9rem' }}
        border={divider}
        className="AutoSuggestSelect"
      >
        <SelectR
          id={this.props.id}
          style={{ width: '100%' }}
          filterOption={createFilter(filterConfig)}
          placeholder="Add chart"
          value={this.state.isClosed && value && { value, label: value }}
          fullWidth={true}
          options={suggestions || []}
          onChange={this.handleChange}
          onMenuOpen={this.onMenuOpen}
          onMenuClose={this.onMenuClose}
          closeMenuOnSelect={view === 'default'}
        />
      </ExchangePair>
    )
  }
}


const queryRender = (props: any) => {
  return (
    <QueryRenderer
      centerAlign={false}
      placeholder={() => <TextInputLoader style={{ width: 100, margin: 0 }} />}
      component={IntegrationReactSelect}
      query={MARKETS_BY_EXCHANE_QUERY}
      variables={{ splitter: '_', exchange: props.exchange.exchange.symbol }}
      {...props}
    />
  )
}

const mapStateToProps = (store: any) => ({
  activeExchange: store.chart.activeExchange,
  view: store.chart.view,
  charts: store.chart.charts,
  isShownMocks: store.user.isShownMocks,
})

const mapDispatchToProps = (dispatch: any) => ({
  openWarningMessage: () => dispatch(actions.openWarningMessage()),
  removeWarningMessage: () => dispatch(actions.removeWarningMessage()),
  selectCurrencies: (baseQuote: string) =>
    dispatch(actions.selectCurrencies(baseQuote)),
  addChart: (baseQuote: string) => dispatch(actions.addChart(baseQuote)),
})

export default queryRendererHoc({
  query: GET_CHARTS,
  withOutSpinner: false,
  withTableLoader: false,
  name: 'getCharts',
})(compose(
  graphql(ADD_CHART, { name: 'addChartMutation' })
  )(withTheme()(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(queryRender)
)))
