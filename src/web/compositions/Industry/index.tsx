import * as React from 'react'
import { Fade } from '@material-ui/core'
import Joyride from 'react-joyride'
import { connect } from 'react-redux'

import { withErrorFallback } from '@sb/components/hoc/withErrorFallback/withErrorFallback'
import * as actions from '@core/redux/user/actions'

import { IProps, IState } from './types'
import { portfolioIndustrySteps } from '@sb/config/joyrideSteps'
import Template from './Template'
import IndustryTable from '@core/components/IndustryTable'
import IndustryChart from '@core/components/IndustryChart'

class PortfolioTableIndustries extends React.Component<IProps, IState> {
  state: IState = {
    key: 0,
  }

  handleJoyrideCallback = (data) => {
    if (
      data.action === 'close' ||
      data.action === 'skip' ||
      data.status === 'finished'
    ) {
      this.props.hideToolTip('Industry')
    }
    if (data.status === 'finished') {
      const oldKey = this.state.key
      this.setState({ key: oldKey + 1 })
    }
  }

  render() {
    const { theme, tab } = this.props

    return (
      <>
        <Template
          Table={<IndustryTable />}
          Chart={
            <Fade
              timeout={0}
              in={tab === 'industry'}
              mountOnEnter
              unmountOnExit
            >
              <IndustryChart />
            </Fade>
          }
        />
        <Joyride
          steps={portfolioIndustrySteps}
          run={this.props.toolTip.portfolioIndustry && tab === 'industry'}
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

const mapStateToProps = (store) => ({
  toolTip: store.user.toolTip,
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withErrorFallback(PortfolioTableIndustries))
