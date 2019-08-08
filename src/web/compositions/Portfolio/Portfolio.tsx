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

import { updateSettingsMutation } from '@core/utils/PortfolioSelectorUtils'
import { updatePortfolioSettingsMutation } from '@core/graphql/mutations/portfolio/updatePortfolioSettingsMutation'
import { getPortfolioQuery } from '@core/graphql/queries/portfolio/getPortfolio'
import { getMyPortfolioAndRebalanceQuery } from '@core/graphql/queries/portfolio/rebalance/getMyPortfolioAndRebalanceQuery'
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
        percentage: 0,
      },
      keys: [],
      wallets: [],
    },
  }
) => portfolio

class PortfolioComponent extends React.Component<IProps, IState> {
  state: IState = {
    isSideNavOpen: false,
    baseCoin: 'USDT',
    isUSDCurrently: true,
  }

  toggleWallets = () => {
    this.setState({ isSideNavOpen: !this.state.isSideNavOpen })
  }

  onToggleUSDBTC = () => {
    this.setState((prevState) => ({
      isUSDCurrently: !prevState.isUSDCurrently,
      baseCoin: !prevState.isUSDCurrently ? 'USDT' : 'BTC',
    }))
  }

  render() {
    const { theme } = this.props
    const { isUSDCurrently, baseCoin } = this.state

    return (
      <Query
        notifyOnNetworkStatusChange
        fetchPolicy="cache-and-network"
        query={portfolioKeyAndWalletsQuery}
      >
        {({
          data = { myPortfolios: [{ userSettings: {} }] },
          loading,
          refetch,
          networkStatus,
        }) => {
          if (networkStatus === 4 || loading) {
            return (
              <LinearProgress
                style={{
                  position: 'fixed',
                  top: 0,
                  width: '100vw',
                  zIndex: 1009,
                }}
                color="secondary"
              />
            )
          }

          if (!has(data, 'myPortfolios') && !loading) {
            return (
              <CustomError>
                No myPortfolios was provided, check Portoflio.tsx render
              </CustomError>
            )
          }

          const {
            userSettings: { portfolioId, dustFilter },
            name: portfolioName,
          } = safePortfolioDestruction(data.myPortfolios[0])

          // TODO: hotfix, should be fixed on backend
          let {
            userSettings: { keys, wallets },
          } = safePortfolioDestruction(data.myPortfolios[0])

          keys = Array.isArray(keys) ? keys : []
          wallets = Array.isArray(wallets) ? wallets : []
          // TODO: hotfix, should be fixed on backend

          const activeKeys = keys.filter((el) => el.selected)
          const activeWallets = wallets.filter((el) => el.selected)

          const hasKeysOrWallets = keys.length + wallets.length > 0
          const hasActiveKeysOrWallets =
            activeKeys.length + activeWallets.length > 0

          return (
            <Mutation
              onCompleted={() => refetch()}
              mutation={updatePortfolioSettingsMutation}
              update={updateSettingsMutation}
              refetchQueries={[
                // no need to refetch main
                { query: getPortfolioQuery, variables: { baseCoin } },
                { query: getCoinsForOptimization, variables: { baseCoin } },
                {
                  query: getMyPortfolioAndRebalanceQuery,
                  variables: { baseCoin },
                },
                {
                  query: getMyPortfolioAndRebalanceQuery,
                  variables: { baseCoin },
                },
              ]}
            >
              {(updatePortfolioSettings) => (
                <>
                  <PortfolioContainer>
                    {/* refactor this */}
                    <PortfolioSelector
                      login={true}
                      updatePortfolioSettings={updatePortfolioSettings}
                      portfolioId={portfolioId}
                      dustFilter={dustFilter}
                      newKeys={keys}
                      newWallets={wallets}
                      activeKeys={activeKeys}
                      activeWallets={activeWallets}
                      toggleWallets={this.toggleWallets}
                      isSideNavOpen={this.state.isSideNavOpen}
                    />

                    {!hasKeysOrWallets && (
                      <AddExchangeOrWalletWindow theme={theme} />
                    )}

                    {hasKeysOrWallets && !hasActiveKeysOrWallets && (
                      <SelectExchangeOrWalletWindow
                        theme={theme}
                        toggleWallets={this.toggleWallets}
                      />
                    )}

                    {hasKeysOrWallets && hasActiveKeysOrWallets && (
                      <PortfolioTable
                        keys={keys}
                        key={activeKeys.length + activeWallets.length}
                        showTable={hasActiveKeysOrWallets}
                        dustFilter={dustFilter}
                        activeKeys={activeKeys}
                        portfolioId={portfolioId}
                        portfolioName={portfolioName}
                        theme={theme}
                        baseCoin={baseCoin}
                        onToggleUSDBTC={this.onToggleUSDBTC}
                        isUSDCurrently={isUSDCurrently}
                        toggleWallets={this.toggleWallets}
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
              )}
            </Mutation>
          )
        }}
      </Query>
    )
  }

  componentDidMount() {
    if (window.location.pathname.includes('rebalance')) {
      this.setState({
        isSideNavOpen: true
      })
    }
  }
}

export default withAuth(withTheme()(PortfolioComponent))
