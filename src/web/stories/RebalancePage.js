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

import PortfolioChart from '@components/PortfolioChart'
import { PortfolioTable } from '../compositions/Portfolio/compositions/PortfolioTable'
import { App } from '../compositions/App/App'
import ThemeWrapper from '../compositions/App/ThemeWrapper/ThemeWrapper'

import { client } from '@core/graphql/apolloClient'
import { persistor, store } from '../../../../utils/configureStore'
import createHistory from 'history/createBrowserHistory'

const history = createHistory()



storiesOf('Rebalance', module).add('Rebalance', () => (
  <ApolloProvider client={client}>
    <IntlProvider locale="en">
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <ConnectedRouter history={history}>
              <ErrorBoundary>
                <Suspense fallback={<Loading centerAligned />}>
                  <Switch>
                    <Route>
                      <ThemeWrapper>
                        <PortfolioTable
                          tab={'rebalance'}
                          baseCoin={`USDT`}
                          showTable={true}
                          isUSDCurrently={true}
                          filterValueSmallerThenPercentage={-100}
                        />
                      </ThemeWrapper>
                    </Route>
                  </Switch>
                </Suspense>
              </ErrorBoundary>
          </ConnectedRouter>
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
