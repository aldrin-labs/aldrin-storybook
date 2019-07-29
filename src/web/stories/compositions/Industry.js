import React, { Suspense, lazy } from 'react'
import { ApolloProvider } from 'react-apollo'
import { IntlProvider } from 'react-intl'
import { ErrorBoundary, Loading } from '@sb/components'
import { storiesOf } from '@storybook/react'
import { radios } from '@storybook/addon-knobs'

import Industry from '@core/compositions/PortfolioIndustry'
import { App } from '@sb/compositions/App/App'
import ThemeWrapper from '@sb/compositions/App/ThemeWrapper/ThemeWrapper'

import { client } from '@core/graphql/apolloClient'

storiesOf('Compositions/Industry', module).add('Industry', () => (
  <ApolloProvider client={client}>
    <IntlProvider locale="en">
      <ErrorBoundary>
        <Suspense fallback={<Loading centerAligned />}>
          <ThemeWrapper
            themeMode={radios(
              `Theme`,
              { dark: 'dark', light: 'light' },
              'dark'
            )}
          >
            <Industry
              tab={'industry'}
              baseCoin={`USDT`}
              isUSDCurrently={true}
              dustFilter={-100}
            />
          </ThemeWrapper>
        </Suspense>
      </ErrorBoundary>
    </IntlProvider>
  </ApolloProvider>
))
