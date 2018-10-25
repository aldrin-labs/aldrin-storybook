import * as React from 'react'
import { graphql, compose } from 'react-apollo'

import PortfolioChart from '@components/GQLChart/PortfolioChart/PortfolioChart'
import QueryRenderer from '@components/QueryRenderer'
import gql from 'graphql-tag'

import { PRICE_HISTORY_QUERY } from '@components/GQLChart/api'

const periods = {
  '1D': 60,
  '7D': 3600,
  '1M': 3600,
  '3M': 3600,
  '1Y': 86400,
}

class GQLChart extends React.Component {
  state = {
    coins: [],
    assets: [],
    period: 3600,
    sum: 0,
    unixTimestampFrom: this.getTimestampRange(365).left,
    unixTimestampTo: this.getTimestampRange(365).right,
    days: 365,
    activeChart: '1Y',
    lastDrawLocation: null,
  }

  static getDerivedStateFromProps(newProps, state) {
    console.log({ newProps })
    if (newProps.coins !== state.coins) {
      const newState = { ...state }
      // tslint:disable-next-line:no-object-mutation
      newState.coins = newProps.coins.map((x) => x.coin)
      // tslint:disable-next-line:no-object-mutation
      newState.assets = newProps.coins
      // tslint:disable-next-line:no-object-mutation
      newState.sum = newProps.coins
        .map((x) => x.quantity)
        .reduce((prev, next) => prev + next, 0)

      // newState.activeChart = newProps.localActiveChart;
      return newState
    }
    return null
  }

  getTimestampRange(days) {
    const today = Date.now() / 1000
    return {
      left: Math.floor(today - days * 24 * 60 * 60),
      right: Math.floor(today),
    }
  }

  updateDays(days) {
    this.setState((prevState) => {
      const newState = { ...prevState }
      const area = this.getTimestampRange(days)
      newState.days = days
      newState.unixTimestampFrom = area.left
      newState.unixTimestampTo = area.right
      newState.lastDrawLocation = null

      return newState
    })
  }

  onChangeDateRange(area) {
    if (area === null) {
      area = this.getTimestampRange(this.state.days)
    }
    this.setState((prevState) => {
      const newState = { ...prevState }
      newState.unixTimestampFrom = Math.floor(area.left)
      newState.unixTimestampTo = Math.floor(area.right)
      if (newState.lastDrawLocation === null) {
        newState.lastDrawLocation = area
      } else {
        newState.lastDrawLocation = prevState.lastDrawLocation
        newState.lastDrawLocation.left = newState.unixTimestampFrom
        newState.lastDrawLocation.right = newState.unixTimestampTo
      }
      return newState
    })
  }

  setActiveChartAndUpdateDays(activeChart, days) {
    console.log({ activeChart, days });
    //    this.props.updatePortfolioMain({ variables: { activeChart, index: 'activeChart' } })
    this.setState((prevState) => {
      const newState = { ...prevState }
      const area = this.getTimestampRange(days)
      newState.days = days
      newState.unixTimestampFrom = area.left
      newState.unixTimestampTo = area.right
      newState.lastDrawLocation = null
      newState.activeChart = activeChart
      newState.period = 3600
      //      newState.period = periods[this.state.activeChart]
      console.log('newState', newState);
      return newState
    })
  }

  render() {

    const variables = {
      coins: this.state.coins,
      isBTC: false,
      unixTimestampFrom: this.state.unixTimestampFrom,
      unixTimestampTo: this.state.unixTimestampTo,
      period: this.state.period,
    };

    return (
      <div
        {...this.props}
      />
    )
  }
}

const updatePortfolioMain = gql`
  mutation updatePortfolioMain($index: String!, $value: String!) {
    updatePortfolioMain(index: $index, value: $value) @client
  }
`
const portfolioMainState = gql`
query portfolioMain {
  portfolioMain @client {
      activeChart
  }
}
`

export default compose(
  graphql(updatePortfolioMain, { name: 'updatePortfolioMain' }),
  graphql(portfolioMainState, {
    props: ({ data: { portfolioMain: { activeChart } } }) => ({
      localActiveChart: activeChart,
    }),
  })
)(GQLChart)