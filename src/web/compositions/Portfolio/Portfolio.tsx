import React from 'react'
import { Query, Mutation } from 'react-apollo'
import { has } from 'lodash-es'
import { withTheme } from '@material-ui/styles'
import { Fade, LinearProgress } from '@material-ui/core'

import { IProps, IState } from './Portfolio.types'
import SelectExchangeOrWalletWindow from '@sb/components/SelectExchangeOrWalletWindow/SelectExchangeOrWalletWindow'
import AddExchangeOrWalletWindow from '@sb/components/AddExchangeOrWalletWindow/AddExchangeOrWalletWindow'
import { PortfolioTable, PortfolioSelector } from './compositions'

import { CustomError } from '@sb/components/'
import { Backdrop, PortfolioContainer } from './Portfolio.styles'
import QueryRenderer, { queryRendererHoc } from '@core/components/QueryRenderer'
import { compose } from 'recompose'

import { GET_BASE_COIN } from '@core/graphql/queries/portfolio/getBaseCoin'
import { updateSettingsMutation } from '@core/utils/PortfolioSelectorUtils'
import { updatePortfolioSettingsMutation } from '@core/graphql/mutations/portfolio/updatePortfolioSettingsMutation'
// import { getPortfolioQuery } from '@core/graphql/queries/portfolio/getPortfolio'
// import { getMyPortfolioAndRebalanceQuery } from '@core/graphql/queries/portfolio/rebalance/getMyPortfolioAndRebalanceQuery'
import { portfolioKeyAndWalletsQuery } from '@core/graphql/queries/portfolio/portfolioKeyAndWalletsQuery'
import { getCoinsForOptimization } from '@core/graphql/queries/portfolio/optimization/getCoinsForOptimization'
import withAuth from '@core/hoc/withAuth'

const safePortfolioDestruction = (
  portfolio = {
    _id: '',
    name: '',
    userSettings: {
      portfolioId: '',
      dustFilter: {
        usd: 0,
        btc: 0,
        percentage: 0,
      },
      keys: [],
      rebalanceKeys: [],
      wallets: [],
    },
  }
) => portfolio

class PortfolioComponent extends React.Component<IProps, IState> {
  state: IState = {
    isSideNavOpen: false,
  }

  componentDidMount() {
    const { portfolioKeyAndWalletsQuery: data } = this.props

    let {
      userSettings: { rebalanceKeys },
    } = safePortfolioDestruction(data.myPortfolios[0])

    rebalanceKeys = Array.isArray(rebalanceKeys) ? rebalanceKeys : []

    if (window.location.pathname.includes('rebalance')) {
      this.setState({
        isSideNavOpen: rebalanceKeys.length > 1,
      })
    }
  }

  toggleWallets = () => {
    this.setState({ isSideNavOpen: !this.state.isSideNavOpen })
  }

  render() {
    const {
      theme,
      baseCoin,
      isUSDCurrently,
      portfolioKeyAndWalletsQuery: data,
    } = this.props

    const {
      userSettings: { portfolioId, dustFilter },
      name: portfolioName,
    } = safePortfolioDestruction(data.myPortfolios[0])

    // TODO: hotfix, should be fixed on backend
    let {
      userSettings: { keys, rebalanceKeys, wallets },
    } = safePortfolioDestruction(data.myPortfolios[0])

    keys = Array.isArray(keys) ? keys : []
    rebalanceKeys = Array.isArray(rebalanceKeys) ? rebalanceKeys : []
    wallets = Array.isArray(wallets) ? wallets : []
    // TODO: hotfix, should be fixed on backend

    const activeKeys = keys.filter((el) => el.selected)
    const activeRebalanceKeys = rebalanceKeys.filter((el) => el.selected)
    const activeWallets = wallets.filter((el) => el.selected)

    const isRebalance = window.location.pathname.includes('rebalance')

    const hasKeysOrWallets = isRebalance
      ? rebalanceKeys.length + wallets.length > 0
      : keys.length + wallets.length > 0

    const hasActiveKeysOrWallets = isRebalance
      ? activeRebalanceKeys.length + activeWallets.length > 0
      : activeKeys.length + activeWallets.length > 0

    return (
      <>
        <PortfolioContainer>
          <PortfolioSelector
            login={true}
            portfolioId={portfolioId}
            dustFilter={dustFilter}
            newKeys={isRebalance ? rebalanceKeys : keys}
            newWallets={wallets}
            activeKeys={isRebalance ? activeRebalanceKeys : activeKeys}
            activeWallets={activeWallets}
            toggleWallets={this.toggleWallets}
            isSideNavOpen={this.state.isSideNavOpen}
            isRebalance={isRebalance}
            isUSDCurrently={isUSDCurrently}
            data={data}
            baseCoin={baseCoin}
          />

          {!hasKeysOrWallets && (
            <>
              <AddExchangeOrWalletWindow
                theme={theme}
                toggleWallets={this.toggleWallets}
              />
            </>
          )}

          {hasKeysOrWallets && !hasActiveKeysOrWallets && (
            <SelectExchangeOrWalletWindow
              theme={theme}
              toggleWallets={this.toggleWallets}
            />
          )}

          {hasKeysOrWallets && hasActiveKeysOrWallets && (
            <PortfolioTable
              keys={isRebalance ? rebalanceKeys : keys}
              key={
                isRebalance
                  ? activeRebalanceKeys.length + activeWallets.length
                  : activeKeys.length + activeWallets.length
              }
              showTable={hasActiveKeysOrWallets}
              dustFilter={dustFilter}
              activeKeys={isRebalance ? activeRebalanceKeys : activeKeys}
              portfolioId={portfolioId}
              portfolioName={portfolioName}
              theme={theme}
              baseCoin={baseCoin}
              isUSDCurrently={isUSDCurrently}
              isSideNavOpen={this.state.isSideNavOpen}
              toggleWallets={this.toggleWallets}
              newKeys={isRebalance ? rebalanceKeys : keys}
              isRebalance={isRebalance}
              data={data}
            />
          )}

          <Fade
            in={this.state.isSideNavOpen}
            mountOnEnter={true}
            unmountOnExit={true}
          >
            <Backdrop onClick={this.toggleWallets} />
          </Fade>
        </PortfolioContainer>
      </>
    )
  }
}

const APIWrapper = (props) => {
  return (
    <Query query={GET_BASE_COIN}>
      {({ data }) => {
        const baseCoin =
          (data && data.portfolio && data.portfolio.baseCoin) || 'USDT'
        return (
          <QueryRenderer
            {...props}
            component={PortfolioComponent}
            query={portfolioKeyAndWalletsQuery}
            name={'portfolioKeyAndWalletsQuery'}
            variables={{ baseCoin }}
            baseCoin={baseCoin}
            isUSDCurrently={baseCoin === 'USDT'}
            // pollInterval={1 * 30 * 1000}
            withOutSpinner={false}
          />
        )
      }}
    </Query>
  )
}

export default compose(
  withAuth,
  withTheme()
)(APIWrapper)
