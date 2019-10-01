import React from 'react'
import { withTheme } from '@material-ui/styles'
import styled, { createGlobalStyle } from 'styled-components'
import { compose } from 'recompose'
import Joyride from 'react-joyride'
import { graphql } from 'react-apollo'

import { IProps, IState } from './PortfolioMainPage.types'

// import PortfolioMainChart from '@core/containers/PortfolioMainChart/PortfolioMainChart'
// import TradeOrderHistory from '@core/containers/TradeOrderHistory/TradeOrderHistory'
import PortfolioMainTable from '@core/containers/PortfolioMainTable/PortfolioMainTable'
import PortfolioMainAllocation from '@core/containers/PortfolioMainAllocation'
import PortfolioOnboarding from './PortfolioOnboarding'

import { portfolioMainSteps } from '@sb/config/joyrideSteps'
import { combineTableData } from '@core/utils/PortfolioTableUtils.ts'
import { getPortfolioAssetsData } from '@core/utils/Overview.utils'

import Template from '@sb/components/Template/Template'
import SharePortfolioDialog from '@sb/components/SharePortfolioDialog/SharePortfolioDialog'
import { withErrorFallback } from '@core/hoc/withErrorFallback'
import { updateTooltipSettings } from '@core/graphql/mutations/user/updateTooltipSettings'
import { sharePortfolio } from '@core/graphql/mutations/portfolio/sharePortfolio'
import { queryRendererHoc } from '@core/components/QueryRenderer'
import { GET_TOOLTIP_SETTINGS } from '@core/graphql/queries/user/getTooltipSettings'
import { removeTypenameFromObject } from '@core/utils/apolloUtils'
import { updateTooltipMutation } from '@core/utils/TooltipUtils'

import { Grid, Divider } from '@material-ui/core'
// import TransactionPage from '@sb/compositions/Transaction/TransactionPage'
import SharePortfolioPanel from '@core/components/SharePortfolioPanel/SharePortfolioPanel'
import AccordionOverview from '@sb/components/AccordionOverview/AccordionOverView'

// Padding based on navbar padding (3rem on sides)
// TODO: Fix this. Find the way to remove sidebar and get rid of these hacks
const LayoutClearfixWrapper = styled.div`
  @media only screen and (min-width: 600px) {
    padding-right: calc(2.5% + 3rem);
  }
`
@withTheme()
class PortfolioMainPage extends React.Component<IProps, IState> {
  state: IState = {
    key: 0,
    openSharePortfolioPopUp: false,
  }

  handleOpenSharePortfolio = () => {
    this.setState({
      openSharePortfolioPopUp: true,
    })
  }

  handleCloseSharePortfolio = () => {
    this.setState({
      openSharePortfolioPopUp: false,
    })
  }

  handleJoyrideCallback = async (data: any) => {
    if (
      data.action === 'close' ||
      data.action === 'skip' ||
      data.status === 'finished'
    ) {
      const {
        updateTooltipSettingsMutation,
        getTooltipSettingsQuery: { getTooltipSettings },
      } = this.props

      await updateTooltipSettingsMutation({
        variables: {
          settings: {
            ...removeTypenameFromObject(getTooltipSettings),
            onboarding: {
              ...removeTypenameFromObject(getTooltipSettings.onboarding),
            },
            portfolioMain: false,
          },
        },
      })
    }

    if (data.status === 'finished') {
      const oldKey = this.state.key
      this.setState({ key: oldKey + 1 })
    }
  }

  render() {
    const {
      theme,
      dustFilter,
      sharePortfolioMutation,
      portfolioId,
      portfolioName,
      portfolioKeys,
      isUSDCurrently,
      portfolioAssets: assets,
      baseCoin,
    } = this.props

    const { openSharePortfolioPopUp } = this.state

    const accountsNames = portfolioKeys
      .filter((key) => key.selected)
      .map((key) => key.name)

    const enabledAssets = assets.myPortfolios[0].portfolioAssets.filter(
      (asset) => accountsNames.includes(asset.name)
    )

    const filteredData = combineTableData(
      enabledAssets || [],
      dustFilter,
      isUSDCurrently
    )

    const { portfolioAssetsData, totalKeyAssetsData } = getPortfolioAssetsData(
      filteredData,
      baseCoin
    )

    return (
      <LayoutClearfixWrapper>
        <Grid style={{ height: '100%' }}>
          <div id="sharePortfolioPanel">
            <SharePortfolioPanel
              handleOpenSharePortfolio={this.handleOpenSharePortfolio}
              portfolioName={portfolioName}
              isUSDCurrently={isUSDCurrently}
            />
            {/* TODO: Recomment if needed <Divider /> */}
            <AccordionOverview
              baseCoin={baseCoin}
              isUSDCurrently={isUSDCurrently}
              portfolioAssetsData={portfolioAssetsData}
              totalKeyAssetsData={totalKeyAssetsData}
            />
          </div>

          <Template
            PortfolioMainTable={
              <PortfolioMainTable
                data={{ myPortfolios: [{ portfolioAssets: enabledAssets }] }}
                theme={theme}
                dustFilter={dustFilter}
                baseCoin={baseCoin}
                isUSDCurrently={isUSDCurrently}
              />
            }
            Chart={
              <PortfolioMainAllocation
                data={filteredData}
                dustFilter={dustFilter}
                isUSDCurrently={isUSDCurrently}
              />
            }
          />
          <Joyride
            continuous={true}
            showProgress={true}
            showSkipButton={true}
            steps={portfolioMainSteps}
            // run={getTooltipSettings.portfolioMain}
            run={false}
            //callback={this.handleJoyrideCallback}
            key={this.state.key}
            styles={{
              options: {
                backgroundColor: theme.palette.getContrastText(
                  theme.palette.primary.main
                ),
                primaryColor: theme.palette.secondary.main,
                textColor: theme.palette.primary.main,
              },
              tooltip: {
                fontFamily: theme.typography.fontFamily,
                fontSize: theme.typography.fontSize,
              },
            }}
          />
          <SharePortfolioDialog
            portfolioKeys={portfolioKeys}
            portfolioId={portfolioId}
            sharePortfolioTitle={portfolioName}
            openSharePortfolioPopUp={openSharePortfolioPopUp}
            sharePortfolioMutation={sharePortfolioMutation}
            handleCloseSharePortfolio={this.handleCloseSharePortfolio}
          />
        </Grid>
        <PortfolioOnboarding portfolioId={portfolioId} baseCoin={baseCoin} />
      </LayoutClearfixWrapper>
    )
  }
}

export default compose(
  queryRendererHoc({
    query: GET_TOOLTIP_SETTINGS,
    name: 'getTooltipSettingsQuery',
  }),
  graphql(updateTooltipSettings, {
    name: 'updateTooltipSettingsMutation',
    options: {
      update: updateTooltipMutation,
    },
  }),
  graphql(sharePortfolio, {
    name: 'sharePortfolioMutation',
  }),
  withErrorFallback
)(PortfolioMainPage)
