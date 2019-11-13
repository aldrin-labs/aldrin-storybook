import * as React from 'react'
import { auth0Options } from '@core/config/authConfig'
import Button from '@material-ui/core/Button'
import { Grow, Slide } from '@material-ui/core'
import { Props } from './Login.types'
import { LoginMenu } from '@sb/components/LoginMenu'
import MainLogo from '@icons/AuthLogo.png'
import auth0Logo from '@icons/auth0Logo.png'
import { Auth0Lock } from 'auth0-lock'

import { MASTER_BUILD } from '@core/utils/config'
import { SWrapper } from './Login.styles'
import { withTheme } from '@material-ui/styles'
import { auth0VerifyEmailErrorMessage, auth0UnauthorizedErrorMessage, errorInProcessOfLoginin } from '@core/utils/errorsConfig'

@withTheme
class LoginQuery extends React.Component<Props> {
  lock = null

  componentDidUpdate = async (prevProps: Props) => {
    if (!this.props.loginStatus && !this.props.modalIsOpen && this.props.loginStatus !== prevProps.loginStatus) {
      await this.onModalChanges(true)
      this.showLoginAfterDelay()
    }
  }

  componentDidMount = async () => {
    this.lock = new Auth0Lock('0N6uJ8lVMbize73Cv9tShaKdqJHmh1Wm', 'ccai.auth0.com', {
      ...auth0Options,
      theme: {
        ...auth0Options.theme,
        primaryColor: this.props.theme.palette.secondary.main,
        logo: auth0Logo,
      },
    })

    this.setLockListeners()
    if (this.props.loginStatus) this.addFSIdentify(this.props.user)
    if (this.props.modalIsOpen) {
      await this.onModalChanges(false)
    }
  }

  showLoginAfterDelay = (delay = 1500): void => {
    setTimeout(this.showLogin, delay)
  }

  handleAuthError = async (errorObject: any) => {
    const { authErrorsMutation, persistCacheImmediately } = this.props
    // we handle only verification email error, assuming that other errors will be resolved by auth0 lib & lock widget
    if (!(auth0VerifyEmailErrorMessage === errorObject.errorDescription && errorObject.error === auth0UnauthorizedErrorMessage)) {
      return
    }

    await authErrorsMutation({
      variables: {
        authError: true,
        authErrorText: errorObject.error || errorInProcessOfLoginin,
      },
    })
    await this.onModalChanges(false)
    await persistCacheImmediately()
  }

  addFSIdentify(profile) {
    if (MASTER_BUILD && window.FS && window.FS.identify) {
      return window.FS.identify(profile.email, {
        displayName: profile.email,
        email: profile.email,
      })
    }
  }

  setLockListeners = () => {
    this.lock.on('authenticated', (authResult: any) => {
      this.lock.getUserInfo(
        authResult.accessToken,
        async (error: Error, profile: any) => {
          if (error) {
            console.error(error)
          }

          await this.props.onLogin(profile, authResult.idToken)
          this.addFSIdentify(profile)
        }
      )
    })
    this.lock.on('hide', async () => {
      await this.onModalProcessChanges(true)
      setTimeout(async () => {
        await this.onModalChanges(false)
      }, 1000)
    })

    this.lock.on('authorization_error', this.handleAuthError)
  }

  onModalChanges = async (modalIsOpen: boolean) => {
    const { modalStatusMutation } = this.props
    const variables = {
      modalIsOpen,
    }

    try {
      await modalStatusMutation({ variables })
    } catch (error) {
      console.log(error)
    }
  }

  onModalProcessChanges = async (modalLogging: boolean) => {
    const { modalProcessMutation } = this.props
    const variables = {
      modalLogging,
    }

    try {
      await modalProcessMutation({ variables })
    } catch (error) {
      console.log(error)
    }
  }

  showLogin = async () => {
    if (!this.props.modalIsOpen && !this.props.modalLogging) {
      await this.onModalChanges(true)
      this.lock.show()
      return
    }

    await this.onModalChanges(false)
  }

  render() {
    const { loginStatus, handleLogout, user } = this.props

    return (
      <SWrapper className="LoginButton">
        <Grow in={!loginStatus} unmountOnExit={true} mountOnEnter={true}>
          <Button
            color="secondary"
            variant="contained"
            onClick={this.showLogin}
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
          <LoginMenu
            handleLogout={handleLogout}
            userName={user && user.name}
          />
        </Slide>
      </SWrapper>
    )
  }
}

export const LoginComponent = LoginQuery
