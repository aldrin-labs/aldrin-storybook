import React from 'react'
import { graphql } from 'react-apollo'
import { compose } from 'recompose'
import { Link, withRouter } from 'react-router-dom'
import IconButton from '@material-ui/core/IconButton'
import LiveHelp from '@material-ui/icons/Help'
import ExitIcon from '@material-ui/icons/ExitToApp'
import AccountCircle from '@material-ui/icons/AccountCircle'
import Tooltip from '@material-ui/core/Tooltip'
import { updateTooltipSettings } from '@core/graphql/mutations/user/updateTooltipSettings'
import { tooltipsConfig } from '@core/config/tooltipsConfig'
import { updateTooltipMutation } from '@core/utils/TooltipUtils'
import {
  portfolioMainSteps,
  transactionsPageSteps,
} from '@sb/config/joyrideSteps'
import JoyrideOnboarding from '@sb/components/JoyrideOnboarding/JoyrideOnboarding'
import Onboarding from '../../compositions/Onboarding/'

// import { IProps, IState } from './CreatePortfolio.types'

const UserLink = (props) => <Link to="/user" {...props} />

@withRouter
class LoginMenuComponent extends React.Component {
  constructor(props: any) {
    super(props)

    this.state = {
      openPopup: false,
      // openOnboarding: false,
      key: 0,
    }
  }

  handleClickOpen = () => {
    // this.setState({
    //   openOnboarding: true,
    // })
  }

  render() {
    const { userName, handleLogout, updateTooltipSettings } = this.props
    const isMainPage = this.props.location.pathname === '/portfolio/main'

    return (
      <>
        {/*<JoyrideOnboarding
          steps={isMainPage ? portfolioMainSteps : transactionsPageSteps}
          open={this.state.openOnboarding}
        />*/}

        {/* <Tooltip title={'Show Tips'} enterDelay={250}>
          <IconButton
            onClick={async () => {
              // this.handleClickOpen()

              updateTooltipSettings({
                variables: {
                  settings: {
                    ...tooltipsConfig,
                  },
                },
                update: updateTooltipMutation,
              })
              }
            }
            color="default"
            className="TipButton"
          >
            <LiveHelp />
          </IconButton>
        </Tooltip> */}
        {/*<Onboarding />*/}
        <Tooltip title={userName} enterDelay={250}>
          <IconButton color="default" component={UserLink} className="UserLink">
            <AccountCircle />
          </IconButton>
        </Tooltip>
        <Tooltip title="Log out" enterDelay={500}>
          <IconButton color="default" onClick={handleLogout} id="ExitButton">
            <ExitIcon />
          </IconButton>
        </Tooltip>
      </>
    )
  }
}

export const LoginMenu = compose(
  graphql(updateTooltipSettings, {
    name: 'updateTooltipSettings',
  })
)(LoginMenuComponent)
