import * as React from 'react'
import { withTheme } from '@material-ui/styles'
import Joyride from 'react-joyride'
import { connect } from 'react-redux'

import { withErrorFallback } from '@sb/components/hoc/withErrorFallback/withErrorFallback'
import * as actions from '@core/redux/user/actions'

import { IProps, IState } from './types'
import { portfolioIndustrySteps } from '@sb/config/joyrideSteps'
import Template from './Template'
import IndustryTable from '@core/containers/IndustryTable'
import IndustryChart from '@core/containers/IndustryChart'

@withTheme()
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
    const { theme, dustFilter } = this.props

    return (
      <>
        <Template
          Table={<IndustryTable dustFilter={dustFilter} />}
          Chart={<IndustryChart />}
        />
        <Joyride
          steps={portfolioIndustrySteps}
          run={this.props.toolTip.portfolioIndustry}
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
