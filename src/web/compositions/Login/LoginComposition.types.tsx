import { withSnackbarProps } from 'notistack'

export type ILoginStep =
  | 'signIn'
  | 'enterOtp'
  | 'recoveryCode'
  | 'configureMfa'
  | 'setupMfa'
  | 'forgotPassword'
  | 'signUp'

export interface IProps extends withSnackbarProps {
  onLogin: (profile: any, idToken: any, accessToken: string) => Promise<void>
  initialStep: 'signIn' | 'signUp'
  forWithdrawal?: boolean 
}

export interface IState {
  currentStep: ILoginStep
  accessToken: string
  idToken: string
  mfaToken: string
  // TODO: delete secret
  secret: string
  barcodeUri: string
  recoveryCode: string
  newRecoveryCode: string
  signIn: {
    status: 'error' | 'success' | string
    errorMessage: string
  }
  enterOtp: {
    status: 'error' | 'success' | string
    errorMessage: string
  }
  associateMfa: {
    status: 'error' | 'success' | string
    errorMessage: string
  }
  authenticateWithOtp: {
    status: 'error' | 'success' | string
    errorMessage: string
  }
  authenticateWithRecovery: {
    status: 'error' | 'success' | string
    errorMessage: string
  }
  forgotPassword: {
    status: 'error' | 'success' | string
    errorMessage: string
  }
  signUp: {
    status: 'error' | 'success' | string
    errorMessage: string
  }
}
