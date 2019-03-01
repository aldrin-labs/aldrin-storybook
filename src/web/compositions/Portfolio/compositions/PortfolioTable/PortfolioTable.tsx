import React, { Component, lazy, Suspense, memo } from 'react'
import { Mutation } from 'react-apollo'
import { Route, Switch, withRouter } from 'react-router-dom'
import { withTheme } from '@material-ui/styles'

import { Loading } from '@sb/components/index'
import { TOGGLE_BASE_COIN } from '@core/graphql/mutations/portfolio/toggleBaseCoin'
import { IProps, IState } from './PortfolioTable.types'


import PortfolioMain from '@core/compositions/PortfolioMain'
const PortfolioTableIndustries = React.lazy(() =>
  import(/* webpackPrefetch: true */ '@core/compositions/PortfolioIndustry')
)
import Rebalance from '@core/compositions/PortfolioRebalance'
const Optimization = React.lazy(() =>
  import(/* webpackPrefetch: true */ '@sb/compositions/Optimization/Optimization')
)
const Correlation = React.lazy(() =>
  import(/* webpackPrefetch: true */ '@sb/compositions/Correlation/Correlation')
)
import PortfolioTableTabs from '@sb/components/PortfolioTableTabs/PortfolioTableTabs'


@withRouter
class PortfolioTable extends Component<IProps, IState> {

  render() {
    const {
      theme,
      dustFilter,
      showTable = false,
      isUSDCurrently,
      baseCoin,
    } = this.props

    return (
      <Mutation mutation={TOGGLE_BASE_COIN}>
        {(toggleBaseCoin) => (
          <>
            <PortfolioTableTabs
              theme={theme}
              toggleWallets={this.props.toggleWallets}
              isUSDCurrently={isUSDCurrently}
              onToggleUSDBTC={() => {
                this.props.onToggleUSDBTC()
                toggleBaseCoin()
              }}
            />
            <Suspense fallback={<Loading centerAligned />}>
              <Switch>
                <Route
                  exact
                  path="/portfolio/main"
                  render={(...rest) => (
                    <PortfolioMain
                      isUSDCurrently={isUSDCurrently}
                      theme={theme}
                      variables={{ baseCoin }}
                      baseCoin={baseCoin}
                      dustFilter={dustFilter}
                      {...rest}
                    />
                  )}
                />
                <Route
                  exact
                  path="/portfolio/industries"
                  render={(...rest) => (
                    <PortfolioTableIndustries
                      isUSDCurrently={isUSDCurrently}
                      theme={theme}
                      variables={{ baseCoin: 'USDT' }}
                      baseCoin="USDT"
                      dustFilter={dustFilter}
                      {...rest}
                    />
                  )}
                />
                <Route
                  exact
                  path="/portfolio/rebalance"
                  render={(...rest) => (
                    <Rebalance
                      baseCoin={`USDT`}
                      isUSDCurrently={true}
                      dustFilter={dustFilter}
                      {...rest}
                    />
                  )}
                />
                <Route
                  exact
                  path="/portfolio/correlation"
                  render={(...rest) => (
                    <Correlation
                      baseCoin="USDT"
                      theme={theme}
                      dustFilter={dustFilter}
                      {...rest}
                    />
                  )}
                />
                <Route
                  exact
                  path="/portfolio/optimization"
                  render={(...rest) => (
                    <Optimization
                      theme={theme}
                      isUSDCurrently={isUSDCurrently}
                      baseCoin="USDT"
                      dustFilter={dustFilter}
                      {...rest}
                    />
                  )}
                />
              </Switch>
            </Suspense>
          </>
        )}
      </Mutation>
    )
  }
}

export default withTheme()(PortfolioTable)
