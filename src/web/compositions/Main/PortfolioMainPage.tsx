import React from 'react'
import { withTheme } from '@material-ui/styles'
import { graphql } from 'react-apollo'
import { compose } from 'recompose'
import Joyride from 'react-joyride'

import { IProps, IState } from './PortfolioMainPage.types'

import PortfolioMainChart from '@core/containers/PortfolioMainChart/PortfolioMainChart'
import TradeOrderHistory from '@core/containers/TradeOrderHistory/TradeOrderHistory'
import PortfolioMainTable from '@core/containers/PortfolioMainTable/PortfolioMainTable'

import { tooltipsConfig } from '@sb/config/tooltipsConfig'
import { portfolioMainSteps } from '@sb/config/joyrideSteps'
import { withErrorFallback } from '@core/hoc/withErrorFallback'
import { queryRendererHoc } from '@core/components/QueryRenderer'
import Template from '@sb/components/Template/Template'
import { getTooltipSettings } from '@core/graphql/queries/user/getTooltipSettings'
import { updateTooltipSettings } from '@core/graphql/mutations/user/updateTooltipSettings'

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
      await this.props.updateTooltipSettings({ variables: tooltipsConfig.disabled })
    }
    if (data.status === 'finished') {
      const oldKey = this.state.key
      this.setState({ key: oldKey + 1 })
    }
  }

  render() {
    const { theme, dustFilter } = this.props

    return (
      <>
        <Template
          PortfolioMainTable={<PortfolioMainTable theme={theme} dustFilter={dustFilter} />}
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
          run={this.props.getTooltipSettings.getTooltipSettings.portfolioMain}
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
      </>
    )
  }
}


export default compose(
  withErrorFallback,
  graphql(updateTooltipSettings, { name: 'updateTooltipSettings' }),
  queryRendererHoc({ query: getTooltipSettings, name: 'getTooltipSettings' }),
)(PortfolioMainPage)
