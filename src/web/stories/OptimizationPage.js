import React, { Suspense, lazy } from 'react'
import { ApolloProvider } from 'react-apollo'
import { IntlProvider } from 'react-intl'
import { Provider } from 'react-redux'
import { ConnectedRouter } from 'react-router-redux'
import { Route, Switch } from 'react-router-dom'
import { PersistGate } from 'redux-persist/integration/react'
import { ErrorBoundary, Loading } from '@sb/components'

import { storiesOf } from '@storybook/react'

import { action } from '@storybook/addon-actions'
import { withInfo } from '@storybook/addon-info'
import { object } from '@storybook/addon-knobs'

import PortfolioTable from '../compositions/Portfolio/compositions/PortfolioTable/PortfolioTable'
import Optimization from '../compositions/Optimization/Optimization'

import { App } from '../compositions/App/App'
import ThemeWrapper from '../compositions/App/ThemeWrapper/ThemeWrapper'

import { client } from '@core/graphql/apolloClient'
import { persistor, store } from '../mocks/configureStore'
import createHistory from 'history/createBrowserHistory'

const history = createHistory()



storiesOf('Optimization', module).add('Optimization', () => (
  <ApolloProvider client={client}>
    <IntlProvider locale="en">
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
              <ErrorBoundary>
                <Suspense fallback={<Loading centerAligned />}>
                      <ThemeWrapper themeMode={`dark`}>
                        <Optimization
                          tab={'optimization'}
                          baseCoin={`USDT`}
                          isUSDCurrently={true}
                          filterValueSmallerThenPercentage={-100}
                        />
                      </ThemeWrapper>
                </Suspense>
              </ErrorBoundary>
        </PersistGate>
      </Provider>
    </IntlProvider>
  </ApolloProvider>
))

// <Route>
// <App>
// <PortfolioTable
// tab={'rebalance'}
// baseCoin={`USDT`}
// isUSDCurrently={true}
// filterValueSmallerThenPercentage={-100}
// />
// </App>
// </Route>

// <ThemeWrapper>
// <PortfolioTable
// tab={'rebalance'}
// baseCoin={`USDT`}
// showTable={true}
// isUSDCurrently={true}
// filterValueSmallerThenPercentage={-100}
// />
// </ThemeWrapper>
