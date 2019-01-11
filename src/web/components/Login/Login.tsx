import * as React from 'react'
import styled from 'styled-components'
import { compose } from 'recompose'
import { graphql } from 'react-apollo'
import jwtDecode from 'jwt-decode'
import Button from '@material-ui/core/Button'

// import { withErrorFallback } from '../../hoc'
import { Props, State } from '@containers/Login/interfaces'
import * as API from '@containers/Login/api'
import * as CLIENT_API_MUTATIONS from '@core/graphql/mutations/login/index'
import { GET_LOGIN_DATA } from '@core/graphql/queries/login/GET_LOGIN_DATA'
import { LoginMenu } from '@containers/Login/components'
import MainLogo from '@icons/AuthLogo.png'
import { Grow, Slide } from '@material-ui/core'
import { MASTER_BUILD } from '@utils/config'
import { client } from '@core/graphql/apolloClient'
import { persistor } from '@utils/persistConfig'

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

const SWrapper = styled.div`
  z-index: 100000;
  padding: 0 1rem;
  align-items: center;
  display: flex;
  justify-content: flex-end;
`

class LoginQuery extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      anchorEl: null,
      lock: null,
    }
  }

  static getDerivedStateFromProps(props: Props) {
    auth0Options.theme.primaryColor = props.mainColor
    return {
      lock: new Auth0Lock(
        '0N6uJ8lVMbize73Cv9tShaKdqJHmh1Wm',
        'ccai.auth0.com',
        auth0Options
      ),
    }
  }

  componentDidMount() {
    this.onListenersChanges(true)
    this.onModalChanges(false)
    setTimeout(() => {
      console.log(this.props.isShownModal)
      if (this.props.isShownModal) this.showLogin()
      this.setLockListeners()
      if (this.props.loginStatus)
        this.addFSIdentify(this.props.user)
    }
    , 1000)
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
    console.log('setLockListeners')
    this.state.lock.on('authenticated', (authResult: any) => {
      console.log('authenticated')
      this.props.onLoginProcessChanges(true)
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
    this.state.lock.on('hide', () => {
      console.log('hide')
      this.onModalProcessChanges(true)
      this.onListenersChanges(false)
      setTimeout(() => this.onModalChanges(false), 1000)
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

  showLogin = () => {
    const isLoginPopUpClosed =
      !this.props.loginDataQuery.login.modalIsOpen &&
      !this.props.loginDataQuery.login.isLogging &&
      !this.props.loginDataQuery.login.modalLogging
    if (isLoginPopUpClosed) {
      this.onModalChanges(true)
      this.state.lock.show()
      console.log('listenersOff', this.props.loginDataQuery.login.listenersOff)
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

export const LoginComponent = compose(
)(LoginQuery)
