import React from 'react'
import { compose } from 'recompose'
import { queryRendererHoc } from '@core/components/QueryRenderer/index'
import { endOfDayTimestamp, dayDuration } from '../utils'
import { getSerumQuoteTradeVolumeStats } from '@core/graphql/queries/analytics/getSerumQuoteTradeVolumeStats'

import {
  formatNumberToUSFormat,
  stripDigitPlaces,
} from '@core/utils/PortfolioTableUtils'

import { BlockValue } from './MarketInfo'

const FeesBlock = ({ theme, getSerumQuoteTradeVolumeStatsQuery }) => {
  const dataForToday =
    getSerumQuoteTradeVolumeStatsQuery.getSerumQuoteTradeVolumeStats[
      getSerumQuoteTradeVolumeStatsQuery.getSerumQuoteTradeVolumeStats.length - 1
    ]
  return (
    <BlockValue theme={theme}>{`$${formatNumberToUSFormat(
      stripDigitPlaces(dataForToday.buy * 0.0022 - dataForToday.buy * 0.0003, 2)
    )}`}</BlockValue>
  )
}

export default compose(
  queryRendererHoc({
    query: getSerumQuoteTradeVolumeStats,
    name: 'getSerumQuoteTradeVolumeStatsQuery',
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
)(FeesBlock)
