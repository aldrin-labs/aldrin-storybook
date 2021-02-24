import React from 'react'
import { compose } from 'recompose'
import { queryRendererHoc } from '@core/components/QueryRenderer'
import { getSerumQuoteTradeVolumeStats } from '@core/graphql/queries/analytics/getSerumQuoteTradeVolumeStats'

import { endOfDayTimestamp, dayDuration, generateIDFromValues } from '../utils'

import AreaChart from './AreaChart'

const sinceTimestamp = endOfDayTimestamp - dayDuration * 29

const AreaVolumeChart = ({ theme, getSerumQuoteTradeVolumeStatsQuery, selectedPair }) => {
  return (
    <AreaChart
      theme={theme}
      data={getSerumQuoteTradeVolumeStatsQuery.getSerumQuoteTradeVolumeStats}
      selectedPair={selectedPair}
      id={
        'getSerumQuoteTradeVolumeStatsQuery' + 
        generateIDFromValues(getSerumQuoteTradeVolumeStatsQuery.getSerumQuoteTradeVolumeStats) + 
        selectedPair +
        getSerumQuoteTradeVolumeStatsQuery.loading
      }
      isDataLoading={getSerumQuoteTradeVolumeStatsQuery.loading}
      title={'Average Trade Value'}
      needQuoteInLabel={true}
    />
  )
}

export default compose(
  queryRendererHoc({
    query: getSerumQuoteTradeVolumeStats,
    name: 'getSerumQuoteTradeVolumeStatsQuery',
    variables: (props) => ({
      pair: props.selectedPair,
      toTimestamp: endOfDayTimestamp,
      sinceTimestamp,
    }),
    fetchPolicy: 'cache-and-network',
    withOutSpinner: false,
    withTableLoader: false,
    withoutLoading: false,
  })
)(AreaVolumeChart)
