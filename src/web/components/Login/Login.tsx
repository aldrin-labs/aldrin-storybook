import * as React from 'react'
import { compose } from 'recompose'
import { graphql } from 'react-apollo'
import { Link, withRouter } from 'react-router-dom'
import { Grow, Slide, Button } from '@material-ui/core'
import { withTheme } from '@material-ui/styles'

import { queryRendererHoc } from '@core/components/QueryRenderer'
import * as CLIENT_API_MUTATIONS from '@core/graphql/mutations/login'
import { GET_LOGIN_DATA } from '@core/graphql/queries/login/GET_LOGIN_DATA'
import { handleLogout, checkLoginStatus } from '@core/utils/loginUtils'

import { SignUpButton, SignInLink, SignUpLink } from '@sb/components'
import { LoginMenu } from '@sb/components/LoginMenu'

import { Props } from './Login.types'
import { SWrapper } from './Login.styles'
import { withApolloPersist } from '@sb/compositions/App/ApolloPersistWrapper/withApolloPersist'
import { syncStorage } from '@storage'

@withTheme()
@withRouter
class LoginClassComponent extends React.Component<Props> {
  logout = async () => {
    const {
      logoutMutation,
      history: { push },
      location: { pathname },
    } = this.props
    await handleLogout(logoutMutation, this.props.persistorInstance)
    push(`/login?callbackURL=${pathname}`)
  }

  render() {
    const {
      loginDataQuery: {
        login: { user },
      },
      location: { pathname },
      joyridePage,
    } = this.props
    const loginStatus = checkLoginStatus()

    return (
      <SWrapper className="LoginButton">
        <Grow in={!loginStatus} unmountOnExit={true} mountOnEnter={true}>
          <>
            <Button
              component={SignInLink}
              pathname={pathname}
              color="secondary"
              variant="contained"
              // onClick={this.hangleGoToSiginPage}
              className="loginButton"
              style={{
                padding: '1px 16px',
                margin: '0 1rem',
                whiteSpace: 'nowrap',
              }}
            >
              Log in
            </Button>
            <SignUpButton
              component={SignUpLink}
              pathname={pathname}
              color="secondary"
              variant="contained"
              // onClick={this.hangleGoToSignupPage}
              className="loginButton"
              style={{
                padding: '1px 16px',
                margin: '0 1rem',
                whiteSpace: 'nowrap',
              }}
            >
              Sign Up
            </SignUpButton>
          </>
        </Grow>
        <Slide
          in={loginStatus}
          direction={'left'}
          unmountOnExit={true}
          mountOnEnter={true}
        >
          <LoginMenu
            joyridePage={joyridePage}
            handleLogout={this.logout}
            userName={user && user.name}
          />
        </Slide>
      </SWrapper>
    )
  }
}

export const LoginComponent = compose(
  withApolloPersist,
  queryRendererHoc({ query: GET_LOGIN_DATA, name: 'loginDataQuery' }),
  graphql(CLIENT_API_MUTATIONS.LOGOUT, { name: 'logoutMutation' })
)(LoginClassComponent)
