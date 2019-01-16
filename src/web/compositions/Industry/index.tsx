import * as React from 'react'
import { Fade } from '@material-ui/core'
import Joyride from 'react-joyride'

import DonutChart from '@containers/Portfolio/components/PortfolioTable/Industry/DonutChart/DonutChart'
import { IProps, IState } from './types'
import { portfolioIndustrySteps } from '@utils/joyrideSteps'
import Template from './Template'
import IndustryTable from '@containers/Portfolio/components/PortfolioTable/Industry/IndustryTable/IndustryTable'

class PortfolioTableIndustries extends React.Component<IProps, IState> {
  render() {
    const {
      theme,
      tab,
      joyrideSettings,
    } = this.props

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
              <DonutChart />
            </Fade>
          }
        />
        <Joyride
          steps={portfolioIndustrySteps}
          run={joyrideSettings.run}
          callback={joyrideSettings.handleJoyrideCallback}
          key={joyrideSettings.key}
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


export default PortfolioTableIndustries
