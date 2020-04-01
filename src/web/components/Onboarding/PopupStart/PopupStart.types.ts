import { withSnackbarProps } from 'notistack'
import { Theme } from '@material-ui/core'

export interface IProps extends withSnackbarProps {
  open: boolean
  theme: Theme
  creatingAdditionalAccount: boolean
  setCurrentStep: (step: string) => void
  generateBrokerKeyMutation: () => Promise<{
    data: {
      generateBrokerKey: {
        status: 'ERR' | 'OK'
        errorMessage: string
      }
    }
  }>
  completeOnboarding: () => Promise<void>
}

export interface IState {
  internalLoading: boolean
  errorDuringBrokerKeyGeneration: boolean
  errorDuringOnboarding: boolean
}
