import React from 'react'
import { Theme } from '@material-ui/core'
// import { queryRendererHoc } from '@core/components/QueryRenderer'

import { TotalVolumeLockedChart } from './index'

const TotalVolumeLockedChartDataContainer = ({ theme }: { theme: Theme }) => {
  return (
    <TotalVolumeLockedChart
      theme={theme}
      id={'TotalVolumeLockedChart'}
      title={'Volume'}
    />
  )
}

const Wrappper = TotalVolumeLockedChartDataContainer

export { Wrappper as TotalVolumeLockedChart }
// queryRendererHoc({
//   query: getSerumQuoteTradeVolumeStats,
//   name: 'getSerumQuoteTradeVolumeStatsQuery',
//   variables: (props) => ({
//     pair: props.selectedPair,
//     toTimestamp: endOfDayTimestamp,
//     sinceTimestamp,
//     timezone: getTimezone(),
//   }),
//   fetchPolicy: 'cache-and-network',
//   withOutSpinner: false,
//   withTableLoader: false,
//   withoutLoading: false,
// })
