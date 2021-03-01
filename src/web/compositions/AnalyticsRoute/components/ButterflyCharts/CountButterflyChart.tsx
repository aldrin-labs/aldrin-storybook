import React from 'react'
import { compose } from 'recompose'
import { Theme } from '@material-ui/core'
import { queryRendererHoc } from '@core/components/QueryRenderer'
import { getSerumTradesCountStats } from '@core/graphql/queries/analytics/getSerumTradesCountStats'

import { endOfDayTimestamp, dayDuration, generateIDFromValues, getTimezone } from '../utils'

import ButterflyChart from './ButterflyChart'

const CountButterflyChart = ({
  theme,
  getSerumTradesCountStatsQuery,
  selectedPair,
}: {
  theme: Theme
  selectedPair: string
  getSerumTradesCountStatsQuery: any
}) => {
  const { getSerumTradesCountStats = [] } = getSerumTradesCountStatsQuery || {
    getSerumTradesCountStats: [],
  }

  return (
    <ButterflyChart
      theme={theme}
      needQuoteInLabel={false}
      data={getSerumTradesCountStats}
      selectedPair={selectedPair}
      id={
        'getSerumTradesCountStatsQuery' +
        generateIDFromValues(getSerumTradesCountStats) +
        selectedPair +
        getSerumTradesCountStatsQuery.loading
      }
      title={'Daily Trades Count'}
    />
  )
}

export default compose(
  queryRendererHoc({
    query: getSerumTradesCountStats,
    name: 'getSerumTradesCountStatsQuery',
    variables: (props) => ({
      pair: props.selectedPair,
      toTimestamp: endOfDayTimestamp,
      sinceTimestamp: endOfDayTimestamp - dayDuration * 13,
      timezone: getTimezone()
    }),
    fetchPolicy: 'cache-and-network',
    withOutSpinner: false,
    withTableLoader: false,
    withoutLoading: false,
  })
)(CountButterflyChart)
