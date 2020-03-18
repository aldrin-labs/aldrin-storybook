import React from 'react'
import { withTheme } from '@material-ui/styles'
import { compose } from 'recompose'
import { graphql } from 'react-apollo'
import { createFilter } from 'react-select'

import QueryRenderer, { queryRendererHoc } from '@core/components/QueryRenderer'
import { ADD_CHART } from '@core/graphql/mutations/chart/addChart'
import { GET_CHARTS } from '@core/graphql/queries/chart/getCharts'
import { MARKETS_BY_EXCHANE_QUERY } from '@core/graphql/queries/chart/MARKETS_BY_EXCHANE_QUERY'

import { Loading } from '@sb/components/Loading/Loading'
import TextInputLoader from '@sb/components/Placeholders/TextInputLoader'

import { IProps, IState } from './AutoSuggestSeletec.types'
import { ExchangePair, SelectR } from './AutoSuggestSelect.styles'
import { GET_VIEW_MODE } from '@core/graphql/queries/chart/getViewMode'
import { CHANGE_CURRENCY_PAIR } from '@core/graphql/mutations/chart/changeCurrencyPair'
import { TOGGLE_WARNING_MESSAGE } from '@core/graphql/mutations/chart/toggleWarningMessage'

type T = { value: string; data: string }

let suggestions: T[] = []

@withTheme
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

  handleChange = async ({ value }) => {
    const {
      getCharts,
      getViewModeQuery: {
        chart: { view },
      },
      addChartMutation,
      changeCurrencyPairMutation,
      toggleWarningMessageMutation = () => {},
    } = this.props
    const {
      multichart: { charts },
    } = getCharts

    if (!value) {
      return
    }

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
    } else {
      setTimeout(async () => {
        await toggleWarningMessageMutation({})
      }, 1500)
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
      selectStyles,
    } = this.props
    if (!suggestions || !data) {
      return <Loading centerAligned={true} />
    }

    const customFilterOption = (option, rawInput) => {
      const words = rawInput.split(' ')
      return words.reduce(
        (acc, cur) =>
          acc && option.label.toLowerCase().includes(cur.toLowerCase()),
        true
      )
    }

    if (data) {
      suggestions = data.getMarketsByExchange
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
    }
    return (
      <ExchangePair
        style={{ width: '14.4rem' }}
        border={divider}
        selectStyles={selectStyles}
      >
        <SelectR
          id={this.props.id}
          style={{ width: '100%' }}
          filterOption={customFilterOption}
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
    variables={{
      splitter: '_',
      exchange: props.activeExchange.symbol,
      marketType: props.marketType,
    }}
    withOutSpinner={true}
    fetchPolicy={'cache-and-network'}
    {...props}
  />
)

export default compose(
  queryRendererHoc({
    query: GET_VIEW_MODE,
    withOutSpinner: true,
    name: 'getViewModeQuery',
    fetchPolicy: 'cache-and-network',
  }),
  queryRendererHoc({
    query: GET_CHARTS,
    withOutSpinner: true,
    withTableLoader: false,
    name: 'getCharts',
    fetchPolicy: 'cache-and-network',
  }),
  graphql(CHANGE_CURRENCY_PAIR, {
    name: 'changeCurrencyPairMutation',
  }),
  graphql(ADD_CHART, { name: 'addChartMutation' })
)(queryRender)
