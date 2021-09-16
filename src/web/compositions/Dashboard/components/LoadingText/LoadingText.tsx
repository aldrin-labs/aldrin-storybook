import React from 'react'
import { stripDigitPlaces } from '@core/utils/PortfolioTableUtils'
import {
  RowContainer,
  Title,
} from '@sb/compositions/AnalyticsRoute/index.styles'
import { Theme } from '@sb/types/materialUI'

const LoadingText = ({
  theme,
  percentageOfLoadedMarkets,
  percentageOfLoadedOrderbooks,
}: {
  theme: Theme
  percentageOfLoadedMarkets: number
  percentageOfLoadedOrderbooks: number
}) => {
  return (
    <RowContainer direction="column">
      <Title
        color={theme.palette.white.primary}
        fontFamily="Avenir Next Demi"
        fontSize="3rem"
        theme={theme}
        style={{ marginBottom: '2rem' }}
      >
        Loading:{' '}
        {+stripDigitPlaces(percentageOfLoadedMarkets / 2, 0) +
          +stripDigitPlaces(percentageOfLoadedOrderbooks / 2, 0)}
        %
      </Title>
      <Title
        color={theme.palette.white.primary}
        fontFamily="Avenir Next Demi"
        fontSize="2rem"
        theme={theme}
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
