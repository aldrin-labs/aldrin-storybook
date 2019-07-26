import React from 'react'
import { withTheme } from '@material-ui/styles'
import { compose } from 'recompose'
import Joyride from 'react-joyride'
import { graphql } from 'react-apollo'

import { IProps, IState } from './PortfolioMainPage.types'

import PortfolioMainChart from '@core/containers/PortfolioMainChart/PortfolioMainChart'
import TradeOrderHistory from '@core/containers/TradeOrderHistory/TradeOrderHistory'
import PortfolioMainTable from '@core/containers/PortfolioMainTable/PortfolioMainTable'

import { portfolioMainSteps } from '@sb/config/joyrideSteps'
import Template from '@sb/components/Template/Template'
import SharePortfolioDialog from '@sb/components/SharePortfolioDialog/SharePortfolioDialog'
import { withErrorFallback } from '@core/hoc/withErrorFallback'
import { updateTooltipSettings } from '@core/graphql/mutations/user/updateTooltipSettings'
import { sharePortfolio } from '@core/graphql/mutations/portfolio/sharePortfolio'
import { queryRendererHoc } from '@core/components/QueryRenderer'
import { GET_TOOLTIP_SETTINGS } from '@core/graphql/queries/user/getTooltipSettings'
import { removeTypenameFromObject } from '@core/utils/apolloUtils'
import { updateTooltipMutation } from '@core/utils/TooltipUtils'

//TODO NEW
import { Grid } from '@material-ui/core'
import TransactionPage from '@sb/compositions/Transaction/TransactionPage'

@withTheme()
class PortfolioMainPage extends React.Component<IProps, IState> {
  state: IState = {
    key: 0,
    openSharePortfolioPopUp: true,
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
      getTooltipSettingsQuery: { getTooltipSettings },
      sharePortfolioMutation,
      portfolioId,
      portfolioName,
      portfolioKeys,
    } = this.props

    const { openSharePortfolioPopUp } = this.state

    return (
      <Grid>
        {/* <Template
          PortfolioMainTable={
            <PortfolioMainTable theme={theme} dustFilter={dustFilter} />
          }
          PortfolioActions={<TradeOrderHistory />}
          Chart={
            <PortfolioMainChart
              title="Portfolio Value | Coming Soon | In development"
              style={{
                marginLeft: 0,
              }}
              marginTopHr="10px"
            />
          }
        />

        <SharePortfolioDialog
          portfolioKeys={portfolioKeys}
          portfolioId={portfolioId}
          sharePortfolioTitle={`SHARE ${portfolioName}`}
          openSharePortfolioPopUp={openSharePortfolioPopUp}
          sharePortfolioMutation={sharePortfolioMutation}
          handleCloseSharePortfolio={this.handleCloseSharePortfolio}
        />

        <Joyride
          continuous={true}
          showProgress={true}
          showSkipButton={true}
          steps={portfolioMainSteps}
          run={getTooltipSettings.portfolioMain}
          callback={this.handleJoyrideCallback}
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
        /> */}
        
        <TransactionPage
          Chart={
            <PortfolioMainChart
              title="Portfolio Value | Coming Soon | In development"
              style={{
                marginLeft: 0,
              }}
              marginTopHr="10px"
            />
          }
          PortfolioActions={<TradeOrderHistory />}
        />
      </Grid>
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
