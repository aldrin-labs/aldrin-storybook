import React from 'react'
// import { Query, Mutation, graphql } from 'react-apollo'
import { withTheme } from '@material-ui/styles'
import { Fade } from '@material-ui/core'

import { IProps, IState, Key } from './Portfolio.types'
import SelectExchangeOrWalletWindow from '@sb/components/SelectExchangeOrWalletWindow/SelectExchangeOrWalletWindow'
import AddExchangeOrWalletWindow from '@sb/components/AddExchangeOrWalletWindow/AddExchangeOrWalletWindow'
import { PortfolioTable, PortfolioSelector } from './compositions'

import { Backdrop, PortfolioContainer } from './Portfolio.styles'
import QueryRenderer, { queryRendererHoc } from '@core/components/QueryRenderer'
import { compose } from 'recompose'
// import { updateTooltipMutation } from '@core/utils/TooltipUtils'
import { GET_BASE_COIN } from '@core/graphql/queries/portfolio/getBaseCoin'
// import { GET_TOOLTIP_SETTINGS } from '@core/graphql/queries/user/getTooltipSettings'
// import { updateTooltipSettings } from '@core/graphql/mutations/user/updateTooltipSettings'
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

class PortfolioComponent extends React.Component<IProps, IState> {
  state: IState = {
    isSideNavOpen: false,
    // openPopup: false,
    // click: false,
    //
    // popupStart: true,
    // openCreatePortfolio: false,
    // openAddAccountDialog: false,
  }

  // setOnboarding = async (type) => {
  //   const { getTooltipSettingsQuery, updateTooltipSettings } = this.props

  //   const {
  //     portfolioMain,
  //     portfolioIndustry,
  //     portfolioRebalance,
  //     portfolioCorrelation,
  //     portfolioOptimization,
  //     chartPage,
  //     multiChartPage,
  //     transactionPage,
  //     onboarding: { instructions, portfolioName, exchangeKey, congratulations },
  //   } = getTooltipSettingsQuery.getTooltipSettings

  //   let variables = {
  //     settings: {
  //       portfolioMain: true,
  //       portfolioIndustry: true,
  //       portfolioRebalance: true,
  //       portfolioCorrelation: true,
  //       portfolioOptimization: true,
  //       chartPage: true,
  //       multiChartPage: true,
  //       transactionPage: true,
  //       onboarding: {
  //         instructions: true,
  //         portfolioName: false,
  //         exchangeKey: false,
  //         congratulations: false,
  //       },
  //     },
  //   }

  //   if (type === 'main') {
  //     variables.settings.portfolioMain = false
  //     variables.settings.transactionPage = true
  //   } else if (type === 'instructions') {
  //     variables.settings.onboarding.instructions = false
  //   } else if (type === 'portfolioName') {
  //     variables.settings.onboarding.instructions = false
  //   }
  //   console.log('TYPE portfolioMain', variables.settings.portfolioMain)
  //   console.log('TYPE transactionPage', variables.settings.transactionPage)
  //   console.log('variables', variables)

  //   try {
  //     // const res = await updateTooltipSettings({ variables })
  //     await updateTooltipSettings({
  //       variables: {
  //         settings: {
  //           ...removeTypenameFromObject(
  //             getTooltipSettingsQuery.getTooltipSettings
  //           ),
  //           onboarding: {
  //             ...removeTypenameFromObject(variables.settings.onboarding),
  //           },
  //           transactionPage: false,
  //         },
  //       },
  //       update: updateTooltipMutation,
  //     })
  //   } catch (error) {
  //     console.error(error)
  //   }
  // }

  componentDidMount() {
    const { data } = this.props

    let {
      userSettings: { rebalanceKeys },
    } = safePortfolioDestruction(data.myPortfolios[0])

    rebalanceKeys = Array.isArray(rebalanceKeys) ? rebalanceKeys : []
    const activeKeys = rebalanceKeys.filter((key) => key.selected)

    // this.setOnboarding()

    if (window.location.pathname.includes('rebalance')) {
      this.setState({
        isSideNavOpen: activeKeys.length === 0,
      })
    }
  }

  // handleClickOpen = () => {
  //   this.setState({
  //     openPopup: true,
  //   })
  // }

  // handleClose = () => {
  //   const type = 'main'
  //   this.setOnboarding(type)
  //   this.setState({ click: true, openPopup: false })
  // }

  toggleWallets = () => {
    this.setState({ isSideNavOpen: !this.state.isSideNavOpen })
  }

  // closeStartPopup = () => {
  //   console.log('closed fuf')
  //   this.setState({ popupStart: false })
  // }

  // toggleCreatePortfolio = (value: boolean) => {
  //   this.setState({ openCreatePortfolio: value })
  // }

  // handleClickOpenAccount = () => {
  //   this.setState({ openAddAccountDialog: true })
  // }

  // handleCloseAccount = () => {
  //   this.setState({ openAddAccountDialog: false })
  // }

  render() {
    const {
      theme,
      baseData,
      data,
      // getTooltipSettingsQuery: {
      //   getTooltipSettings: { portfolioMain, onboarding },
      // },
    } = this.props

    // console.log('query', getTooltipSettingsQuery)

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
    // const isMain = window.location.pathname.includes('main')

    const hasKeysOrWallets = isRebalance
      ? rebalanceKeys.length + wallets.length > 0
      : keys.length + wallets.length > 0

    const hasActiveKeysOrWallets = isRebalance
      ? activeRebalanceKeys.length + activeWallets.length > 0
      : activeKeys.length + activeWallets.length > 0

    // console.log('getTooltipSettingsQuery', portfolioMain, onboarding)
    // console.log('this.state.openPopup', this.state.openPopup)
    // console.log('Theme', theme)

    // console.log('suka', this.state.openCreatePortfolio)
    // console.log('start', this.state.popupStart)

    return (
      <>
        {/* {portfolioMain && isMain && (
          <PopupStart
            theme={theme}
            open={
              // onboarding.instructions !== null
              //   ? onboarding.instructions
              //   : portfolioMain
              this.state.popupStart
            }
            handleClickOpen={this.setOnboarding}
            toggleCreatePortfolio={this.toggleCreatePortfolio}
            handleClose={this.setOnboarding}
            closeStartPopup={this.closeStartPopup}
            baseCoin={baseCoin}
            portfolioId={portfolioId}
          />
        )}

        <CreatePortfolio
          open={this.state.openCreatePortfolio}
          handleClickOpen={this.handleClickOpen}
          handleClose={this.handleClose}
          toggleCreatePortfolio={this.toggleCreatePortfolio}
          openAddAccountDialog={this.state.openAddAccountDialog}
          handleClickOpenAccount={this.handleClickOpenAccount}
          handleCloseAccount={this.handleCloseAccount}
          onboarding={true}
          portfolioId={portfolioId}
          baseCoin={baseCoin}
        />

        <AddAccountDialog
          open={this.state.openAddAccountDialog}
          handleClickOpen={this.handleClickOpenAccount}
          handleClose={this.handleCloseAccount}
          onboarding={true}
          baseCoin={baseCoin}
        />

        <Congratulations
          open={this.state.openCongratulations}
          handleClickOpen={this.handleClickOpenCongratulations}
          handleClose={this.handleCloseCongratulations}
          loading={this.state.loading}
        /> */}

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

        {/* <JoyrideOnboarding steps={portfolioMainSteps} open={portfolioMain} /> */}
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
  // queryRendererHoc({
  //   query: GET_TOOLTIP_SETTINGS,
  //   name: 'getTooltipSettingsQuery',
  //   fetchPolicy: 'network-only',
  //   refetchQueries: [
  //     {
  //       query: GET_TOOLTIP_SETTINGS,
  //     },
  //   ],
  // }),
  // graphql(updateTooltipSettings, {
  //   name: 'updateTooltipSettings',
  //   options: {
  //     update: updateTooltipMutation,
  //   },
  // }),
  queryRendererHoc({
    query: GET_BASE_COIN,
    name: 'baseData',
  })
)(APIWrapper)
