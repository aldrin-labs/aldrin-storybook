import { Theme } from '@material-ui/core'
import React from 'react'
import { compose } from 'recompose'

import { queryRendererHoc } from '@sb/components/QueryRenderer'

import { getSerumQuoteTradeVolumeStats } from '@core/graphql/queries/analytics/getSerumQuoteTradeVolumeStats'

import {
  endOfDayTimestamp,
  dayDuration,
  generateIDFromValues,
  getTimezone,
} from '../utils'
import AreaChart from './AreaChart'

const AreaVolumeChart = ({
  theme,
  getSerumQuoteTradeVolumeStatsQuery,
  selectedPair,
}: {
  theme: Theme
  selectedPair: string
  getSerumQuoteTradeVolumeStatsQuery: any
}) => {
  return (
    <AreaChart
      theme={theme}
      data={getSerumQuoteTradeVolumeStatsQuery.getSerumQuoteTradeVolumeStats}
      selectedPair={selectedPair}
      id={`getSerumQuoteTradeVolumeStatsQuery${generateIDFromValues(
        getSerumQuoteTradeVolumeStatsQuery.getSerumQuoteTradeVolumeStats
      )}${selectedPair}${getSerumQuoteTradeVolumeStatsQuery.loading}`}
      title="Volume"
    />
  )
}

export default compose(
  queryRendererHoc({
    query: getSerumQuoteTradeVolumeStats,
    name: 'getSerumQuoteTradeVolumeStatsQuery',
    variables: (props) => ({
      pair: props.selectedPair,
      toTimestamp: endOfDayTimestamp(),
      sinceTimestamp: endOfDayTimestamp() - dayDuration * 30,
      timezone: getTimezone(),
    }),
    fetchPolicy: 'cache-and-network',
    withOutSpinner: false,
    withTableLoader: false,
    withoutLoading: false,
  })
)(AreaVolumeChart)
