import React from 'react'
import { graphql } from 'react-apollo'
import { compose } from 'recompose'
import { Link, withRouter } from 'react-router-dom'
import IconButton from '@material-ui/core/IconButton'
import LiveHelp from '@material-ui/icons/Help'
import ExitIcon from '@material-ui/icons/ExitToApp'
import AccountCircle from '@material-ui/icons/AccountCircle'
import HelpIcon from '@material-ui/icons/Help'
import TelegramIcon from '@material-ui/icons/Telegram'
import Tooltip from '@material-ui/core/Tooltip'
import { updateTooltipSettings } from '@core/graphql/mutations/user/updateTooltipSettings'
import { tooltipsConfig } from '@core/config/tooltipsConfig'
import { updateTooltipMutation } from '@core/utils/TooltipUtils'
import {
  portfolioMainSteps,
  transactionsPageSteps,
  singleChartSteps,
} from '@sb/config/joyrideSteps'
import JoyrideOnboarding from '@sb/components/JoyrideOnboarding/JoyrideOnboarding'
import Onboarding from '../../compositions/Onboarding/'

import { TooltipCustom } from '@sb/components/index'

// import { IProps, IState } from './CreatePortfolio.types'

const UserLink = (props) => <Link to="/profile/accounts" {...props} />

const TelegramLink = (props) => (
  <a
    href="https://t.me/CryptocurrenciesAi"
    target="_blank"
    rel="noopener noreferrer"
    {...props}
  />
)

@withRouter
class LoginMenuComponent extends React.Component {
  constructor(props: any) {
    super(props)

    this.state = {
      openPopup: false,
      openOnboarding: false,
      key: 0,
      stepIndex: 0,
    }
  }

  componentDidUpdate(prev) {
    if (prev.location.pathname !== this.props.location.pathname) {
      this.setState({
        openOnboarding: false,
        stepIndex: 0,
      })
    }
  }

  handleClickOpen = () => {
    this.setState(
      {
        openOnboarding: false,
        stepIndex: 0,
      },
      () => {
        this.setState({ openOnboarding: true })
      }
    )
  }

  render() {
    const { userName, handleLogout, updateTooltipSettings } = this.props
    const steps =
      this.props.location.pathname === '/portfolio/main'
        ? portfolioMainSteps
        : this.props.location.pathname === '/portfolio/transactions'
        ? transactionsPageSteps
        : singleChartSteps

    return (
      <>
        <JoyrideOnboarding
          autoStart
          stepIndex={this.state.stepIndex}
          steps={steps}
          open={this.state.openOnboarding}
          handleJoyrideCallback={(a) => {
            if (a.status === 'finished') {
              this.setState({ openOnboarding: false, stepIndex: 0 })
              return
            }

            switch (a.action) {
              case 'reset': {
                this.setState({ openOnboarding: false, stepIndex: 0 })
                break
              }
              case 'stop': {
                if (a.index !== a.size - 1) {
                  this.setState({ openOnboarding: false, stepIndex: 0 })
                  break
                }
              }
              case 'next': {
                if (a.lifecycle === 'complete') {
                  this.setState((prev) => ({ stepIndex: prev.stepIndex + 1 }))
                }
                break
              }
              case 'prev': {
                if (a.lifecycle === 'complete') {
                  this.setState((prev) => ({ stepIndex: prev.stepIndex - 1 }))
                }
                break
              }
              case 'skip': {
                this.setState((prev) => ({
                  openOnboarding: false,
                  stepIndex: 0,
                }))
                break
              }
            }
          }}
        />

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
        <div style={{ display: 'flex', height: '100%' }}>
          <TooltipCustom
            title={'Tooltips'}
            enterDelay={250}
            component={
              <IconButton
                color="default"
                onClick={this.handleClickOpen}
                component={(props) => <div {...props} />}
                className="UserLink"
                style={{
                  padding: '0 12px',
                  borderRadius: 0,
                  height: '100%',
                }}
              >
                <HelpIcon style={{ fontSize: '2.75rem', fill: '#7284A0' }} />
              </IconButton>
            }
          />

          <TooltipCustom
            title={'Telegram chat'}
            enterDelay={250}
            component={
              <IconButton
                color="default"
                component={TelegramLink}
                className="UserLink"
                style={{
                  padding: '0 12px',
                  borderRadius: 0,
                  height: '100%',
                  borderLeft: '.1rem solid #e0e5ec',
                }}
              >
                <TelegramIcon
                  style={{ fontSize: '2.75rem', fill: '#7284A0' }}
                />
              </IconButton>
            }
          />
        </div>
        {/* <TooltipCustom
          title="Log out"
          enterDelay={500}
          component={
            <IconButton
              style={{ padding: '0 12px' }}
              color="default"
              onClick={handleLogout}
              id="ExitButton"
            >
              <ExitIcon style={{ fontSize: '3rem' }} />
            </IconButton>
          }
        /> */}
      </>
    )
  }
}

export const LoginMenu = compose(
  graphql(updateTooltipSettings, {
    name: 'updateTooltipSettings',
  })
)(LoginMenuComponent)
