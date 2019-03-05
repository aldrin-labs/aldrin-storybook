import React from 'react'
import { withTheme } from '@material-ui/styles'
import { connect } from 'react-redux'
import { compose } from 'recompose'
import Joyride from 'react-joyride'

import { IProps, IState } from './PortfolioMainPage.types'

import PortfolioMainChart from '@core/containers/PortfolioMainChart/PortfolioMainChart'
import TradeOrderHistory from '@core/containers/TradeOrderHistory/TradeOrderHistory'
import PortfolioMainTable from '@core/containers/PortfolioMainTable/PortfolioMainTable'

import { portfolioMainSteps } from '@sb/config/joyrideSteps'
import * as actions from '@core/redux/user/actions'
import { withErrorFallback } from '@core/hoc/withErrorFallback'
import Template from '@sb/components/Template/Template'

@withTheme()

class PortfolioMainPage extends React.Component<IProps, IState> {
  state: IState = {
    key: 0,
  }

  handleJoyrideCallback = (data: any) => {
    if (
      data.action === 'close' ||
      data.action === 'skip' ||
      data.status === 'finished'
    ) {
      this.props.hideToolTip('Main')
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
          run={this.props.toolTip.portfolioMain}
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

const mapDispatchToProps = (dispatch: any) => ({
  hideToolTip: (tab: string) => dispatch(actions.hideToolTip(tab)),
})

const mapStateToProps = (store: any) => ({
  isShownMocks: store.user.isShownMocks,
  toolTip: store.user.toolTip,
})

export default compose(
  withErrorFallback,
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(PortfolioMainPage)
