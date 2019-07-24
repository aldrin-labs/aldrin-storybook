import React from 'react'
import { withTheme } from '@material-ui/styles'
import { compose } from 'recompose'
import Joyride from 'react-joyride'

import { IProps, IState } from './PortfolioMainPage.types'

import PortfolioMainChart from '@core/containers/PortfolioMainChart/PortfolioMainChart'
import TradeOrderHistory from '@core/containers/TradeOrderHistory/TradeOrderHistory'
import PortfolioMainTable from '@core/containers/PortfolioMainTable/PortfolioMainTable'

import { portfolioMainSteps } from '@sb/config/joyrideSteps'
import { withErrorFallback } from '@core/hoc/withErrorFallback'
import Template from '@sb/components/Template/Template'
import { updateTooltipSettings } from '@core/graphql/mutations/user/updateTooltipSettings'
import { graphql } from 'react-apollo'
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
    } = this.props

    return (
      <Grid>
        {/* <Grid
        style={{
          // width: '100%',
          // height: '100%',
          // overflowY: 'auto',
          // overflowX: 'hidden',
          // transform: 'rotate(-90deg)',
          // transformOrigin: 'right top',
          display: 'flex',
          justifyContent: 'center'
        }}
      >
        <Grid
          style={{
            width: '1400px',
            height: '1000px',
            border: '1px solid red',
            // transform: 'rotate(90deg) translateY(-100px)',
            transformOrigin: 'right top',
            background: 'blue'
          }}
        >
          5555
        </Grid>
        <Grid
          style={{
            width: '1400px',
            height: '1000px',
            border: '1px solid red',
            // transform: 'rotate(90deg) translateY(-100px)',
            transformOrigin: 'right top',
            background: 'blue'
          }}
        >
          5555
        </Grid> */}

        <Template
          PortfolioMainTable={
            <PortfolioMainTable theme={theme} dustFilter={dustFilter} />
          }
          PortfolioActions={<TradeOrderHistory />}
          Chart={
            <PortfolioMainChart
              title="Portfolio Value | Coming Soon | In development"
              style={{
                marginLeft: 0,
                minHeight: '10vh',
              }}
              marginTopHr="10px"
            />
          }
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
        />

        <TransactionPage>
          <PortfolioMainChart
            // title="Portfolio Value | Coming Soon | In development"
            style={{
              marginLeft: 0,
              minHeight: '10vh',
            }}
            marginTopHr="10px"
          />
        </TransactionPage>
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
  withErrorFallback
)(PortfolioMainPage)
