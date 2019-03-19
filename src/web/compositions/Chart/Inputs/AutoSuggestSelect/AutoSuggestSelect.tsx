import React from 'react'
import { connect } from 'react-redux'
import { withTheme } from '@material-ui/core'
import { compose } from 'recompose'
import { graphql } from 'react-apollo'
import { createFilter } from 'react-select'

import QueryRenderer, { queryRendererHoc } from '@core/components/QueryRenderer'
import { ADD_CHART } from '@core/graphql/mutations/chart/addChart'
import { GET_CHARTS } from '@core/graphql/queries/chart/getCharts'
import { MARKETS_BY_EXCHANE_QUERY } from '@core/graphql/queries/chart/MARKETS_BY_EXCHANE_QUERY'
import * as actions from '@core/redux/chart/actions'

import { Loading } from '@sb/components/Loading/Loading'
import TextInputLoader from '@sb/components/Placeholders/TextInputLoader'

import { IProps, IState } from './AutoSuggestSeletec.types'
import { ExchangePair, SelectR } from './AutoSuggestSelect.styles'

type T = { value: string; data: string }

let suggestions: T[] = []

@withTheme()
class IntegrationReactSelect extends React.Component<IProps, IState> {
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
      openWarningMessage,
      removeWarningMessage,
      addChartMutation,
    } = this.props
    const {
      multichart: { charts },
    } = getCharts

    if (!value) {
      return
    }

    if (view === 'default') {
      selectCurrencies(value)

      return
    } else if (charts.length < 8 && view === 'onlyCharts') {
      //TODO: I guess we should await the addChartMutation function
      addChartMutation({
        variables: {
          chart: value,
        },
      })

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

const queryRender = (props: IProps) => (
  <QueryRenderer
    centerAlign={false}
    placeholder={() => <TextInputLoader style={{ width: 100, margin: 0 }} />}
    component={IntegrationReactSelect}
    query={MARKETS_BY_EXCHANE_QUERY}
    variables={{ splitter: '_', exchange: props.activeExchange.symbol }}
    {...props}
  />
)

const mapStateToProps = (store: any) => ({
  view: store.chart.view,
})

const mapDispatchToProps = (dispatch: any) => ({
  openWarningMessage: () => dispatch(actions.openWarningMessage()),
  removeWarningMessage: () => dispatch(actions.removeWarningMessage()),
  selectCurrencies: (baseQuote: string) =>
    dispatch(actions.selectCurrencies(baseQuote)),
})

export default compose(
  queryRendererHoc({
    query: GET_CHARTS,
    withOutSpinner: false,
    withTableLoader: false,
    name: 'getCharts',
  }),
  graphql(ADD_CHART, { name: 'addChartMutation' }),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(queryRender)
