import React from 'react'
import { DefaultTheme } from 'styled-components'

import {
  RowContainer,
  Title,
} from '@sb/compositions/AnalyticsRoute/index.styles'

import { stripDigitPlaces } from '@core/utils/PortfolioTableUtils'

const LoadingText = ({
  theme,
  percentageOfLoadedMarkets,
  percentageOfLoadedOrderbooks,
}: {
  theme: DefaultTheme
  percentageOfLoadedMarkets: number
  percentageOfLoadedOrderbooks: number
}) => {
  return (
    <RowContainer direction="column">
      <Title
        color={theme.colors.gray1}
        fontFamily="Avenir Next Demi"
        fontSize="3rem"
        style={{ marginBottom: '2rem' }}
      >
        Loading:{' '}
        {+stripDigitPlaces(percentageOfLoadedMarkets / 2, 0) +
          +stripDigitPlaces(percentageOfLoadedOrderbooks / 2, 0)}
        %
      </Title>
      <Title
        color={theme.colors.gray1}
        fontFamily="Avenir Next Demi"
        fontSize="2rem"
      >
        Checking the markets for{' '}
        {percentageOfLoadedMarkets === 100
          ? 'open orders'
          : 'unsettled balances'}
        ...
      </Title>
    </RowContainer>
  )
}

export default LoadingText
