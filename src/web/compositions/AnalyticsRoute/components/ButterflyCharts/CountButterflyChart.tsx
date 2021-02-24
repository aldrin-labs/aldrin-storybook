import React from 'react'
import { compose } from 'recompose'
import { queryRendererHoc } from '@core/components/QueryRenderer'
import { getSerumTradesCountStats } from '@core/graphql/queries/analytics/getSerumTradesCountStats'

import { endOfDayTimestamp, dayDuration, generateIDFromValues } from '../utils'

import ButterflyChart from './ButterflyChart'


const CountButterflyChart = ({ theme, getSerumTradesCountStatsQuery, selectedPair }) => {
  const {
    getSerumTradesCountStats = []
  } = getSerumTradesCountStatsQuery || {
    getSerumTradesCountStats: []
  }

  return (
    <ButterflyChart
      theme={theme}
      needQuoteInLabel={false}
      data={getSerumTradesCountStats}
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
    }),
    fetchPolicy: 'cache-and-network',
    withOutSpinner: false,
    withTableLoader: false,
    withoutLoading: false,
  })
)(CountButterflyChart)
