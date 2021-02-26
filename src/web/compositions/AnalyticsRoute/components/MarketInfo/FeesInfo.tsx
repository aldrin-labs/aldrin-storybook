import React from 'react'
import { compose } from 'recompose'
import { queryRendererHoc } from '@core/components/QueryRenderer/index'
import { endOfDayTimestamp, dayDuration } from '../utils'
import { getSerumQuoteTradeVolumeStats } from '@core/graphql/queries/analytics/getSerumQuoteTradeVolumeStats'

import {
  formatNumberToUSFormat,
  stripDigitPlaces,
} from '@core/utils/PortfolioTableUtils'

import { BlockValue, BlockTitle } from './MarketInfo'

const FeesBlock = ({
  theme,
  selectedPair,
  getSerumQuoteTradeVolumeStatsQuery,
  isNotUSDTQuote,
}) => {
  const dataForToday =
    getSerumQuoteTradeVolumeStatsQuery.getSerumQuoteTradeVolumeStats[
      getSerumQuoteTradeVolumeStatsQuery.getSerumQuoteTradeVolumeStats.length -
        1
    ]

  const [base, quote] = selectedPair.split('_')
  const preSymbol = dataForToday.buy * 0.0022 - dataForToday.sell * 0.0003 > 0 ? '' : '-'
  return (
    <>
      <BlockTitle theme={theme}>Fees (24h)</BlockTitle>
      <BlockValue theme={theme}>{`${preSymbol}${
        isNotUSDTQuote ? '' : '$'
      }${formatNumberToUSFormat(
        stripDigitPlaces(
          Math.abs(dataForToday.buy * 0.0022 - dataForToday.sell * 0.0003),
          2
        )
      )}${isNotUSDTQuote ? ` ${quote}` : ''}`}</BlockValue>
    </>
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
    loaderSize: 16,
  })
)(FeesBlock)
