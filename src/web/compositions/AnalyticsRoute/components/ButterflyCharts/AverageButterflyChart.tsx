import React from 'react'
import { compose } from 'recompose'
import { Theme } from '@material-ui/core'
import { queryRendererHoc } from '@core/components/QueryRenderer'
import { getSerumAvgTotalStats } from '@core/graphql/queries/analytics/getSerumAvgTotalStats'

import {
  endOfDayTimestamp,
  dayDuration,
  generateIDFromValues,
  getTimezone,
} from '../utils'

import ButterflyChart from './ButterflyChart'

const CountButterflyChart = ({
  theme,
  getSerumAvgTotalStatsQuery,
  selectedPair,
}: {
  theme: Theme
  selectedPair: string
  getSerumAvgTotalStatsQuery: any
}) => {
  return (
    <ButterflyChart
      theme={theme}
      selectedPair={selectedPair}
      data={getSerumAvgTotalStatsQuery.getSerumAvgTotalStats}
      id={`getSerumAvgTotalStatsQuery${generateIDFromValues(
        getSerumAvgTotalStatsQuery.getSerumAvgTotalStats
      )}${selectedPair}${getSerumAvgTotalStatsQuery.loading}`}
      title="Average Trade Value"
      needQuoteInLabel
    />
  )
}

export default compose(
  queryRendererHoc({
    query: getSerumAvgTotalStats,
    name: 'getSerumAvgTotalStatsQuery',
    variables: (props) => ({
      pair: props.selectedPair,
      toTimestamp: endOfDayTimestamp(),
      sinceTimestamp: endOfDayTimestamp() - dayDuration * 14,
      timezone: getTimezone(),
    }),
    fetchPolicy: 'cache-and-network',
    withOutSpinner: false,
    withTableLoader: false,
    withoutLoading: false,
  })
)(CountButterflyChart)
