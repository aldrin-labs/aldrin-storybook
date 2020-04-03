import React from 'react'
import { withTheme } from '@material-ui/styles'
import { Fade } from '@material-ui/core'

import { IProps, IState, Key } from './Portfolio.types'
import PortfolioOnboarding from '@sb/compositions/Main/PortfolioOnboarding'
import PopupStart from '@sb/components/Onboarding/PopupStart/PopupStart'
import SelectExchangeOrWalletWindow from '@sb/components/SelectExchangeOrWalletWindow/SelectExchangeOrWalletWindow'
import AddExchangeOrWalletWindow from '@sb/components/AddExchangeOrWalletWindow/AddExchangeOrWalletWindow'
import { PortfolioTable, PortfolioSelector } from './compositions'

import { portfolioMainSteps } from '@sb/config/joyrideSteps'
import JoyrideOnboarding from '@sb/components/JoyrideOnboarding/JoyrideOnboarding'

import { Backdrop, PortfolioContainer } from './Portfolio.styles'
import QueryRenderer, { queryRendererHoc } from '@core/components/QueryRenderer'
import { compose } from 'recompose'
import { GET_BASE_COIN } from '@core/graphql/queries/portfolio/getBaseCoin'
import { getDustFilter } from '@core/graphql/queries/portfolio/getDustFilter'
import { GET_TOOLTIP_SETTINGS } from '@core/graphql/queries/user/getTooltipSettings'
import { portfolioKeyAndWalletsQuery } from '@core/graphql/queries/portfolio/portfolioKeyAndWalletsQuery'
// import { removeTypenameFromObject } from '@core/utils/apolloUtils'
// import { getCoinsForOptimization } from '@core/graphql/queries/portfolio/optimization/getCoinsForOptimization'
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
): {
  _id: string
  name: string
  userSettings: {
    portfolioId: string
    dustFilter: {
      usd: number
      btc: number
      percentage: number | string
    }
    keys: Key[]
    rebalanceKeys: Key[]
    wallets: Key[]
  }
} => portfolio

export const getOnboardingStatus = ({
  keys,
  myPortfolios,
  onboarding,
}: {
  keys: Key[]
  myPortfolios: any[]
  onboarding: {
    instructions: boolean
  } | null
}) => {
  const { instructions } = onboarding || { instructions: false }

  if (keys.length > 0 || myPortfolios.length > 1) {
    return false
  }

  // I've commented it here because we are not using onboarding.
  // If we would use it, just oncomment the line above.
  // return instructions
  return true
}

class PortfolioComponent extends React.Component<IProps, IState> {
  state: IState = {
    isSideNavOpen: false,
    creatingAdditionalAccount: false,
  }

  componentDidMount() {
    const { data } = this.props

    let {
      userSettings: { rebalanceKeys },
    } = safePortfolioDestruction(data.myPortfolios[0])

    rebalanceKeys = Array.isArray(rebalanceKeys) ? rebalanceKeys : []
    const activeKeys = rebalanceKeys.filter((key) => key.selected)

    if (window.location.pathname.includes('rebalance')) {
      this.setState({
        isSideNavOpen: activeKeys.length === 0,
      })
    }
  }

  toggleWallets = () => {
    this.setState({ isSideNavOpen: !this.state.isSideNavOpen })
  }

  setCreatingAdditionalAccountStatus = (status: boolean) => {
    this.setState({ creatingAdditionalAccount: status })
  }

  render() {
    const {
      theme,
      baseData,
      data,
      dustFilterQuery: {
        portfolio: { dustFilter },
      },
      getTooltipSettingsQuery,
    } = this.props

    const baseCoin = baseData.portfolio.baseCoin
    const isUSDCurrently = baseCoin === 'USDT'

    const {
      userSettings: { portfolioId },
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

    // Onboarding
    const {
      getTooltipSettings: { onboarding },
    } = getTooltipSettingsQuery

    const isOnboardingEnabled = getOnboardingStatus({
      keys,
      myPortfolios: data.myPortfolios,
      onboarding,
    })

    return (
      <>
        <PortfolioContainer>
          {hasKeysOrWallets && (
            <PortfolioSelector
              portfolioId={portfolioId}
              dustFilter={dustFilter}
              addAditionalAccount={() => {
                this.setCreatingAdditionalAccountStatus(true)
              }}
              keys={isRebalance ? rebalanceKeys : keys}
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
          )}

          {/* {!hasKeysOrWallets && (
            <>
              <AddExchangeOrWalletWindow
                theme={theme}
                toggleWallets={this.toggleWallets}
              />
            </>
          )} */}

          <Fade
            timeout={{
              enter: 0,
              exit: 3500,
            }}
            in={isOnboardingEnabled}
            mountOnEnter={true}
            unmountOnExit={true}
          >
            <PortfolioOnboarding
              getTooltipSettingsQuery={getTooltipSettingsQuery}
              portfoliosNumber={data.myPortfolios.length}
              portfolioKeys={keys}
              numberOfKeys={keys.length}
              portfolioId={portfolioId}
              baseCoin={baseCoin}
            />
          </Fade>

          {this.state.creatingAdditionalAccount && (
            <PopupStart
              open={true}
              creatingAdditionalAccount={true}
              completeOnboarding={() => {
                this.setCreatingAdditionalAccountStatus(false)
              }}
            />
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

        {/* <JoyrideOnboarding steps={portfolioMainSteps} open={portfolioMain} /> */}
      </>
    )
  }
}

// const APIWrapper = (props: any) => {
//   return (
//     <QueryRenderer
//       {...props}
//       component={PortfolioComponent}
//       query={portfolioKeyAndWalletsQuery}
//       name={'data'}
//       variables={{ baseCoin: props.baseData.portfolio.baseCoin }}
//       withOutSpinner={true}
//       fetchPolicy="cache-and-network"
//     />
//   )
// }

export default compose(
  withAuth,
  withTheme(),
  queryRendererHoc({
    query: GET_BASE_COIN,
    name: 'baseData',
  }),
  queryRendererHoc({
    query: portfolioKeyAndWalletsQuery,
    name: 'data',
    withOutSpinner: true,
    fetchPolicy: 'cache-and-network',
    variables: (props) => ({
      baseCoin: props.baseData.portfolio.baseCoin,
    }),
  }),
  queryRendererHoc({
    query: getDustFilter,
    name: 'dustFilterQuery',
  }),
  queryRendererHoc({
    query: GET_TOOLTIP_SETTINGS,
    name: 'getTooltipSettingsQuery',
    fetchPolicy: 'cache-and-network',
    withOutSpinner: true,
  })
)(PortfolioComponent)
