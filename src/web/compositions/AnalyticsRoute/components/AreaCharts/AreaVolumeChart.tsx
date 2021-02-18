import React from 'react'
import { compose } from 'recompose'
import { queryRendererHoc } from '@core/components/QueryRenderer'
import { getSerumQuoteTradeVolumeStats } from '@core/graphql/queries/analytics/getSerumQuoteTradeVolumeStats'

import { endOfDayTimestamp, dayDuration } from '../utils'

import AreaChart from './AreaChart'

const AreaVolumeChart = ({ theme, getSerumQuoteTradeVolumeStatsQuery, selectedPair }) => {
  return (
    <AreaChart
      theme={theme}
      data={getSerumQuoteTradeVolumeStatsQuery.getSerumQuoteTradeVolumeStats}
      selectedPair={selectedPair}
      id={`second`}
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
      sinceTimestamp: endOfDayTimestamp - dayDuration * 29,
    }),
    fetchPolicy: 'network-only',
    withOutSpinner: false,
    withTableLoader: false,
    withoutLoading: false,
  })
)(AreaVolumeChart)
