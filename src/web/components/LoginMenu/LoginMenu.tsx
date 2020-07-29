import React from 'react'
import { graphql } from 'react-apollo'
import { compose } from 'recompose'
import { Link, withRouter } from 'react-router-dom'
import { client } from '@core/graphql/apolloClient'

import IconButton from '@material-ui/core/IconButton'

import HelpIcon from '@material-ui/icons/Help'
import TelegramIcon from '@material-ui/icons/Telegram'

import { writeQueryData } from '@core/utils/TradingTable.utils'

import { queryRendererHoc } from '@core/components/QueryRenderer'
import { GET_TOOLTIP_SETTINGS } from '@core/graphql/queries/user/getTooltipSettings'
import { updateTooltipSettings } from '@core/graphql/mutations/user/updateTooltipSettings'
import { removeTypenameFromObject } from '@core/utils/apolloUtils'

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
    const {
      joyridePage,
      updateTooltipSettingsMutation,
      getTooltipSettingsQuery,
    } = this.props

    const { getTooltipSettings } = getTooltipSettingsQuery || {
      getTooltipSettings: {},
    }

    const openJoyride = () => {
      updateTooltipSettingsMutation({
        variables: {
          settings: {
            ...removeTypenameFromObject(getTooltipSettings),
            onboarding: {
              ...removeTypenameFromObject(getTooltipSettings.onboarding),
            },
            [joyridePage]: true,
          },
        },
      })

      writeQueryData(
        GET_TOOLTIP_SETTINGS,
        {},
        {
          getTooltipSettings: {
            ...getTooltipSettings,
            onboarding: {
              ...getTooltipSettings.onboarding,
            },
            [joyridePage]: true,
          },
        }
      )
    }

    return (
      <>
        <div style={{ display: 'flex', height: '100%' }}>
          {/* <TooltipCustom
            title={'Tooltips'}
            enterDelay={250}
            component={
              <IconButton
                color="default"
                onClick={openJoyride}
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
          /> */}

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
  queryRendererHoc({
    query: GET_TOOLTIP_SETTINGS,
    name: 'getTooltipSettingsQuery',
    fetchPolicy: 'cache-only',
    withOutSpinner: true,
  }),
  graphql(updateTooltipSettings, {
    name: 'updateTooltipSettingsMutation',
  })
)(LoginMenuComponent)
