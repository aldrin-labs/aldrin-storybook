import * as React from 'react'
import { Auth0Lock } from 'auth0-lock'

import { withRouter } from 'react-router'
import { Button } from '@material-ui/core'
import { withTheme } from '@material-ui/styles'

import auth0Logo from '@icons/auth0Logo.png'

import { auth0Options } from '@core/config/authConfig'
import { MASTER_BUILD } from '@core/utils/config'

import {
  auth0VerifyEmailErrorMessage,
  auth0UnauthorizedErrorMessage,
  errorInProcessOfLoginin,
} from '@core/utils/errorsConfig'
import { Loading } from '@sb/components/index'

@withTheme
@withRouter
class LoginClassComponent extends React.Component<{}> {
  lock = null

  componentDidMount = async () => {
    this.lock = new Auth0Lock(
      '0N6uJ8lVMbize73Cv9tShaKdqJHmh1Wm',
      'ccai.auth0.com',
      {
        ...auth0Options,
        theme: {
          ...auth0Options.theme,
          primaryColor: this.props.theme.palette.secondary.main,
          logo: auth0Logo,
        },
      }
    )

    this.setLockListeners()
    if (this.props.loginStatus) this.addFSIdentify(this.props.user)
    if (this.props.modalIsOpen) {
      await this.onModalChanges(false)
    }

    // temporary not stable
    // await this.showLogin()
  }

  componentDidUpdate = async (prevProps: Props) => {
    if (
      !this.props.loginStatus &&
      !this.props.modalIsOpen &&
      this.props.loginStatus !== prevProps.loginStatus
    ) {
      await this.onModalChanges(true)
      this.showLoginAfterDelay()
    }
  }

  showLoginAfterDelay = (delay = 1500): void => {
    setTimeout(this.showLogin, delay)
  }

  handleAuthError = async (errorObject: any) => {
    const { authErrorsMutation, persistCacheImmediately } = this.props
    // we handle only verification email error, assuming that other errors will be resolved by auth0 lib & lock widget
    if (
      !(
        auth0VerifyEmailErrorMessage === errorObject.errorDescription &&
        errorObject.error === auth0UnauthorizedErrorMessage
      )
    ) {
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
    const {
      history: {
        location: { hash },
      },
      loginStatus,
      loginInProcess,
    } = this.props
    const isAfterRedirectFromAuth = hash.includes('access_token')

    return (
      <>
        {isAfterRedirectFromAuth || loginInProcess === true || loginStatus === true ? (
          <Loading color={'#165BE0'} />
        ) : (
          <Button
            color="secondary"
            variant="contained"
            onClick={this.showLogin}
            className="loginButton"
          >
            Log in / Sign Up
          </Button>
        )}
      </>
    )
  }
}

export default LoginClassComponent
