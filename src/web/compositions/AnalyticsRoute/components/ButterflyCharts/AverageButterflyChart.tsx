import React from 'react'
import { compose } from 'recompose'
import { queryRendererHoc } from '@core/components/QueryRenderer'
import { getSerumAvgTotalStats } from '@core/graphql/queries/analytics/getSerumAvgTotalStats'

import { endOfDayTimestamp, dayDuration, generateIDFromValues } from '../utils'

import ButterflyChart from './ButterflyChart'

const CountButterflyChart = ({ theme, getSerumAvgTotalStatsQuery, selectedPair }) => {
  return (
    <ButterflyChart
      theme={theme}
      data={getSerumAvgTotalStatsQuery.getSerumAvgTotalStats}
      id={
        'getSerumAvgTotalStatsQuery' +
        generateIDFromValues(getSerumAvgTotalStatsQuery.getSerumAvgTotalStats) +
        selectedPair + 
        getSerumAvgTotalStatsQuery.loading
      }
      title={'Average Trade Value'}
      needQuoteInLabel={true}
    />
  )
}

export default compose(
  queryRendererHoc({
    query: getSerumAvgTotalStats,
    name: 'getSerumAvgTotalStatsQuery',
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
