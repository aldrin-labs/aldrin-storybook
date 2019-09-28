import React from 'react'
import { withTheme } from '@material-ui/styles'
import { Query, Mutation, graphql } from 'react-apollo'
import { withRouter } from 'react-router-dom'
import { Fade } from '@material-ui/core'

import { IProps, IState, Key } from './Portfolio.types'
import SelectExchangeOrWalletWindow from '@sb/components/SelectExchangeOrWalletWindow/SelectExchangeOrWalletWindow'
import AddExchangeOrWalletWindow from '@sb/components/AddExchangeOrWalletWindow/AddExchangeOrWalletWindow'
import { PortfolioTable, PortfolioSelector } from './compositions'

import { Backdrop, PortfolioContainer } from './Portfolio.styles'
import QueryRenderer, { queryRendererHoc } from '@core/components/QueryRenderer'
import { compose } from 'recompose'
import { GET_BASE_COIN } from '@core/graphql/queries/portfolio/getBaseCoin'
import { GET_TOOLTIP_SETTINGS } from '@core/graphql/queries/user/getTooltipSettings'
import { updateTooltipSettings } from '@core/graphql/mutations/user/updateTooltipSettings'
import { portfolioKeyAndWalletsQuery } from '@core/graphql/queries/portfolio/portfolioKeyAndWalletsQuery'
// import { getCoinsForOptimization } from '@core/graphql/queries/portfolio/optimization/getCoinsForOptimization'
import PopupStart from '@sb/components/Onboarding/PopupStart/PopupStart'
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

class PortfolioComponent extends React.Component<IProps, IState> {
  state: IState = {
    isSideNavOpen: false,
    openPopup: true,
  }

  setOnboarding = async (activeKeys, type) => {
    console.log('activeKeys', activeKeys)

    const { getTooltipSettings, updateTooltipSettings } = this.props
    const {
      portfolioMain,
      portfolioIndustry,
      portfolioRebalance,
      portfolioCorrelation,
      portfolioOptimization,
      chartPage,
      multiChartPage,
    } = getTooltipSettings.getTooltipSettings

    let variables = {
      settings: {
        portfolioMain,
        portfolioIndustry,
        portfolioRebalance,
        portfolioCorrelation,
        portfolioOptimization,
        chartPage,
        multiChartPage,
      },
    }

    if(type !== undefined && type === 'Main') {
      console.log('TYPE MAIN')
      variables.settings.portfolioMain = false
    }

    try {
      const res = await updateTooltipSettings({ variables })

      console.log('updateTooltipSettings res - ', res)
    } catch (error) {
      console.error(error)
    }
  }

  componentDidMount() {
    const { data } = this.props

    let {
      userSettings: { rebalanceKeys },
    } = safePortfolioDestruction(data.myPortfolios[0])

    rebalanceKeys = Array.isArray(rebalanceKeys) ? rebalanceKeys : []
    const activeKeys = rebalanceKeys.filter((key) => key.selected)

    this.setOnboarding(rebalanceKeys)

    if (window.location.pathname.includes('rebalance')) {
      this.setState({
        isSideNavOpen: activeKeys.length === 0,
      })
    }
  }

  handleClickOpen = () => {
    this.setState({
      openPopup: true,
    })
  }

  handleClose = () => {
    this.setState({ openPopup: false })
  }

  toggleWallets = () => {
    this.setState({ isSideNavOpen: !this.state.isSideNavOpen })
  }

  render() {
    const { theme, baseData, data, getTooltipSettings } = this.props

    const baseCoin = baseData.portfolio.baseCoin
    const isUSDCurrently = baseCoin === 'USDT'

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

    console.log('PROPS - ', getTooltipSettings.getTooltipSettings)

    return (
      <>
        {
          getTooltipSettings.getTooltipSettings.portfolioMain !== undefined && getTooltipSettings.getTooltipSettings.portfolioMain
            ?
              <PopupStart
                open={this.state.openPopup}
                handleClickOpen={this.handleClickOpen}
                handleClose={this.handleClose}
                setOnboarding={this.setOnboarding}
                activeKeys={activeKeys}
                baseCoin={baseCoin}
                portfolioId={portfolioId}
              />
            :
              ''
        }

        <PortfolioContainer>
          <PortfolioSelector
            login={true}
            portfolioId={portfolioId}
            dustFilter={dustFilter}
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

const APIWrapper = (props: any) => {
  return (
    <QueryRenderer
      {...props}
      component={PortfolioComponent}
      query={portfolioKeyAndWalletsQuery}
      name={'data'}
      variables={{ baseCoin: props.baseData.portfolio.baseCoin }}
      withOutSpinner={false}
      // fetchPolicy="network-only"
    />
  )
}

export default compose(
  withAuth,
  withTheme(),
  graphql(GET_TOOLTIP_SETTINGS, {
    name: 'getTooltipSettings',
    options: { fetchPolicy: 'network-only' },
  }),
  graphql(updateTooltipSettings, { name: 'updateTooltipSettings' }),
  queryRendererHoc({
    query: GET_BASE_COIN,
    name: 'baseData',
  })
)(APIWrapper)
