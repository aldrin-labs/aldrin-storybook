import * as React from 'react'
import { compose } from 'recompose'
import { graphql } from 'react-apollo'
import { withRouter } from 'react-router'
import { Link } from 'react-router-dom'

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
import { syncStorage } from '@storage'

const OldLoginLink = (props: any) => <Link to="/login" {...props} />
const SignInLink = (props: any) => <Link to="/signin" {...props} />
const SignUpLink = (props: any) => <Link to="/signup" {...props} />

@withTheme
@withRouter
class LoginClassComponent extends React.Component<Props> {

  logout = async () => {
    const {
      logoutMutation,
      history: { push },
    } = this.props
    await handleLogout(logoutMutation, this.props.persistorInstance)
    push('/signin')
  }

  render() {
    const {
      loginDataQuery: {
        login: { user },
      },
      location: { pathname },
    } = this.props
    const loginStatus = Boolean(syncStorage.getItem('loginStatus'))

    const isLoginPage = pathname === '/login'

    return (
      <SWrapper className="LoginButton">
        <Grow
          in={!loginStatus && !isLoginPage}
          unmountOnExit={true}
          mountOnEnter={true}
        >
          <>
            <Button
              component={SignInLink}
              color="secondary"
              variant="contained"
              // onClick={this.hangleGoToSiginPage}
              className="loginButton"
              style={{ padding: '1px 16px', margin: '0 1rem' }}
            >
              Sign in
            </Button>
            <Button
              component={SignUpLink}
              color="secondary"
              variant="contained"
              // onClick={this.hangleGoToSignupPage}
              className="loginButton"
              style={{ padding: '1px 16px', margin: '0 1rem', backgroundColor: '#97C15C' }}
            >
              Sign Up
            </Button>
            <Button
              component={OldLoginLink}
              color="secondary"
              variant="contained"
              // onClick={this.hangleGoToLoginPage}
              className="loginButton"
              style={{ padding: '1px 16px', margin: '0 1rem' }}
            >
              Old login
            </Button>
          </>
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
