import React from 'react'
import { compose } from 'recompose'
import { queryRendererHoc } from '@core/components/QueryRenderer'
import { getSerumAvgTotalStats } from '@core/graphql/queries/analytics/getSerumAvgTotalStats'

import { endOfDayTimestamp, dayDuration } from '../utils'

import ButterflyChart from './ButterflyChart'

const CountButterflyChart = ({ theme, getSerumAvgTotalStatsQuery }) => {
  return (
    <ButterflyChart
      theme={theme}
      data={getSerumAvgTotalStatsQuery.getSerumAvgTotalStats}
      id={`second`}
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
