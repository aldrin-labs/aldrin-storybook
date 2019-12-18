import React, { Component, lazy, Suspense, memo } from 'react'
import { Route, Switch, withRouter } from 'react-router-dom'
import { withTheme } from '@material-ui/styles'

import { Loading } from '@sb/components/index'
import { IProps, IState } from './PortfolioTable.types'

import PortfolioTableTabs from '@sb/components/PortfolioTableTabs/PortfolioTableTabs'

const PortfolioMain = React.lazy(() =>
  import(/* webpackPrefetch: true, webpackChunkName: "main" */ '@core/compositions/PortfolioMain')
)
const PortfolioTableIndustries = React.lazy(() =>
  import(/* webpackChunkName: "industry" */ '@core/compositions/PortfolioIndustry')
)
const Rebalance = React.lazy(() =>
  import(/* webpackPrefetch: true, webpackChunkName: "rebalance" */ '@core/compositions/PortfolioRebalance')
)
const Optimization = React.lazy(() =>
  import(/* webpackChunkName: "optimization" */ '@sb/compositions/Optimization/Optimization')
)
const Correlation = React.lazy(() =>
  import(/* webpackChunkName: "correlation" */ '@sb/compositions/Correlation/Correlation')
)

const Social = React.lazy(() =>
  import(/* webpackChunkName: "social" */ '@core/containers/Social/Social')
)

const Transaction = React.lazy(() =>
  import(/* webpackPrefetch: true, webpackChunkName: "transaction" */ '@sb/compositions/Transaction/TransactionPage')
)

@withRouter
class PortfolioTable extends Component<IProps, IState> {
  render() {
    const {
      theme,
      dustFilter,
      isUSDCurrently,
      baseCoin,
      portfolioId,
      portfolioName,
      activeKeys,
      keys,
      isSideNavOpen,
    } = this.props

    return (
      <>
        <PortfolioTableTabs
          theme={theme}
          toggleWallets={this.props.toggleWallets}
          isUSDCurrently={isUSDCurrently}
        />
        <Suspense fallback={<Loading centerAligned />}>
          <Switch>
            <Route
              exact
              path="/portfolio/main"
              render={(...rest) => (
                <PortfolioMain
                  portfolioKeys={keys}
                  portfolioId={portfolioId}
                  portfolioName={portfolioName}
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
              path="/portfolio/industry"
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
                  portfolioId={portfolioId}
                  activeKeys={activeKeys}
                  isSideNavOpen={isSideNavOpen}
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
            <Route
              exact
              path="/portfolio/social"
              render={(...rest) => <Social dustFilter={dustFilter} {...rest} />}
            />
            <Route
              exact
              path="/portfolio/transactions"
              render={(...rest) => (
                <Transaction
                  {...rest}
                  {...this.props}
                  isCustomStyleForFooter={true}
                />
              )}
            />
          </Switch>
        </Suspense>
      </>
    )
  }
}

export default PortfolioTable
