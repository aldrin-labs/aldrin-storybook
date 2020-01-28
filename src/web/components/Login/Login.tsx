import * as React from 'react'
import { compose } from 'recompose'
import { graphql } from 'react-apollo'
import { withRouter } from 'react-router'

import { Grow, Slide, Button } from '@material-ui/core'
import { withTheme } from '@material-ui/styles'

import { queryRendererHoc } from '@core/components/QueryRenderer'
import * as CLIENT_API_MUTATIONS from '@core/graphql/mutations/login'
import { GET_LOGIN_DATA } from '@core/graphql/queries/login/GET_LOGIN_DATA'

import { handleLogout } from '@core/utils/loginUtils'

import { LoginMenu } from '@sb/components/LoginMenu'
import { Props } from './Login.types'
import { SWrapper } from './Login.styles'
import { withApolloPersist } from '@sb/compositions/App/ApolloPersistWrapper/withApolloPersist'

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
    const {
      logoutMutation,
      history: { push },
    } = this.props
    await handleLogout(logoutMutation, this.props.persistorInstance)
    push('/login')
  }

  render() {
    const {
      loginDataQuery: {
        login: { loginStatus, user },
      },
      location: { pathname },
    } = this.props

    const isLoginPage = pathname === '/login'

    return (
      <SWrapper className="LoginButton">
        <Grow
          in={!loginStatus && !isLoginPage}
          unmountOnExit={true}
          mountOnEnter={true}
        >
          <Button
            color="secondary"
            variant="contained"
            onClick={this.hangleGoToLoginPage}
            className="loginButton"
            style={{ padding: '1px 16px' }}
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
  withApolloPersist,
  queryRendererHoc({ query: GET_LOGIN_DATA, name: 'loginDataQuery' }),
  graphql(CLIENT_API_MUTATIONS.LOGOUT, { name: 'logoutMutation' })
)(LoginClassComponent)
