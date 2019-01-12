import * as React from 'react'
import { compose } from 'recompose'
import Button from '@material-ui/core/Button'
import { Props, State } from '@containers/Login/interfaces'
import { LoginMenu } from '@containers/Login/components'
import MainLogo from '@icons/AuthLogo.png'
import { Grow, Slide } from '@material-ui/core'
import { MASTER_BUILD } from '@utils/config'
import { SWrapper } from './Login.styles'

const auth0Options = {
  auth: {
    responseType: 'token id_token',
    redirectUri: 'localhost:3000/login',
    scope: 'openid',
    audience: 'localhost:5080',
  },
  theme: {
    logo: MainLogo,
    primaryColor: '#4ed8da',
  },
  languageDictionary: {
    title: 'Be an early adopter',
  },
  autofocus: true,
  autoclose: true,
  oidcConformant: true,
}


class LoginQuery extends React.Component<Props, State> {
    state = {
      anchorEl: null,
      lock: new Auth0Lock(
        '0N6uJ8lVMbize73Cv9tShaKdqJHmh1Wm',
        'ccai.auth0.com',
        {
          ...auth0Options, theme: {
            ...auth0Options.theme,
            primaryColor: this.props.mainColor,
          },
        }),
    }

  componentDidMount() {
    if (this.props.isShownModal) {
      this.state.lock.show()
      this.onModalChanges(true)
    } else {
      this.onModalChanges(false)
    }
    this.onListenersChanges(true);
    this.setLockListeners()
    if (this.props.loginStatus)
      this.addFSIdentify(this.props.user)
  }

  addFSIdentify(profile) {
    if (MASTER_BUILD && window.FS && window.FS.identify) {
      return window.FS.identify(profile.email, {
        displayName: profile.email,
        email: profile.email,
      })
    }
  }

  handleMenu = (event: Event) => {
    this.setState({ anchorEl: event.currentTarget })
  }

  setLockListeners = () => {
    this.state.lock.on('authenticated', (authResult: any) => {
      this.props.isLogging()
      this.state.lock.getUserInfo(
        authResult.accessToken,
        async (error: Error, profile: any) => {
          if (error) {
            console.error(error)
          }
          this.props.onLogin(profile, authResult.idToken)
          this.addFSIdentify(profile)
        }
      )
    })
    this.state.lock.on('hide', async () => {
      await this.onModalProcessChanges(true)
      await this.onListenersChanges(true)
      setTimeout(() => {
        this.onModalChanges(false)
      }, 1000)
    })
  }

  onListenersChanges = async (listenersStatus: boolean) => {
    const { listenersStatusMutation } = this.props
    const variables = {
      listenersStatus,
    }

    try {
      await listenersStatusMutation({ variables })
    } catch (error) {
      console.log(error)
    }
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

  handleClose = () => {
    this.setState({ anchorEl: null })
  }

  showLogin = async () => {
    const isLoginPopUpClosed =
      !this.props.loginDataQuery.login.modalIsOpen &&
      !this.props.loginDataQuery.login.modalLogging &&
      !this.props.logging
    if(!isLoginPopUpClosed) {
      this.onModalChanges(false)
    }
    console.log('ff isLoginPopUpClosed', isLoginPopUpClosed)

    if (isLoginPopUpClosed) {
      await this.onModalChanges(true)
      this.state.lock.show()
      if (this.props.loginDataQuery.login.listenersOff) {
        this.setLockListeners()
     }
    }
  }

  render() {
    const {
      loginStatus,
      handleLogout,
      user,
    } = this.props

    if (this.props.isShownModal) return null
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
            anchorEl={this.state.anchorEl}
            open={open}
            handleClose={this.handleClose}
            handleMenu={this.handleMenu}
            handleLogout={handleLogout}
            userName={user && user.name}
          />
        </Slide>
      </SWrapper>
    )
  }
}

export const LoginComponent = LoginQuery
