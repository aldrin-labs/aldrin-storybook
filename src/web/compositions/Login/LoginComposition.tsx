import React from 'react'
import { compose } from 'recompose'
import { withSnackbar, withSnackbarProps } from 'notistack'

import { ILoginStep, IProps, IState } from './LoginComposition.types'

import Auth from '@sb/compositions/Onboarding/Auth'
const auth = new Auth()

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
    currentStep: 'signIn',
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
    const resultOfAuthenticate = await auth.authSimple({ username, password })

    const { access_token, id_token } = resultOfAuthenticate

    // if mfa for this user is disabled
    if (access_token && access_token.length && id_token && id_token.length) {
      this.setState({
        accessToken: access_token,
        idToken: id_token,
      })
      this.showLoginStatus({
        status: 'success',
        errorMessage: '',
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
      resultOfAuthenticate.mfa_token !== ''
    ) {
      const listOfAssociatedMfa = await auth.listOfAssociatedMfa({
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
    const resultOfAssociationWithMfaMethod = await auth.authMfaAssociate({
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

    const resultOfAuthenticateWithRecoveryCode = await auth.authMfa({
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
      () => {
        // Add notistack here
        this.showLoginStatus({
          status: 'success',
          errorMessage: '',
        })

        // should be handler after authetication
        console.log('this.state', this.state)
      }
    )
  }

  otpCompleteHandler = async (otp: string) => {
    const { mfaToken } = this.state

    const resultOfAuthenticateWithOtp = await auth.authMfa({
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
      () => {
        // Add notistack here
        this.showLoginStatus({
          status: 'success',
          errorMessage: '',
        })

        //TODO: should be handler after authetication
        console.log('this.state', this.state)
      }
    )
  }

  forgotPasswordHandler = async ({ email }: { email: string }) => {
    const resultOfForgotPassowrd = await auth.changePassword({
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

  processAuthentificationHandler = () => {}

  render() {
    const {
      currentStep,
      signIn,
      enterOtp,
      authenticateWithRecovery,
      forgotPassword,
      barcodeUri,
      recoveryCode,
      newRecoveryCode,
    } = this.state
    return (
      <>
        {currentStep === 'signIn' && (
          <SignIn
            onLoginWithGoogleClick={auth.googleSingup}
            onLoginButtonClick={this.authenticateWithPasswordHandler}
            changeStep={this.changeCurrentStep}
            status={signIn.status}
            errorMessage={signIn.errorMessage}
          />
        )}
        {currentStep === 'enterOtp' && (
          <EnterOtp
            otpCompleteHandler={this.otpCompleteHandler}
            changeStep={this.changeCurrentStep}
            status={enterOtp.status}
            errorMessage={enterOtp.errorMessage}
          />
        )}
        {currentStep === 'recoveryCode' && (
          <EnterRecoveryCode
            processAuthentificationHandler={this.processAuthentificationHandler}
            enterRecoveryCodeHandler={this.enterRecoveryCodeHandler}
            status={authenticateWithRecovery.status}
            errorMessage={authenticateWithRecovery.errorMessage}
            newRecoveryCode={newRecoveryCode}
          />
        )}
        {currentStep === 'configureMfa' && (
          <ChooseMfaProvider changeStep={this.associateMfaMethodHandler} />
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
          />
        )}
      </>
    )
  }
}

export default compose(withSnackbar)(LoginComposition)
