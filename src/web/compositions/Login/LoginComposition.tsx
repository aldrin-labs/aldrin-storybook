import React from 'react'
import jwtDecode from 'jwt-decode'
import { compose } from 'recompose'
import { withSnackbar } from 'notistack'

import { ILoginStep, IProps, IState } from './LoginComposition.types'

import Auth from '@sb/compositions/Onboarding/Auth'
import { getAuthCallback } from '@core/utils/config'
import { randomInteger, sleep } from '@core/utils/helpers'

import {
  SetUpMfa,
  EnterRecoveryCode,
  ChooseMfaProvider,
  EnterOtp,
} from '@sb/compositions/Login/MFA'
import ConfirmEmail from '@sb/compositions/Login/ConfirmEmail/ConfirmEmail'
import ForgotPassword from '@sb/compositions/Login/ForgotPassword/ForgotPassword'
import SignIn from '@sb/compositions/Login/SignIn/SignIn'
import SignUp from '@sb/compositions/Login/SignUp/SignUp'

class LoginComposition extends React.PureComponent<IProps, IState> {
  state: IState = {
    currentStep: this.props.initialStep,
    accessToken: '',
    idToken: '',
    mfaToken: '',
    // TODO: delete secret
    secret: '',
    barcodeUri: '',
    recoveryCode: '',
    newRecoveryCode: '',
    signIn: {
      status: '',
      errorMessage: '',
    },
    enterOtp: {
      status: '',
      errorMessage: '',
    },
    associateMfa: {
      status: '',
      errorMessage: '',
    },
    authenticateWithOtp: {
      status: '',
      errorMessage: '',
    },
    authenticateWithRecovery: {
      status: '',
      errorMessage: '',
    },
    forgotPassword: {
      status: '',
      errorMessage: '',
    },
    signUp: {
      status: '',
      errorMessage: '',
    },
  }

  auth = new Auth(
    getAuthCallback({
      initialStep: this.props.initialStep,
      forWithdrawal: this.props.forWithdrawal,
    })
  )

  static getDerivedStateFromProps(nextProps: IProps, prevState: IState) {
    if (
      nextProps.initialStep !== prevState.currentStep &&
      (prevState.currentStep === 'signIn' || prevState.currentStep === 'signUp')
    ) {
      return { currentStep: nextProps.initialStep }
    } else return null
  }

  // this lifecycle here is only needed for sign up with google / sign in with google
  // maybe better to move it upper level into LoginCustom container
  async componentDidMount() {
    // validate that hash exists in url before trigger google auth
    if (window.location.hash === '') {
      return
    }

    const result = await this.auth.handleAuthentication()
    if (result.status === 'ok') {
      const { data } = result
      if (data && data.idToken && data.idTokenPayload) {
        // this.setState({ redirected: true })
        const profile = {
          idToken: data.idToken,
          ...data.idTokenPayload,
        }
        await this.props.onLogin(profile, data.idToken, data.accessToken)
      }
    } else {
      this.showLoginStatus({
        status: 'error',
        errorMessage: 'Something went wrong with login with google',
      })
    }
  }

  changeCurrentStep = (step: ILoginStep) => {
    this.setState({
      currentStep: step,
    })
  }

  showLoginStatus = ({
    status,
    errorMessage = 'Something went wrong with login',
  }: {
    status: 'error' | 'success' | string
    errorMessage: string
  }) => {
    const { enqueueSnackbar } = this.props
    if (status === 'success') {
      enqueueSnackbar(`Success`, { variant: 'success' })
    } else {
      enqueueSnackbar(`Error: ${errorMessage}`, { variant: 'error' })
    }
  }

  authenticateWithPasswordHandler = async ({
    username,
    password,
  }: {
    username: string
    password: string
  }) => {
    const resultOfAuthenticate = await this.auth.authSimple({
      username,
      password,
    })

    const { access_token, id_token } = resultOfAuthenticate

    // if mfa for this user is disabled
    if (access_token && access_token.length && id_token && id_token.length) {
      this.setState({
        accessToken: access_token,
        idToken: id_token,
      })
      // this.showLoginStatus({
      //   status: 'success',
      //   errorMessage: '',
      // })
      // should be handler after authetication
      await this.processAuthentificationHandler({
        accessToken: access_token,
        idToken: id_token,
      })

      return
    }

    // other errors
    if (resultOfAuthenticate.error !== 'mfa_required') {
      // Add notistack here
      this.showLoginStatus({
        status: resultOfAuthenticate.error,
        errorMessage: resultOfAuthenticate.error_description,
      })

      return
    }

    // if mfa for user enabled
    if (
      resultOfAuthenticate.error === 'mfa_required' &&
      resultOfAuthenticate.mfa_token &&
      resultOfAuthenticate.mfa_token !== ''
    ) {
      const listOfAssociatedMfa = await this.auth.listOfAssociatedMfa({
        authMfaToken: resultOfAuthenticate.mfa_token,
      })
      const checkThatUserAlreadyConfiguredMfa =
        Array.isArray(listOfAssociatedMfa) && listOfAssociatedMfa.length >= 1
      const checkThatErrorDuringListMfa =
        listOfAssociatedMfa.error && listOfAssociatedMfa.error_description

      if (checkThatErrorDuringListMfa) {
        this.setState((prevState) => ({
          ...prevState,
          signIn: {
            status: listOfAssociatedMfa.error,
            errorMessage: listOfAssociatedMfa.error_description,
          },
        }))

        // Add notistack here
        this.showLoginStatus({
          status: listOfAssociatedMfa.error,
          errorMessage: listOfAssociatedMfa.error_description,
        })

        return
      }

      if (!checkThatUserAlreadyConfiguredMfa) {
        this.setState({
          currentStep: 'configureMfa',
          mfaToken: resultOfAuthenticate.mfa_token,
        })
      }

      if (checkThatUserAlreadyConfiguredMfa) {
        this.setState({
          currentStep: 'enterOtp',
          mfaToken: resultOfAuthenticate.mfa_token,
        })
      }
    }
  }

  associateMfaMethodHandler = async () => {
    // We should also handle double-click here, because recovery code can be accessed only once

    const { mfaToken } = this.state
    const authenticatorTypes = ['otp'] // we are not allowing other methods yet
    const resultOfAssociationWithMfaMethod = await this.auth.authMfaAssociate({
      authenticatorTypes: authenticatorTypes,
      authMfaToken: mfaToken,
    })

    const checkThatErrorDuringAssociation =
      resultOfAssociationWithMfaMethod.error &&
      resultOfAssociationWithMfaMethod.error_description

    if (checkThatErrorDuringAssociation) {
      this.setState((prevState) => ({
        ...prevState,
        associateMfa: {
          status: resultOfAssociationWithMfaMethod.error,
          errorMessage: resultOfAssociationWithMfaMethod.error_description,
        },
      }))
      // Add notistack here
      this.showLoginStatus({
        status: resultOfAssociationWithMfaMethod.error,
        errorMessage: resultOfAssociationWithMfaMethod.error_description,
      })

      return
    }

    if (
      resultOfAssociationWithMfaMethod.secret &&
      resultOfAssociationWithMfaMethod.barcode_uri &&
      resultOfAssociationWithMfaMethod.authenticator_type
    ) {
      const {
        secret,
        barcode_uri,
        authenticator_type,
        recovery_codes,
      } = resultOfAssociationWithMfaMethod

      if (!(Array.isArray(recovery_codes) && recovery_codes.length)) {
        // add notistack here
        this.showLoginStatus({
          status: 'error',
          errorMessage:
            'Recovery code missing, probably you already set up mfa',
        })
      }

      this.setState({
        currentStep: 'setupMfa',
        // TODO: delete secret because it's unused
        secret: secret,
        barcodeUri: barcode_uri,
        recoveryCode: recovery_codes[0],
      })
    }
  }

  enterRecoveryCodeHandler = async (recoveryCode: string) => {
    const { mfaToken } = this.state

    const resultOfAuthenticateWithRecoveryCode = await this.auth.authMfa({
      authMfaToken: mfaToken,
      recoveryCode: recoveryCode,
    })
    const checkThatErrorDuringAuthenticateWithRecovery =
      resultOfAuthenticateWithRecoveryCode.error &&
      resultOfAuthenticateWithRecoveryCode.error_description

    if (checkThatErrorDuringAuthenticateWithRecovery) {
      this.setState((prevState) => ({
        ...prevState,
        authenticateWithRecovery: {
          status: resultOfAuthenticateWithRecoveryCode.error,
          errorMessage: resultOfAuthenticateWithRecoveryCode.error_description,
        },
      }))
      // Add notistack here
      this.showLoginStatus({
        status: resultOfAuthenticateWithRecoveryCode.error,
        errorMessage: resultOfAuthenticateWithRecoveryCode.error_description,
      })

      return
    }

    if (!resultOfAuthenticateWithRecoveryCode.recovery_code) {
      this.setState((prevState) => ({
        ...prevState,
        authenticateWithRecovery: {
          status: 'error',
          errorMessage: 'Recovery code missing',
        },
      }))
      // Add notistack here
      this.showLoginStatus({
        status: 'error',
        errorMessage: 'Recovery code missing',
      })

      return
    }

    const {
      recovery_code,
      access_token,
      id_token,
      scope,
      token_type,
    } = resultOfAuthenticateWithRecoveryCode

    this.setState(
      {
        newRecoveryCode: recovery_code,
        accessToken: access_token,
        idToken: id_token,
        authenticateWithRecovery: {
          status: 'success',
          errorMessage: '',
        },
      },
      async () => {
        // Add notistack here
        this.showLoginStatus({
          status: 'success',
          errorMessage: '',
        })
      }
    )
  }

  otpCompleteHandler = async (otp: string) => {
    const { mfaToken } = this.state

    const resultOfAuthenticateWithOtp = await this.auth.authMfa({
      authMfaToken: mfaToken,
      otp: otp,
    })
    const checkThatErrorDuringAuthenticateWithOtp =
      resultOfAuthenticateWithOtp.error &&
      resultOfAuthenticateWithOtp.error_description

    if (checkThatErrorDuringAuthenticateWithOtp) {
      this.setState((prevState) => ({
        ...prevState,
        authenticateWithOtp: {
          status: resultOfAuthenticateWithOtp.error,
          errorMessage: resultOfAuthenticateWithOtp.error_description,
        },
      }))
      // Add notistack here
      this.showLoginStatus({
        status: resultOfAuthenticateWithOtp.error,
        errorMessage: resultOfAuthenticateWithOtp.error_description,
      })

      return
    }

    if (!resultOfAuthenticateWithOtp.access_token) {
      this.setState((prevState) => ({
        ...prevState,
        authenticateWithOtp: {
          status: 'error',
          errorMessage: 'Access code missing',
        },
      }))
      // Add notistack here
      this.showLoginStatus({
        status: 'error',
        errorMessage: 'Access code missing',
      })

      return
    }

    const {
      access_token,
      id_token,
      scope,
      token_type,
    } = resultOfAuthenticateWithOtp

    this.setState(
      {
        accessToken: access_token,
        idToken: id_token,
        authenticateWithOtp: {
          status: 'success',
          errorMessage: '',
        },
      },
      async () => {
        // Add notistack here
        this.showLoginStatus({
          status: 'success',
          errorMessage: '',
        })

        await this.processAuthentificationHandler({
          accessToken: access_token,
          idToken: id_token,
        })
      }
    )
  }

  forgotPasswordHandler = async ({ email }: { email: string }) => {
    const resultOfForgotPassowrd = await this.auth.changePassword({
      email,
    })

    const checkThatErrorDuringForgotPassowrd =
      resultOfForgotPassowrd.error && resultOfForgotPassowrd.error_description

    if (checkThatErrorDuringForgotPassowrd) {
      this.setState((prevState) => ({
        ...prevState,
        forgotPassword: {
          status: resultOfForgotPassowrd.error,
          errorMessage: resultOfForgotPassowrd.error_description,
        },
      }))
      // Add notistack here
      this.showLoginStatus({
        status: resultOfForgotPassowrd.error,
        errorMessage: resultOfForgotPassowrd.error_description,
      })

      return
    }

    this.setState({
      forgotPassword: {
        status: 'success',
        errorMessage: '',
      },
    })
    // Add notistack here
    this.showLoginStatus({
      status: 'success',
      errorMessage: '',
    })
  }

  processAuthentificationHandler = async ({
    accessToken,
    idToken,
  }: {
    accessToken: string
    idToken: string
  }) => {
    const { onLogin } = this.props
    const decodedProfile = jwtDecode(idToken)

    await onLogin(decodedProfile, idToken, accessToken)
  }

  callProcessAuthentificationHandler = async () => {
    const { accessToken, idToken } = this.state
    await this.processAuthentificationHandler({ accessToken, idToken })
  }

  signUpWithPasswordHandler = async ({
    email,
    password,
  }: {
    email: string
    password: string
  }) => {
    const resultOfSignUp = await this.auth.register(email, password)

    if (resultOfSignUp.status === 'error' && resultOfSignUp.message) {
      this.setState({
        signUp: {
          status: resultOfSignUp.status,
          errorMessage: resultOfSignUp.message,
        },
      })
      // Add notistack here
      this.showLoginStatus({
        status: resultOfSignUp.status,
        errorMessage: resultOfSignUp.message,
      })

      return
    }

    if (resultOfSignUp.status === 'ok') {
      this.setState({
        signUp: {
          status: 'success',
          errorMessage: '',
        },
      })
      // Add notistack here
      // this.showLoginStatus({
      //   status: 'success',
      //   errorMessage: '',
      // })

      // trying to login
      this.authenticateWithPasswordHandler({ username: email, password })
    }
  }

  sendConfirmEmailAgaingHandler = async ({
    userId,
    accessToken,
  }: {
    userId: string
    accessToken: string
  }) => {
    const resultOfSendConfirmEmail = await this.auth.sendVerificationEmail({
      userId,
      accessToken,
    })

    const checkThatErrorDuringConfirmEmailSending =
      resultOfSendConfirmEmail.error && resultOfSendConfirmEmail.message

    if (checkThatErrorDuringConfirmEmailSending) {
      this.setState((prevState) => ({
        ...prevState,
        confirmEmailSend: {
          status: resultOfSendConfirmEmail.error,
          errorMessage: resultOfSendConfirmEmail.message,
        },
      }))
      // Add notistack here
      this.showLoginStatus({
        status: resultOfSendConfirmEmail.error,
        errorMessage: resultOfSendConfirmEmail.message,
      })

      return
    }

    this.setState({
      confirmEmailSend: {
        status: 'success',
        errorMessage: '',
      },
    })
    // Add notistack here
    this.showLoginStatus({
      status: 'success',
      errorMessage: '',
    })
  }

  sendConfirmEmailAgaingFakeHandler = async ({
    userId,
    accessToken,
  }: {
    userId: string
    accessToken: string
  }) => {
    await sleep(randomInteger(300, 1400))

    this.setState({
      confirmEmailSend: {
        status: 'success',
        errorMessage: '',
      },
    })
    // Add notistack here
    this.showLoginStatus({
      status: 'success',
      errorMessage: '',
    })
  }

  render() {
    const {
      forWithdrawal,
      userEmailHosting = '',
      onLogout,
      userId = '',
      accessToken = '',
    } = this.props
    const {
      currentStep,
      signIn,
      enterOtp,
      authenticateWithRecovery,
      forgotPassword,
      signUp,
      barcodeUri,
      recoveryCode,
      newRecoveryCode,
    } = this.state
    return (
      <>
        {currentStep === 'signIn' && (
          <SignIn
            onLoginWithGoogleClick={this.auth.googleSingup}
            onLoginButtonClick={this.authenticateWithPasswordHandler}
            changeStep={this.changeCurrentStep}
            status={signIn.status}
            errorMessage={signIn.errorMessage}
            forWithdrawal={forWithdrawal}
          />
        )}
        {currentStep === 'enterOtp' && (
          <EnterOtp
            otpCompleteHandler={this.otpCompleteHandler}
            changeStep={this.changeCurrentStep}
            status={enterOtp.status}
            errorMessage={enterOtp.errorMessage}
            forWithdrawal={forWithdrawal}
          />
        )}
        {currentStep === 'recoveryCode' && (
          <EnterRecoveryCode
            processAuthentificationHandler={
              this.callProcessAuthentificationHandler
            }
            enterRecoveryCodeHandler={this.enterRecoveryCodeHandler}
            status={authenticateWithRecovery.status}
            errorMessage={authenticateWithRecovery.errorMessage}
            newRecoveryCode={newRecoveryCode}
            forWithdrawal={forWithdrawal}
          />
        )}
        {currentStep === 'configureMfa' && (
          <ChooseMfaProvider
            associateMfaMethodHandler={this.associateMfaMethodHandler}
          />
        )}
        {currentStep === 'setupMfa' && (
          <SetUpMfa
            changeStep={this.changeCurrentStep}
            barcodeUri={barcodeUri}
            recoveryCode={recoveryCode}
          />
        )}
        {currentStep === 'forgotPassword' && (
          <ForgotPassword
            status={forgotPassword.status}
            errorMessage={forgotPassword.errorMessage}
            onForgotPasswordClick={this.forgotPasswordHandler}
            forWithdrawal={forWithdrawal}
          />
        )}
        {currentStep === 'signUp' && (
          <SignUp
            onSignUpButtonClick={this.signUpWithPasswordHandler}
            onSignUpWithGoogleClick={this.auth.googleSingup}
            status={signUp.status}
            errorMessage={signUp.errorMessage}
          />
        )}
        {currentStep === 'confirmEmail' && (
          <ConfirmEmail
            onLogout={onLogout}
            sendConfirmEmailAgaingHandler={
              this.sendConfirmEmailAgaingFakeHandler
            }
            userEmailHosting={userEmailHosting}
            userId={userId}
            accessToken={accessToken}
          />
        )}
      </>
    )
  }
}

export default compose(withSnackbar)(LoginComposition)
