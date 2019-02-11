import React, { Suspense, lazy } from 'react'
import { ApolloProvider } from 'react-apollo'
import { IntlProvider } from 'react-intl'
import { Provider } from 'react-redux'
import { ConnectedRouter } from 'react-router-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { ErrorBoundary, Loading } from '@sb/components'
import { storiesOf } from '@storybook/react'
import { radios } from '@storybook/addon-knobs'

import Main from '@core/compositions/PortfolioMain'
import { App } from '@sb/compositions/App/App'
import ThemeWrapper from '@sb/compositions/App/ThemeWrapper/ThemeWrapper'

import { client } from '@core/graphql/apolloClient'
import { persistor, store } from '@sb/mocks/configureStore'
import createHistory from 'history/createBrowserHistory'

const history = createHistory()

storiesOf('Compositions/Main', module).add('Main', () => (
    <ApolloProvider client={client}>
        <IntlProvider locale="en">
            <Provider store={store}>
                <PersistGate loading={null} persistor={persistor}>
                    <ErrorBoundary>
                        <Suspense fallback={<Loading centerAligned />}>
                            <ThemeWrapper
                                themeMode={radios(
                                    `Theme`,
                                    { dark: 'dark', light: 'light' },
                                    'dark'
                                )}
                            >
                                <Main
                                    tab={'main'}
                                    baseCoin={`USDT`}
                                    isUSDCurrently={true}
                                    dustFilter={-100}
                                />
                            </ThemeWrapper>
                        </Suspense>
                    </ErrorBoundary>
                </PersistGate>
            </Provider>
        </IntlProvider>
    </ApolloProvider>
))
