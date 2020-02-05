import React from 'react'
import { ILoginStep, IProps, IState } from './LoginComposition.types'

import Auth from '@sb/compositions/Onboarding/Auth'
const auth = new Auth()

import { SetUpMfa, EnterRecoveryCode, ChooseMfaProvider, EnterOtp } from '@sb/compositions/Login/MFA'
import ConfirmEmail from '@sb/compositions/Login/ConfirmEmail/ConfirmEmail'
import ForgotPassword from '@sb/compositions/Login/ForgotPassword/ForgotPassword'
import SignIn from '@sb/compositions/Login/SignIn/SignIn'
import SignUp from '@sb/compositions/Login/SignUp/SignUp'




class LoginComposition extends React.PureComponent<IProps, IState> {
  state: IState = {
    currentStep: 'signIn',
  }

  render() {
    //   return (
    //     <>
    //       {currentStep === 'start' && (
    //       )}
    //       {currentStep === 'otherStep' && (
    //       )}
    //     </>
    //   )
  }
}

export default compose(withTheme)(LoginComposition)
