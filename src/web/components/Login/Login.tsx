import * as React from 'react'
import { compose } from 'recompose'
import { graphql } from 'react-apollo'
import { withRouter } from 'react-router'

import { Grow, Slide, Button } from '@material-ui/core'
import { withTheme } from '@material-ui/styles'


import { queryRendererHoc } from '@core/components/QueryRenderer'
import * as CLIENT_API_MUTATIONS from '@core/graphql/mutations/login'
import { GET_LOGIN_DATA } from '@core/graphql/queries/login/GET_LOGIN_DATA'

import {
  handleLogout,
} from '@core/utils/loginUtils'

import { LoginMenu } from '@sb/components/LoginMenu'
import { Props } from './Login.types'
import { SWrapper } from './Login.styles'

@withTheme
@withRouter
class LoginClassComponent extends React.Component<Props> {
  hangleGoToLoginPage = () => {
    const {
      history: { push },
    } = this.props

    push('/login')
  }

  logout = async () => {
    const { logoutMutation } = this.props
    handleLogout(logoutMutation)
  }

  render() {
    const {
      loginDataQuery: {
        login: { loginStatus, user },
      },
    } = this.props

    return (
      <SWrapper className="LoginButton">
        <Grow in={!loginStatus} unmountOnExit={true} mountOnEnter={true}>
          <Button
            color="secondary"
            variant="contained"
            onClick={this.hangleGoToLoginPage}
            // onClick={this.showLogin}
            className="loginButton"
          >
            Log in / Sign Up
          </Button>
        </Grow>
        <Slide
          in={loginStatus}
          direction={'left'}
          unmountOnExit={true}
          mountOnEnter={true}
        >
          <LoginMenu handleLogout={this.logout} userName={user && user.name} />
        </Slide>
      </SWrapper>
    )
  }
}

export const LoginComponent = compose(
  queryRendererHoc({ query: GET_LOGIN_DATA, name: 'loginDataQuery' }),
  graphql(CLIENT_API_MUTATIONS.LOGOUT, { name: 'logoutMutation' })
)(LoginClassComponent)
